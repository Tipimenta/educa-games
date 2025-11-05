import { useState } from 'react';

import { Button, ConfirmationDialog, PageTitle } from '../../components';

const TestConfirmation = () => {
  const [dialogs, setDialogs] = useState({
    delete: false,
    resend: false,
    warning: false,
    info: false,
    custom: false,
  });

  const openDialog = (type) => {
    setDialogs((prev) => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type) => {
    setDialogs((prev) => ({ ...prev, [type]: false }));
  };

  const handleConfirm = async (action) => {
    console.log(`Ação confirmada: ${action}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Ação "${action}" executada com sucesso!`);
  };

  return (
    <div className="p-6">
      <PageTitle title="Teste - Componente de Confirmação" />

      <div className="mx-auto max-w-4xl">
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Teste Delete */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Excluir Item</h3>
            <p className="mb-4 text-sm text-gray-600">
              Diálogo de confirmação para exclusão (variante danger)
            </p>
            <Button
              onClick={() => openDialog('delete')}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Excluir Item
            </Button>
          </div>

          {/* Teste Resend */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Reenviar</h3>
            <p className="mb-4 text-sm text-gray-600">
              Diálogo de confirmação para reenvio (variante info)
            </p>
            <Button
              onClick={() => openDialog('resend')}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Reenviar Convite
            </Button>
          </div>

          {/* Teste Warning */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Aviso</h3>
            <p className="mb-4 text-sm text-gray-600">
              Diálogo de confirmação com aviso (variante warning)
            </p>
            <Button
              onClick={() => openDialog('warning')}
              className="bg-yellow-600 text-white hover:bg-yellow-700"
            >
              Ação com Aviso
            </Button>
          </div>

          {/* Teste Info */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Informação</h3>
            <p className="mb-4 text-sm text-gray-600">Diálogo informativo (variante info)</p>
            <Button
              onClick={() => openDialog('info')}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Mostrar Info
            </Button>
          </div>

          {/* Teste Custom */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Personalizado</h3>
            <p className="mb-4 text-sm text-gray-600">
              Diálogo personalizado com textos customizados
            </p>
            <Button
              onClick={() => openDialog('custom')}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              Ação Personalizada
            </Button>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 font-semibold">Como usar:</h3>
          <pre className="overflow-x-auto rounded border bg-white p-4 text-sm">
            {`import { ConfirmationDialog } from '../components';

const [showDialog, setShowDialog] = useState(false);

const handleDelete = async () => {
  console.log('Item excluído');
  setShowDialog(false);
};

<ConfirmationDialog
  isOpen={showDialog}
  onClose={() => setShowDialog(false)}
  onConfirm={handleDelete}
  actionType="delete" // 'delete', 'resend', 'custom'
  variant="danger" // 'danger', 'warning', 'info'
  title="Título personalizado" // opcional
  message="Mensagem personalizada" // opcional
/>`}
          </pre>
        </div>
      </div>

      {/* Diálogos de Confirmação */}
      <ConfirmationDialog
        isOpen={dialogs.delete}
        onClose={() => closeDialog('delete')}
        onConfirm={() => handleConfirm('excluir')}
        actionType="delete"
      />

      <ConfirmationDialog
        isOpen={dialogs.resend}
        onClose={() => closeDialog('resend')}
        onConfirm={() => handleConfirm('reenviar')}
        actionType="resend"
      />

      <ConfirmationDialog
        isOpen={dialogs.warning}
        onClose={() => closeDialog('warning')}
        onConfirm={() => handleConfirm('aviso')}
        variant="warning"
        title="Atenção!"
        message="Esta ação pode ter consequências importantes. Deseja continuar?"
        confirmText="Sim, continuar"
        cancelText="Cancelar"
      />

      <ConfirmationDialog
        isOpen={dialogs.info}
        onClose={() => closeDialog('info')}
        onConfirm={() => handleConfirm('informação')}
        variant="info"
        title="Informação"
        message="Esta é uma ação informativa que será executada."
        confirmText="Entendi"
        cancelText="Voltar"
      />

      <ConfirmationDialog
        isOpen={dialogs.custom}
        onClose={() => closeDialog('custom')}
        onConfirm={() => handleConfirm('personalizada')}
        variant="info"
        title="Ação Personalizada"
        message="Este é um exemplo de diálogo totalmente personalizado com textos específicos."
        confirmText="Executar Ação"
        cancelText="Não, obrigado"
      />
    </div>
  );
};

export default TestConfirmation;
