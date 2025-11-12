import { useState } from 'react';

import {
  initialActiveInstructors,
  initialInactiveInstructors,
  initialPendingInvites,
} from '../mocks/data';
import { instructorService } from '../services';
import { useConfirmAction } from './useConfirmAction';
import { useSendInvite } from './useInvites';

export const useInstructors = () => {
  const { executeWithConfirmation } = useConfirmAction();
  const sendInviteMutation = useSendInvite();

  const [activeInstructors, setActiveInstructors] = useState([...initialActiveInstructors]);
  const [inactiveInstructors, setInactiveInstructors] = useState([...initialInactiveInstructors]);
  const [pendingInvites, setPendingInvites] = useState([...initialPendingInvites]);

  const suspendInstructor = async (id) => {
    const instructor = activeInstructors.find((i) => i.id === id);
    if (!instructor) return;

    await executeWithConfirmation({
      confirmConfig: {
        title: 'Inativar Instrutor',
        message: `Tem certeza que deseja inativar ${instructor.name}?`,
        variant: 'warning',
        actionType: 'delete',
      },
      action: () => {
        const result = instructorService.suspendInstructor(
          activeInstructors,
          inactiveInstructors,
          id
        );
        if (result.success) {
          setActiveInstructors(result.activeInstructors);
          setInactiveInstructors(result.inactiveInstructors);
        }
        return result;
      },
      successMessage: 'foi inativado',
      itemName: instructor.name,
    });
  };

  const reactivateInstructor = async (id) => {
    const instructor = inactiveInstructors.find((i) => i.id === id);
    if (!instructor) return;

    await executeWithConfirmation({
      confirmConfig: {
        title: 'Reativar Instrutor',
        message: `Tem certeza que deseja reativar ${instructor.name}?`,
        variant: 'info',
        actionType: 'resend',
      },
      action: () => {
        const result = instructorService.reactivateInstructor(
          inactiveInstructors,
          activeInstructors,
          id
        );
        if (result.success) {
          setActiveInstructors(result.activeInstructors);
          setInactiveInstructors(result.inactiveInstructors);
        }
        return result;
      },
      successMessage: 'foi reativado',
      itemName: instructor.name,
    });
  };

  const removeInstructor = async (id, isActive = true) => {
    const instructors = isActive ? activeInstructors : inactiveInstructors;
    const instructor = instructors.find((i) => i.id === id);
    if (!instructor) return;

    await executeWithConfirmation({
      confirmConfig: {
        title: 'Remover Instrutor',
        message: `Tem certeza que deseja remover ${instructor.name} permanentemente? Esta ação não pode ser desfeita.`,
        variant: 'danger',
        actionType: 'delete',
      },
      action: () => {
        const result = instructorService.removeInstructor(instructors, id, isActive);
        if (result.success) {
          if (isActive) {
            setActiveInstructors(result.instructors);
          } else {
            setInactiveInstructors(result.instructors);
          }
        }
        return result;
      },
      successMessage: 'foi removido',
      itemName: instructor.name,
    });
  };

  const resendInvite = async (id) => {
    const invite = pendingInvites.find((i) => i.id === id);
    if (!invite) return;

    await executeWithConfirmation({
      confirmConfig: {
        title: 'Reenviar Convite',
        message: `Deseja reenviar o convite para ${invite.email}?`,
        variant: 'info',
        actionType: 'resend',
      },
      action: () => {
        const result = instructorService.resendInvite(pendingInvites, id);
        if (result.success) {
          setPendingInvites(result.invites);
        }
        return result;
      },
      successMessage: `Convite reenviado para ${invite.email}`,
    });
  };

  const removeInvite = async (id) => {
    const invite = pendingInvites.find((i) => i.id === id);
    if (!invite) return;

    await executeWithConfirmation({
      confirmConfig: {
        title: 'Remover Convite',
        message: `Tem certeza que deseja remover o convite para ${invite.email}?`,
        variant: 'danger',
        actionType: 'delete',
      },
      action: () => {
        const result = instructorService.removeInvite(pendingInvites, id);
        if (result.success) {
          setPendingInvites(result.invites);
        }
        return result;
      },
      successMessage: 'Convite removido',
    });
  };

  const sendNewInvite = async (email) => {
    await sendInviteMutation.mutateAsync({ email });
    const newInvite = instructorService.createInvite(email);
    setPendingInvites((prev) => [...prev, newInvite]);

    return { success: true };
  };

  return {
    activeInstructors,
    inactiveInstructors,
    pendingInvites,
    setActiveInstructors,
    setInactiveInstructors,
    setPendingInvites,
    suspendInstructor,
    reactivateInstructor,
    removeInstructor,
    resendInvite,
    removeInvite,
    sendNewInvite,
  };
};
