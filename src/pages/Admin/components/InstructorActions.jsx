import { Ban, CircleCheck, RotateCw, Trash2 } from 'lucide-react';

import { ActionButton } from '../../../components';

const InstructorActions = ({ tab, item, actions }) => {
  const { suspendInstructor, reactivateInstructor, removeInstructor, resendInvite, removeInvite } =
    actions;

  if (tab === 'active') {
    return (
      <>
        <ActionButton
          icon={Ban}
          onClick={() => suspendInstructor(item.id)}
          title="Inativar instrutor"
          variant="suspend"
        />
        <ActionButton
          icon={Trash2}
          onClick={() => removeInstructor(item.id)}
          title="Excluir instrutor"
          variant="delete"
        />
      </>
    );
  }

  if (tab === 'inactive') {
    return (
      <>
        <ActionButton
          icon={CircleCheck}
          onClick={() => reactivateInstructor(item.id)}
          title="Reativar instrutor"
          variant="activate"
        />
        <ActionButton
          icon={Trash2}
          onClick={() => removeInstructor(item.id)}
          title="Excluir instrutor"
          variant="delete"
        />
      </>
    );
  }

  if (tab === 'invites') {
    return (
      <>
        <ActionButton
          icon={RotateCw}
          onClick={() => resendInvite(item.id)}
          title="Reenviar convite"
          variant="resend"
        />
        <ActionButton
          icon={Trash2}
          onClick={() => removeInvite(item.id)}
          title="Excluir convite"
          variant="delete"
        />
      </>
    );
  }

  return null;
};

export default InstructorActions;
