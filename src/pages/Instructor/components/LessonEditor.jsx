import { Trash2Icon } from '../../../components/Icons';
import Input from '../../../components/Input';

const LessonEditor = ({
  lesson,
  index,
  onLessonChange,
  onRemoveLesson,
  onAddResource,
  onResourceChange,
  onRemoveResource,
}) => {
  return (
    <div className="mb-6 rounded-lg border bg-gray-50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-bold text-gray-700">Aula {index + 1}</span>
        <button onClick={() => onRemoveLesson(index)} aria-label={`Remover aula ${index + 1}`}>
          <Trash2Icon className="h-5 w-5 text-red-500 hover:text-red-700" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-5">
        <div className="md:col-span-4">
          <label className="text-xs font-medium text-gray-500">Título da Aula</label>
          <Input
            value={lesson.title}
            onChange={(e) => onLessonChange(index, 'title', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Pontos da Aula</label>
          <Input
            type="number"
            value={lesson.points || 0}
            onChange={(e) => onLessonChange(index, 'points', parseInt(e.target.value, 10) || 0)}
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="text-xs font-medium text-gray-500">Descrição / Conteúdo Principal</label>
        <textarea
          value={lesson.description}
          onChange={(e) => onLessonChange(index, 'description', e.target.value)}
          rows="4"
          className="w-full rounded-lg border bg-white p-2 text-gray-700"
        />
      </div>
      <div className="mt-4">
        <h5 className="mb-2 text-sm font-bold text-gray-600">Recursos da Aula</h5>
        {lesson.resources &&
          lesson.resources.map((resource, resIndex) => (
            <div key={resource.id} className="mb-2 flex items-center gap-2">
              {resource.type === 'youtube' && (
                <Input
                  placeholder="URL do YouTube (ex: https://youtu.be/ID_DO_VIDEO)"
                  value={resource.content}
                  onChange={(e) => onResourceChange(index, resIndex, e.target.value)}
                />
              )}
              {resource.type === 'pdf' && <Input type="file" />}
              <button
                onClick={() => onRemoveResource(index, resource.id)}
                aria-label={`Remover recurso ${resIndex + 1}`}
              >
                <Trash2Icon className="h-5 w-5 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          ))}
        <div className="mt-2 flex gap-4">
          <button
            onClick={() => onAddResource(index, 'youtube')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            + Vídeo do YouTube
          </button>
          <button
            onClick={() => onAddResource(index, 'pdf')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            + Ficheiro PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonEditor;
