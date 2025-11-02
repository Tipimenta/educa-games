/**
 * Service for instructor-related business logic
 */

export const instructorService = {
  /**
   * Suspends (deactivates) an instructor
   */
  suspendInstructor: (instructors, inactiveInstructors, instructorId) => {
    const instructor = instructors.find((i) => i.id === instructorId);
    if (!instructor) return { success: false, error: 'Instrutor não encontrado' };

    const updatedActive = instructors.filter((i) => i.id !== instructorId);
    const updatedInactive = [...inactiveInstructors, instructor];

    return {
      success: true,
      activeInstructors: updatedActive,
      inactiveInstructors: updatedInactive,
    };
  },

  /**
   * Reactivates an instructor
   */
  reactivateInstructor: (inactiveInstructors, activeInstructors, instructorId) => {
    const instructor = inactiveInstructors.find((i) => i.id === instructorId);
    if (!instructor) return { success: false, error: 'Instrutor não encontrado' };

    const updatedInactive = inactiveInstructors.filter((i) => i.id !== instructorId);
    const updatedActive = [...activeInstructors, instructor];

    return {
      success: true,
      activeInstructors: updatedActive,
      inactiveInstructors: updatedInactive,
    };
  },

  /**
   * Removes an instructor permanently
   */
  removeInstructor: (instructors, instructorId, isActive = true) => {
    const instructor = instructors.find((i) => i.id === instructorId);
    if (!instructor) return { success: false, error: 'Instrutor não encontrado' };

    const updatedInstructors = instructors.filter((i) => i.id !== instructorId);

    return {
      success: true,
      instructors: updatedInstructors,
      instructor,
    };
  },

  /**
   * Creates a new invite
   */
  createInvite: (email) => {
    const sentAt = new Date();
    const expiresAt = new Date(sentAt);
    expiresAt.setDate(expiresAt.getDate() + 7); // Expira em 7 dias

    return {
      id: Date.now(),
      email: email.trim(),
      sentAt: sentAt.toISOString().split('T')[0],
      expiresAt: expiresAt.toISOString().split('T')[0],
      status: 'Pendente',
    };
  },

  /**
   * Resends an invite
   */
  resendInvite: (invites, inviteId) => {
    const invite = invites.find((i) => i.id === inviteId);
    if (!invite) return { success: false, error: 'Convite não encontrado' };

    const sentAt = new Date();
    const expiresAt = new Date(sentAt);
    expiresAt.setDate(expiresAt.getDate() + 7); // Expira em 7 dias

    const updatedInvites = invites.map((i) =>
      i.id === inviteId
        ? {
            ...i,
            sentAt: sentAt.toISOString().split('T')[0],
            expiresAt: expiresAt.toISOString().split('T')[0],
          }
        : i
    );

    return {
      success: true,
      invites: updatedInvites,
      invite,
    };
  },

  /**
   * Removes an invite
   */
  removeInvite: (invites, inviteId) => {
    const invite = invites.find((i) => i.id === inviteId);
    if (!invite) return { success: false, error: 'Convite não encontrado' };

    const updatedInvites = invites.filter((i) => i.id !== inviteId);

    return {
      success: true,
      invites: updatedInvites,
      invite,
    };
  },
};

