import { FileTextIcon } from '../../../components/Icons'; // 1. Importar o ícone de ficheiro

// Função helper para extrair o ID do vídeo do YouTube
const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;
  let videoId = null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v');
    }
  } catch (e) {
    // Fallback para URLs que não sejam links completos
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    videoId = match ? match[1] : null;
  }
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
};

const ModuleContentViewer = ({
  selectedModule,
  activeSelection,
  activeLesson,
  completedLessons,
  lessonProgress,
  allLessonsCompleted,
  onLessonSelect,
  onToggleLesson,
  renderQuiz,
}) => {
  // 2. Filtrar os recursos da aula ativa
  const youtubeResources = activeLesson?.resources?.filter((r) => r.type === 'youtube') || [];
  const pdfResources = activeLesson?.resources?.filter((r) => r.type === 'pdf') || [];
  const hasResources = youtubeResources.length > 0 || pdfResources.length > 0;

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-600">
          Progresso: {Math.round(lessonProgress)}%
        </p>
        <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-green-500 transition-all"
            style={{ width: `${lessonProgress}%` }}
          ></div>
        </div>
      </div>
      {activeLesson ? (
        <>
          <h3 className="mb-4 text-2xl font-bold text-gray-800">{activeLesson.title}</h3>
          <p className="mb-6 whitespace-pre-wrap text-gray-700">{activeLesson.description}</p>

          {/* 3. Bloco dinâmico para renderizar os recursos */}
          {hasResources && (
            <div className="mb-6 border-t pt-6">
              <h4 className="mb-4 text-lg font-semibold text-gray-800">Recursos da Aula</h4>

              {/* Renderiza os Vídeos do YouTube */}
              {youtubeResources.map((video, index) => {
                const embedUrl = getYoutubeEmbedUrl(video.content);
                if (!embedUrl) return null;
                return (
                  <div key={video.id} className="mb-4">
                    <p className="mb-2 text-sm font-medium text-gray-700">Vídeo {index + 1}</p>
                    <div className="aspect-video overflow-hidden rounded-lg border">
                      <iframe
                        width="100%"
                        height="100%"
                        src={embedUrl}
                        title={`YouTube video ${index + 1}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                );
              })}

              {/* Renderiza os links de PDF */}
              {pdfResources.length > 0 && (
                <div className="mt-4 space-y-2">
                  {pdfResources.map((pdf, index) => (
                    <a
                      key={pdf.id}
                      href={pdf.content} // Assumindo que 'content' é a URL do PDF
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-200"
                    >
                      <FileTextIcon className="h-5 w-5 text-gray-600" />
                      <span>Material de Apoio {index + 1} (PDF)</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* Fim do bloco de recursos */}

          <div className="border-t pt-4">
            <label
              className={`flex items-center ${
                completedLessons.has(activeLesson.id)
                  ? 'cursor-not-allowed opacity-60'
                  : 'cursor-pointer'
              }`}
            >
              <input
                type="checkbox"
                checked={completedLessons.has(activeLesson.id)}
                onChange={() => onToggleLesson(activeLesson)}
                disabled={completedLessons.has(activeLesson.id)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600"
              />
              <span className="ml-3 font-semibold text-gray-700">
                Marcar como concluída (+{activeLesson.points} pontos)
              </span>
            </label>
          </div>
        </>
      ) : (
        <p>Selecione um item no menu para começar.</p>
      )}
    </div>
  );
};

export default ModuleContentViewer;
