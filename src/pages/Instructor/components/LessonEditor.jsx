import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowRightCircle,
  ChevronDown,
  ChevronUp,
  FileArchive,
  FileText,
  GripVertical,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button, ConfirmationDialog, ErrorMessage, Modal, RichTextEditor } from '../../../components';
import Input from '../../../components/Input';
import { validateSingleField } from '../../../schemas/helpers';
import { lessonContentSchema, lessonPointsSchema, lessonTitleSchema } from '../../../schemas/lessonSchema';
import { getPlainText, onlyDigits } from '../../../utils/text';
import YouTubeVideoField from './YouTubeVideoField';


const LessonEditor = ({
  lesson,
  index,
  onLessonChange,
  onRemoveLesson,
  onAddResource,
  onResourceChange,
  onRemoveResource,
  onRestoreResource,
  onUpdateResource,
  id,
  moduleId,
}) => {
  const [expanded, setExpanded] = useState(true);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  const editorRef = useRef(null);
  const [editorHeight, setEditorHeight] = useState(0);
  useEffect(() => {
    const update = () => setEditorHeight(editorRef.current?.offsetHeight || 0);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [lesson.description]);

  const [titleError, setTitleError] = useState('');
  const [pointsError, setPointsError] = useState('');
  const [contentError, setContentError] = useState('');

  const [confirmState, setConfirmState] = useState({
    open: false,
    type: null, // 'lesson' | 'resource'
    resourceId: null,
    resourceIndex: null,
  });
  const openConfirm = (type, payload = {}) =>
    setConfirmState({
      open: true,
      type,
      resourceId: payload.id ?? null,
      resourceIndex: typeof payload.idx === 'number' ? payload.idx : null,
    });
  const closeConfirm = () =>
    setConfirmState({ open: false, type: null, resourceId: null, resourceIndex: null });
  const confirmDelete = async () => {
    if (confirmState.type === 'lesson') {
      onRemoveLesson(index);
    } else if (confirmState.type === 'resource') {
      onRemoveResource(index, confirmState.resourceId, confirmState.resourceIndex);
    }
    closeConfirm();
  };

  const titleSchema = lessonTitleSchema;

  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [materialForm, setMaterialForm] = useState({
    label: '',
    url: '',
    type: 'link',
    file: null,
  });
  const fileInputRef = useRef(null);

  const [materialNameError, setMaterialNameError] = useState('');
  const [materialUrlError, setMaterialUrlError] = useState('');
  const [materialFileError, setMaterialFileError] = useState('');

  const isValidUrlForType = (url, _type) => {
    const u = (url || '').trim().toLowerCase();
    if (u.length < 3 || u.length > 300) return false;
    return /^https?:\/\//.test(u);
  };

  const canSubmitMaterial = () => {
    const trimmedLabel = (materialForm.label || '').trim();
    if (trimmedLabel.length < 3 || trimmedLabel.length > 120) return false;
    if (materialForm.type === 'link') {
      return isValidUrlForType(materialForm.url, materialForm.type);
    }
    return !!materialForm.file;
  };

  useEffect(() => {
    const name = (materialForm.label || '').trim();
    setMaterialNameError(
      name.length === 0 ? '' : name.length < 3 || name.length > 120 ? 'O nome deve ter entre 3 e 120 caracteres' : ''
    );
    const u = (materialForm.url || '').trim();
    setMaterialFileError('');
    if (materialForm.type === 'link') {
      if (u.length === 0) {
        setMaterialUrlError('');
      } else if (!/^https?:\/\//.test(u)) {
        setMaterialUrlError('Informe uma URL iniciando com http:// ou https://');
      } else {
        setMaterialUrlError('');
      }
    } else {
      setMaterialUrlError('');
      const f = materialForm.file;
      if (!f) {
        setMaterialFileError('Selecione um arquivo para enviar');
      } else {
        const acceptMap = {
          pdf: ['application/pdf'],
          zip: ['application/zip', 'application/x-zip-compressed'],
          image: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        };
        const allowed = acceptMap[materialForm.type] || [];
        if (allowed.length && !allowed.includes(f.type)) {
          setMaterialFileError('Tipo de arquivo não permitido para o tipo selecionado');
        } else {
          setMaterialFileError('');
        }
      }
    }
  }, [materialForm]);

  const handleAddMaterial = () => {
    const { label, url, type, file } = materialForm;

    const trimmedLabel = (label || '').trim();
    if (trimmedLabel.length < 3 || trimmedLabel.length > 120) {
      setMaterialNameError('O nome deve ter entre 3 e 120 caracteres');
      return;
    }

    if (type === 'link') {
      const trimmedUrl = (url || '').trim();
      if (!isValidUrlForType(trimmedUrl, type)) {
        setMaterialUrlError('URL inválida para o tipo selecionado');
        return;
      }
      if (editingResource && typeof onUpdateResource === 'function') {
        onUpdateResource(index, editingResource.resource.id, {
          label: trimmedLabel,
          type,
          content: trimmedUrl,
        });
      } else {
        onAddResource(index, type, { content: trimmedUrl, label: trimmedLabel });
      }
    } else {
      if (!file) {
        setMaterialFileError('Selecione um arquivo para enviar');
        return;
      }
      if (editingResource && typeof onUpdateResource === 'function') {
        onUpdateResource(index, editingResource.resource.id, {
          label: trimmedLabel,
          type,
          content: '',
          file: file,
        });
      } else {
        onAddResource(index, type, { content: '', label: trimmedLabel, file: file });
      }
    }

    setIsMaterialModalOpen(false);
    setEditingResource(null);
    setMaterialForm({ label: '', url: '', type: 'link', file: null });
    setMaterialNameError('');
    setMaterialUrlError('');
    setMaterialFileError('');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-4 rounded-xl border border-gray-200 ${
        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
      } p-6 md:p-7 shadow-sm`}
    >

      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center">
          <button
            {...listeners}
            {...attributes}
            className="mr-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
            aria-label="Arrastar aula"
            type="button"
          >
            <GripVertical size={18} />
          </button>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-full bg-gray-100 p-1 hover:bg-gray-200 mr-2"
          >
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </button>

          <span className="text-base md:text-lg font-semibold text-gray-800">
            Aula {index + 1} · {lesson.title || '(sem título)'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => openConfirm('lesson')}
          className="rounded-full p-1 hover:bg-red-50"
        >
          <Trash2 className="h-5 w-5 text-red-500 hover:text-red-600" />
        </button>
      </div>

      {expanded && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div>

            <div className="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-5">
              <div className="md:col-span-4">
                <label className="text-xs font-medium text-gray-600">
                  Título da Aula
                </label>
                <Input
                  value={lesson.title}
                  onChange={(e) =>
                    onLessonChange(index, 'title', e.target.value)
                  }
                  onBlur={(e) => {
                    const err = validateSingleField(
                      titleSchema,
                      { title: e.target.value },
                      'title'
                    );
                    setTitleError(err || '');
                  }}
                  error={!!titleError}
                />
                <ErrorMessage message={titleError} />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">
                  Pontos da Aula
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={typeof lesson.points === 'number' ? String(lesson.points) : ''}
                  onChange={(e) => {
                    const digits = onlyDigits(e.target.value);
                    const nextVal = digits.length ? parseInt(digits, 10) : undefined;
                    onLessonChange(index, 'points', nextVal);
                    setPointsError(digits.length ? '' : 'Pontos da aula são obrigatórios');
                  }}
                  onBlur={() => {
                    const err = validateSingleField(
                      lessonPointsSchema,
                      { points: typeof lesson.points === 'number' ? lesson.points : undefined },
                      'points'
                    );
                    setPointsError(err || '');
                  }}
                  error={!!pointsError}
                />
                <ErrorMessage message={pointsError} />
              </div>
            </div>

            <div className="mt-5" ref={editorRef}>
              <div className="mb-2">
                <label className="text-xs font-medium text-gray-600">
                  Conteúdo da Aula
                </label>
              </div>

              <RichTextEditor
                value={lesson.description || ''}
                onChange={(html) => {
                  onLessonChange(index, 'description', html);
                }}
                onBlur={() => {
                  const plain = getPlainText(lesson.description || '').trim();
                  if (!plain) {
                    setContentError('');
                    return;
                  }
                  const err = validateSingleField(
                    lessonContentSchema,
                    { description: lesson.description || '' },
                    'description'
                  );
                  setContentError(err || '');
                }}
                placeholder="Escreva o conteúdo da aula..."
              />
              <ErrorMessage message={contentError} />
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-medium text-gray-600">
                  Materiais Complementares
                </label>
                <button
                  type="button"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                  onClick={() => {
                    setEditingResource(null);
                    setMaterialForm({ label: '', url: '', type: 'link', file: null });
                    setMaterialNameError('');
                    setMaterialUrlError('');
                    setMaterialFileError('');
                    setIsMaterialModalOpen(true);
                  }}
                >
                  + Adicionar Material
                </button>
              </div>



              {(lesson.resources || []).filter((r) => r.type !== 'youtube')
                .length === 0 ? (
                <p className="text-xs text-gray-500">
                  Nenhum material adicionado.
                </p>
              ) : (
                <div className="space-y-2">
                  {(lesson.resources || [])
                    .filter((r) => r.type !== 'youtube')
                    .map((res, idx) => (
                      <div key={res.id} className="flex items-center gap-1">
                        {res.type === 'pdf' && (
                          <FileText className="h-4 w-4 text-gray-600" />
                        )}
                        {res.type === 'zip' && (
                          <FileArchive className="h-4 w-4 text-gray-600" />
                        )}
                        {res.type === 'image' && (
                          <ImageIcon className="h-4 w-4 text-gray-600" />
                        )}
                        {res.type === 'link' && (
                          <LinkIcon className="h-4 w-4 text-gray-600" />
                        )}

                        <span className={`text-xs font-medium mr-1 ${res.deleted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                          {res.label || 'Material'}
                        </span>

                        {res.content && !res.deleted && (
                          <a
                            href={res.content}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Abrir material"
                            title="Abrir material"
                            className="flex h-6 w-6 items-center justify-center rounded text-gray-700 transition-colors hover:bg-gray-100"
                          >

                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                              <circle cx="12" cy="12" r="3" strokeWidth="2" />
                            </svg>
                          </a>
                        )}

                        {!res.deleted && (
                          <button
                            type="button"
                            aria-label="Editar material"
                            title="Editar material"
                            className="flex h-6 w-6 items-center justify-center rounded text-blue-600 transition-colors hover:bg-blue-50"
                            onClick={() => {
                              setMaterialForm({
                                label: res.label || '',
                                url: res.content || '',
                                type: res.type,
                                file: null,
                              });
                              setEditingResource({ resource: res, index: idx });
                              setMaterialNameError('');
                              setMaterialUrlError('');
                              setMaterialFileError('');
                              setIsMaterialModalOpen(true);
                            }}
                          >

                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                            </svg>
                          </button>
                        )}

                        {res.deleted ? (
                          <button
                            type="button"
                            aria-label="Reverter remoção"
                            title="Reverter remoção"
                            className="flex h-6 w-6 items-center justify-center rounded text-blue-600 transition-colors hover:bg-blue-50"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (typeof onRestoreResource === 'function') {
                                onRestoreResource(index, res.id, idx);
                              }
                            }}
                          >
                            <ArrowRightCircle className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openConfirm('resource', { id: res.id, idx });
                            }}
                            aria-label="Remover material"
                            title="Remover material"
                            className="flex h-6 w-6 items-center justify-center rounded text-red-600 transition-colors hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                        {res.deleted && (
                          <span className="ml-1 text-[10px] text-red-600">(remoção pendente)</span>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>


          <div className="relative md:pl-6">
            <span
              aria-hidden="true"
              className="hidden md:block absolute left-0 top-3 bottom-3 w-[2px] bg-gradient-to-b from-transparent via-gray-300/70 to-transparent"
            />
            <YouTubeVideoField
              lesson={lesson}
              lessonIndex={index}
              onAddResource={onAddResource}
              onResourceChange={onResourceChange}
              maxHeight={editorHeight}
            />
          </div>
        </div>
      )}

      <Modal
        isOpen={isMaterialModalOpen}
        onClose={() => {
          setIsMaterialModalOpen(false);
          setEditingResource(null);
          setMaterialForm({ label: '', url: '', type: 'link', file: null });
          setMaterialNameError('');
          setMaterialUrlError('');
          setMaterialFileError('');
        }}
        title={editingResource ? 'Editar Material' : 'Adicionar Material'}
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Nome do material
            </label>
            <Input
              value={materialForm.label}
              onChange={(e) =>
                setMaterialForm((f) => ({ ...f, label: e.target.value }))
              }
              placeholder="Ex: Slides da Aula"
            />
            <ErrorMessage message={materialNameError} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Tipo</label>
            <select
              className="w-full rounded-lg border px-4 py-3 text-sm bg-white transition focus:ring-2 focus:outline-none border-gray-300 focus:ring-blue-500 appearance-none"
              value={materialForm.type}
              onChange={(e) =>
                setMaterialForm((f) => ({ ...f, type: e.target.value, url: '', file: null }))
              }
            >
              <option value="link">Link externo</option>
              <option value="pdf">PDF</option>
              <option value="zip">ZIP</option>
              <option value="image">Imagem</option>
            </select>
          </div>

          {materialForm.type === 'link' ? (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">URL</label>
              <Input
                value={materialForm.url}
                onChange={(e) => setMaterialForm((f) => ({ ...f, url: e.target.value }))}
                placeholder={'https://...'}
              />
              <ErrorMessage message={materialUrlError} />
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Arquivo</label>
              <input
                ref={fileInputRef}
                type="file"
                accept={
                  materialForm.type === 'pdf'
                    ? 'application/pdf'
                    : materialForm.type === 'zip'
                      ? 'application/zip,application/x-zip-compressed'
                      : 'image/*'
                }
                className="w-full rounded-lg border px-3 py-2 text-sm bg-white transition focus:ring-2 focus:outline-none border-gray-300 focus:ring-blue-500"
                onChange={(e) => setMaterialForm((f) => ({ ...f, file: e.target.files?.[0] || null }))}
              />
              <ErrorMessage message={materialFileError} />
            </div>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <Button onClick={handleAddMaterial} disabled={!canSubmitMaterial()} className="px-4 py-2">
              {editingResource ? 'Salvar alterações' : 'Adicionar'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Diálogo de confirmação (deve ficar dentro do componente) */}
      <ConfirmationDialog
        isOpen={confirmState.open}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
        title={confirmState.type === 'lesson' ? 'Remover Aula' : 'Remover Material'}
        message={
          confirmState.type === 'lesson'
            ? 'Tem certeza que deseja remover esta aula? A remoção só terá efeito ao clicar em Anterior ou Próximo.'
            : 'Tem certeza que deseja remover este material? A remoção só terá efeito ao clicar em Anterior ou Próximo.'
        }
        variant="danger"
        actionType="delete"
      />
    </div>
  );
};

export default LessonEditor;
