import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import ClassSelectionModal from '../components/ClassSelectionModal';
import { useAuthUser } from '../hooks/useAuthQuery';

export const AuthContext = createContext({
  user: null,
  loading: true,
  setUser: () => {},
  pendingClasses: null,
  openClassSelection: () => {},
});

export function AuthProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [explicitUser, setExplicitUser] = useState(null);
  const [pendingClasses, setPendingClasses] = useState(null);
  const [showClassModal, setShowClassModal] = useState(false);
  const [isSelectingClass, setIsSelectingClass] = useState(false);
  const [isSwitchingClass, setIsSwitchingClass] = useState(false);
  const isLoggingOutRef = useRef(false);

  const isPublicPath = useMemo(() => {
    const publicPaths = ['/', '/login', '/signup', '/forgot-password', '/reset-password'];
    const pathname = location.pathname;
    return publicPaths.some((p) => pathname === p || (p !== '/' && pathname.startsWith(p)));
  }, [location.pathname]);

  const shouldFetchUser = !isPublicPath && !isLoggingOutRef.current;

  const {
    data: queryUser,
    isLoading: loading,
    refetch,
  } = useAuthUser({
    enabled: shouldFetchUser,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const user = explicitUser !== null ? explicitUser : queryUser;

  const handleClassSelection = useCallback(
    (classId) => {
      // Por enquanto, apenas atualiza o estado local e redireciona
      // TODO: Implementar chamada à API /auth/select-class quando necessário
      const userToUse = explicitUser || queryUser;
      if (userToUse) {
        const normalizedUser = {
          ...userToUse,
          classId: classId,
          classes: pendingClasses || userToUse.classes,
        };
        setExplicitUser(normalizedUser);
        setPendingClasses(null);
        setShowClassModal(false);
        setIsSelectingClass(false);
        setIsSwitchingClass(false);

        // Salva no sessionStorage para persistir durante a sessão
        const userId = normalizedUser.id || normalizedUser.userId;
        if (userId) {
          try {
            sessionStorage.setItem(`selectedClassId_${userId}`, String(classId));
          } catch (error) {
            console.error('Erro ao salvar classId no sessionStorage:', error);
          }
        }

        // Só redireciona se não for uma troca (quando isSwitchingClass é false)
        if (!isSwitchingClass) {
          navigate('/dashboard');
        }
      }
    },
    [explicitUser, queryUser, pendingClasses, navigate, isSwitchingClass]
  );

  const openClassSelection = useCallback(() => {
    const userToUse = explicitUser || queryUser;
    if (userToUse && userToUse.classes && Array.isArray(userToUse.classes) && userToUse.classes.length > 1) {
      setPendingClasses(userToUse.classes);
      setShowClassModal(true);
      setIsSwitchingClass(true);
    }
  }, [explicitUser, queryUser]);

  // Detecta múltiplas turmas quando o user é carregado
  useEffect(() => {
    // Não processa se estiver fazendo logout ou se for uma rota pública
    if (isLoggingOutRef.current || isPublicPath) {
      return;
    }

    if (explicitUser && explicitUser.classId) {
      return;
    }

    if (queryUser && queryUser.classes && Array.isArray(queryUser.classes)) {
      if (queryUser.classId) {
        return;
      }

      // Verifica se há um classId salvo no sessionStorage
      const userId = queryUser.id || queryUser.userId;
      let savedClassId = null;
      if (userId) {
        try {
          const saved = sessionStorage.getItem(`selectedClassId_${userId}`);
          if (saved) {
            const classIdNum = parseInt(saved, 10);
            const isValidClass = queryUser.classes.some((c) => c.id === classIdNum);
            if (isValidClass) {
              savedClassId = classIdNum;
            }
          }
        } catch (error) {
          console.error('Erro ao ler classId do sessionStorage:', error);
        }
      }

      if (savedClassId) {
        // Aplica o classId salvo automaticamente
        const normalizedUser = {
          ...queryUser,
          classId: savedClassId,
        };
        setExplicitUser(normalizedUser);
        return;
      }

      if (queryUser.classes.length > 1 && !showClassModal) {
        // Múltiplas turmas e nenhuma selecionada - mostra modal
        setPendingClasses(queryUser.classes);
        setShowClassModal(true);
      } else if (queryUser.classes.length === 1 && !showClassModal) {
        // Uma única turma - seleciona automaticamente
        handleClassSelection(queryUser.classes[0].id);
      }
    }
  }, [queryUser, handleClassSelection, explicitUser, showClassModal, isPublicPath]);

  const setUser = (newUser) => {
    if (newUser === null) {
      isLoggingOutRef.current = true;
      setExplicitUser(null);
      setPendingClasses(null);
      setShowClassModal(false);
      setIsSelectingClass(false);
      setIsSwitchingClass(false);

      // Limpa o sessionStorage ao fazer logout
      try {
        const keys = Object.keys(sessionStorage);
        keys.forEach((key) => {
          if (key.startsWith('selectedClassId_')) {
            sessionStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.error('Erro ao limpar sessionStorage:', error);
      }
    } else {
      isLoggingOutRef.current = false;
      // Verifica se há múltiplas turmas
      if (newUser.classes && Array.isArray(newUser.classes) && newUser.classes.length > 1 && !newUser.classId) {
        setPendingClasses(newUser.classes);
        setShowClassModal(true);
        setExplicitUser({ ...newUser, classId: null });
      } else {
        setExplicitUser(newUser);
        setPendingClasses(null);
        setShowClassModal(false);
        setIsSelectingClass(false);
        if (!isPublicPath) {
          refetch();
        }
      }
    }
  };

  useEffect(() => {
    if (isPublicPath) {
      isLoggingOutRef.current = false;
      // Limpa estados relacionados a turmas quando vai para rota pública
      setPendingClasses(null);
      setShowClassModal(false);
      setIsSwitchingClass(false);
    }
  }, [isPublicPath]);

  const handleCancelClassSelection = useCallback(() => {
    setShowClassModal(false);
    setIsSwitchingClass(false);
    setPendingClasses(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading: isPublicPath ? false : loading,
        pendingClasses,
        openClassSelection,
      }}
    >
      {children}
      <ClassSelectionModal
        isOpen={showClassModal && pendingClasses && pendingClasses.length > 0}
        classes={pendingClasses || []}
        onSelect={handleClassSelection}
        onCancel={handleCancelClassSelection}
        isLoading={false}
        allowCancel={isSwitchingClass}
        title={isSwitchingClass ? 'Trocar de turma' : 'Selecione sua turma'}
        message={
          isSwitchingClass
            ? 'Selecione qual turma você deseja visualizar:'
            : 'Foram encontradas múltiplas turmas com matrícula ativa. Selecione qual você deseja acessar:'
        }
      />
    </AuthContext.Provider>
  );
}
