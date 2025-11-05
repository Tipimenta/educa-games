import { useState } from 'react';

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
