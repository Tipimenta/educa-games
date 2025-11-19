import { useContext, useEffect, useRef, useState } from 'react';

import {
  AppLayout,
  Button,
  ConfirmationDialog,
  DatePicker,
  EmptyState,
  ErrorMessage,
  Input,
  PageTitle,
  PencilIcon,
  XIcon,
} from '../../components';
import { AuthContext } from '../../context';
import { useAuth, useProfile, useToast, useUpdateProfile } from '../../hooks';
import { validateAll, validateSingleField } from '../../schemas/helpers';
import { profileSchema } from '../../schemas/profileSchema';
import { presentError } from '../../services/api';

const ProfilePage = () => {
  const { user, loading: userLoading, setUser } = useContext(AuthContext);
  const { logout } = useAuth();
  const { showToast } = useToast();

  const { data: profile, isLoading: profileLoading } = useProfile({ enabled: !!user });
  const updateProfile = useUpdateProfile();

  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [birthDate, setBirthDate] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [inlineError, setInlineError] = useState('');
  const [birthError, setBirthError] = useState('');
  const [isRemoveDialogOpen, setRemoveDialogOpen] = useState(false);

  // Estados de edição e validação por campo
  const [editingName, setEditingName] = useState(false);
  const [editingBirth, setEditingBirth] = useState(false);
  const [nameError, setNameError] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [birthTouched, setBirthTouched] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const initialRef = useRef({ name: '', birthDate: '', description: '' });

  const MAX_SIZE = 3 * 1024 * 1024; // 3MB
  const ALLOWED_TYPES = ['image/png', 'image/jpeg']; // png, jpg, jpeg

  useEffect(() => {
    if (profile) {
      setUserName(profile.name || '');
      const initial =
        profile.avatarUrl ||
        `https://placehold.co/100x100/E2E8F0/4A5568?text=${profile?.name?.charAt(0).toUpperCase() || 'U'}`;
      setProfileImage(initial);
      setBirthDate(profile.birthDate || '');
      setBio(profile.description || '');
      setInlineError('');
      setRemoveAvatar(false);
      setAvatarFile(null);
      setEditingName(false);
      setEditingBirth(false);
      setNameError('');
      setBirthError('');
      setNameTouched(false);
      setBirthTouched(false);
      setEditingBio(false);
      initialRef.current = {
        name: profile.name || '',
        birthDate: profile.birthDate || '',
        description: profile.description || '',
      };
    }
  }, [profile]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!ALLOWED_TYPES.includes(file.type)) {
        showToast({ message: 'Formato inválido. Aceita PNG, JPG e JPEG.', type: 'error' });
        return;
      }
      if (file.size > MAX_SIZE) {
        showToast({ message: 'Imagem maior que 3MB. Selecione um arquivo menor.', type: 'error' });
        return;
      }

      setInlineError('');
      setRemoveAvatar(false);
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setUserName(value);
    if (nameTouched) {
      const err = validateSingleField(profileSchema, { name: value, birthDate }, 'name');
      setNameError(err || '');
    }
  };

  const handleBirthChange = (newValue) => {
    setBirthDate(newValue);
    if (birthTouched) {
      const err = validateSingleField(profileSchema, { name: userName, birthDate: newValue }, 'birthDate');
      setBirthError(err || '');
    }
  };

  const hasChanges = () => {
    const init = initialRef.current;
    const basicChanged =
      (userName ?? '') !== (init.name ?? '') ||
      (birthDate ?? '') !== (init.birthDate ?? '') ||
      (bio ?? '') !== (init.description ?? '');
    const avatarChanged = removeAvatar || Boolean(avatarFile);
    return basicChanged || avatarChanged;
  };

  const hasFieldErrors = () => {
    return Boolean(nameError) || Boolean(birthError) || Boolean(inlineError);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInlineError('');
    setBirthError('');
    setNameTouched(true);
    setBirthTouched(true);

    try {
      const payload = {
        name: userName,
        birthDate: birthDate || '',
        description: bio,
        clearDescription: bio.trim().length === 0,
        removeAvatar,
        avatarFile: removeAvatar ? null : avatarFile,
      };

      const errors = validateAll(profileSchema, payload);
      if (errors.name || errors.birthDate) {
        if (errors.birthDate) setBirthError(errors.birthDate);
        if (errors.name) setNameError(errors.name);
        return;
      }
      const updated = await updateProfile.mutateAsync(payload);

      setUserName(updated?.name ?? userName);
      setBirthDate(updated?.birthDate ?? birthDate);
      setBio(updated?.description ?? bio);
      if (updated?.avatarUrl) {
        setProfileImage(updated.avatarUrl);
      } else if (removeAvatar) {
        setProfileImage(
          `https://placehold.co/100x100/E2E8F0/4A5568?text=${(updated?.name || userName)?.charAt(0).toUpperCase() || 'U'}`
        );
      }

      // Atualiza header/menus imediatamente
      if (user) {
        setUser({ ...user, name: updated?.name ?? user.name });
      }

      showToast({ message: 'Perfil atualizado com sucesso!', type: 'success' });
      setRemoveAvatar(false);
      setAvatarFile(null);
      setEditingName(false);
      setEditingBirth(false);
    } catch (error) {
      // Tratamento específico para erro 409 (Conflict) em upload de avatar
      if (error.status === 409 && avatarFile) {
        const errorMessage = error.data?.message || error.message || '';
        const isDuplicateError = errorMessage.toLowerCase().includes('duplicate') ||
                                 errorMessage.toLowerCase().includes('already exists') ||
                                 errorMessage.toLowerCase().includes('já existe');

        if (isDuplicateError) {
          showToast({
            message: 'Erro ao fazer upload da foto. Tente novamente',
            type: 'error'
          });
          setInlineError('Erro ao fazer upload da foto');
          setAvatarFile(null);
          return;
        }
      }

      presentError({
        status: error.status || 500,
        errData: error.data || { message: error.message },
        setInline: setInlineError,
        showToast,
      });
    }
  };

  if (userLoading || profileLoading) {
    return (
      <AppLayout user={user} onLogout={logout}>
        <div className="text-center">
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout user={user} onLogout={logout}>
        <EmptyState
          message="Perfil não encontrado"
          description="Não foi possível carregar os dados do seu perfil. Tente fazer login novamente."
          className="mt-4"
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} onLogout={logout}>
      <PageTitle>Meu Perfil</PageTitle>

      <div className="rounded-lg bg-white p-8 shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center md:flex-row md:items-start">
            <div className="mb-6 flex flex-col items-center md:mr-10 md:mb-0">
              <div className="relative">
                <img
                  src={profileImage || null}
                  alt="Foto do Perfil"
                  className="h-32 w-32 rounded-full object-cover"
                />
                {profile?.avatarUrl && !removeAvatar && (
                  <button
                    type="button"
                    aria-label="Remover foto"
                    title="Remover foto"
                    onClick={() => setRemoveDialogOpen(true)}
                    className="absolute right-1 top-1 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-gray-200 text-gray-700 shadow hover:bg-gray-300"
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
              <label
                htmlFor="profile-upload"
                className="mt-4 cursor-pointer rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
              >
                Trocar Foto
              </label>
              <input
                id="profile-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className="mt-2 text-xs text-gray-500">Aceita PNG, JPG e JPEG, até 3MB.</div>
            </div>

            <div className="w-full flex-1">
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="email">
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Seu e-mail"
                  value={profile?.email || user?.email || ''}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="name">
                  Nome
                </label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={userName}
                    onChange={handleNameChange}
                    onBlur={() => {
                      setNameTouched(true);
                      const err = validateSingleField(profileSchema, { name: userName, birthDate }, 'name');
                      setNameError(err || '');
                    }}
                    readOnly={!editingName}
                    error={Boolean(nameError)}
                  />
                  {!editingName ? (
                    <button
                      type="button"
                      aria-label="Editar nome"
                      title="Editar nome"
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setEditingName(true)}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      aria-label="Descartar edição"
                      title="Descartar edição"
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        setUserName(initialRef.current.name || '');
                        setNameError('');
                        setNameTouched(false);
                        setEditingName(false);
                      }}
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <ErrorMessage message={nameTouched ? nameError : ''} />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="birthdate">
                  Data de Nascimento
                </label>
                <div className="relative">
                  {editingBirth ? (
                    <DatePicker
                      value={birthDate}
                      onChange={(v) => {
                        handleBirthChange(v);
                      }}
                      error={Boolean(birthError)}
                    />
                  ) : (
                    <Input
                      id="birthdate"
                      type="text"
                      readOnly
                      value={(() => {
                        if (!birthDate) return '';
                        const [y, m, d] = birthDate.split('-');
                        if (!y || !m || !d) return '';
                        return `${d}/${m}/${y}`;
                      })()}
                      placeholder="Selecione sua data de nascimento"
                      className="bg-gray-100"
                    />
                  )}
                  {!editingBirth ? (
                    <button
                      type="button"
                      aria-label="Editar data"
                      title="Editar data"
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setEditingBirth(true)}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      aria-label="Descartar edição"
                      title="Descartar edição"
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        setBirthDate(initialRef.current.birthDate || '');
                        setBirthError('');
                        setBirthTouched(false);
                        setEditingBirth(false);
                      }}
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <ErrorMessage message={birthTouched ? birthError : ''} />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="bio">
                  Biografia
                </label>
                <div className="relative">
                  <textarea
                    id="bio"
                    placeholder="Fale um pouco sobre você..."
                    className={`mb-2 w-full rounded-lg border px-4 py-3 transition focus:ring-2 focus:outline-none ${
                      editingBio
                        ? 'border-gray-300 focus:ring-blue-500'
                        : 'border-gray-300 bg-gray-100'
                    }`}
                    rows="4"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    readOnly={!editingBio}
                  ></textarea>
                  {!editingBio ? (
                    <button
                      type="button"
                      aria-label="Editar biografia"
                      title="Editar biografia"
                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                      onClick={() => setEditingBio(true)}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      aria-label="Descartar edição"
                      title="Descartar edição"
                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        setBio(initialRef.current.description || '');
                        setEditingBio(false);
                      }}
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
                {inlineError ? (
                  <div className="text-sm text-red-600">{inlineError}</div>
                ) : null}
              </div>
              <Button type="submit" disabled={!hasChanges() || hasFieldErrors() || updateProfile.isLoading}>
                {updateProfile.isLoading ? 'Processando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </form>
      </div>
      <ConfirmationDialog
        isOpen={isRemoveDialogOpen}
        onClose={() => setRemoveDialogOpen(false)}
        onConfirm={() => {
          setRemoveAvatar(true);
          setAvatarFile(null);
          setInlineError('');
          setRemoveDialogOpen(false);
        }}
        title="Remover foto do perfil"
        message="Deseja remover a foto? A alteração será aplicada ao salvar."
        confirmText="Remover"
        cancelText="Cancelar"
        variant="danger"
        actionType="custom"
      />
    </AppLayout>
  );
};

export default ProfilePage;
