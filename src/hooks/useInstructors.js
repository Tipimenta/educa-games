import { useState } from 'react';

import { useConfirm } from '../context';
import {
  initialActiveInstructors,
  initialInactiveInstructors,
  initialPendingInvites,
} from '../mocks/data';
import { instructorService } from '../services';
import { useToast } from './useToast';

export const useInstructors = () => {
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  const [activeInstructors, setActiveInstructors] = useState([...initialActiveInstructors]);
  const [inactiveInstructors, setInactiveInstructors] = useState([...initialInactiveInstructors]);
  const [pendingInvites, setPendingInvites] = useState([...initialPendingInvites]);

  const suspendInstructor = async (id) => {
    const instructor = activeInstructors.find((i) => i.id === id);
    if (!instructor) return;

    try {
      await confirm({
        title: 'Inativar Instrutor',
        message: `Tem certeza que deseja inativar ${instructor.name}?`,
        variant: 'warning',
        actionType: 'delete',
      });

      const result = instructorService.suspendInstructor(
        activeInstructors,
        inactiveInstructors,
        id
      );
      if (result.success) {
        setActiveInstructors(result.activeInstructors);
        setInactiveInstructors(result.inactiveInstructors);
        showToast({ message: `${instructor.name} foi inativado`, type: 'success' });
      }
    } catch {
      // Usuário cancelou
    }
  };

  const reactivateInstructor = async (id) => {
    const instructor = inactiveInstructors.find((i) => i.id === id);
    if (!instructor) return;

    try {
      await confirm({
        title: 'Reativar Instrutor',
        message: `Tem certeza que deseja reativar ${instructor.name}?`,
        variant: 'info',
        actionType: 'resend',
      });

      const result = instructorService.reactivateInstructor(
        inactiveInstructors,
        activeInstructors,
        id
      );
      if (result.success) {
        setActiveInstructors(result.activeInstructors);
        setInactiveInstructors(result.inactiveInstructors);
        showToast({ message: `${instructor.name} foi reativado`, type: 'success' });
      }
    } catch {
      // Usuário cancelou
    }
  };

  const removeInstructor = async (id, isActive = true) => {
    const instructors = isActive ? activeInstructors : inactiveInstructors;
    const instructor = instructors.find((i) => i.id === id);
    if (!instructor) return;

    try {
      await confirm({
        title: 'Remover Instrutor',
        message: `Tem certeza que deseja remover ${instructor.name} permanentemente? Esta ação não pode ser desfeita.`,
        variant: 'danger',
        actionType: 'delete',
      });

      const result = instructorService.removeInstructor(instructors, id, isActive);
      if (result.success) {
        if (isActive) {
          setActiveInstructors(result.instructors);
        } else {
          setInactiveInstructors(result.instructors);
        }
        showToast({ message: `${instructor.name} foi removido`, type: 'success' });
      }
    } catch {
      // Usuário cancelou
    }
  };

  const resendInvite = async (id) => {
    const invite = pendingInvites.find((i) => i.id === id);
    if (!invite) return;

    try {
      await confirm({
        title: 'Reenviar Convite',
        message: `Deseja reenviar o convite para ${invite.email}?`,
        variant: 'info',
        actionType: 'resend',
      });

      const result = instructorService.resendInvite(pendingInvites, id);
      if (result.success) {
        setPendingInvites(result.invites);
        showToast({ message: `Convite reenviado para ${invite.email}`, type: 'success' });
      }
    } catch {
      // Usuário cancelou
    }
  };

  const removeInvite = async (id) => {
    const invite = pendingInvites.find((i) => i.id === id);
    if (!invite) return;

    try {
      await confirm({
        title: 'Remover Convite',
        message: `Tem certeza que deseja remover o convite para ${invite.email}?`,
        variant: 'danger',
        actionType: 'delete',
      });

      const result = instructorService.removeInvite(pendingInvites, id);
      if (result.success) {
        setPendingInvites(result.invites);
        showToast({ message: `Convite removido`, type: 'success' });
      }
    } catch {
      // Usuário cancelou
    }
  };

  const sendNewInvite = (email) => {
    const newInvite = instructorService.createInvite(email);
    setPendingInvites((prev) => [...prev, newInvite]);
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
