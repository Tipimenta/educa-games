import { useState } from 'react';

/**
 * Hook genérico para gerenciar estado de modal com formulário
 * @param {Object} config - Configuração do hook
 * @param {Function} config.onSubmit - Função chamada ao submeter o formulário
 * @param {Function} config.onReset - Função opcional para resetar campos adicionais
 * @param {Object} config.initialValues - Valores iniciais dos campos do formulário
 * @returns {Object} - Estado e funções para gerenciar o modal e formulário
 */
export const useModalForm = ({ onSubmit, onReset, initialValues = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formValues, setFormValues] = useState(initialValues);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormValues(initialValues);
    if (onReset) onReset();
    setIsOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    // Copiar valores do item para o formulário
    const itemValues = Object.keys(initialValues).reduce((acc, key) => {
      acc[key] = item[key] ?? initialValues[key];
      return acc;
    }, {});
    setFormValues(itemValues);
    if (onReset) onReset(item);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingItem(null);
    setFormValues(initialValues);
    if (onReset) onReset();
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSubmit(formValues, editingItem, closeModal);
  };

  const updateFormValue = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  return {
    isOpen,
    editingItem,
    formValues,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    updateFormValue,
    setFormValues,
  };
};
