import { useEffect, useMemo, useRef, useState } from 'react';
import { ErrorMessage } from '../../../components';
import Input from '../../../components/Input';
import { useToast } from '../../../hooks';
import { validateSingleField } from '../../../schemas/helpers';
import { youtubeUrlSchema } from '../../../schemas/lessonSchema';
import { getYouTubeEmbedUrl, getYouTubeId } from '../../../utils/youtube';

const YouTubeVideoField = ({
  lesson,
  lessonIndex,
  onAddResource,
  onResourceChange,
  maxHeight,
}) => {
  const { showToast } = useToast();
  const youtubeIndex = useMemo(() => {
    return (lesson.resources || []).findIndex((r) => r.type === 'youtube');
  }, [lesson.resources]);

  const youtubeUrl = youtubeIndex >= 0 ? lesson.resources[youtubeIndex]?.content || '' : '';

  const hasCreatedYouTubeRef = useRef(false);
  useEffect(() => {
    hasCreatedYouTubeRef.current = youtubeIndex >= 0;
  }, [youtubeIndex]);

  const [youtubeInput, setYoutubeInput] = useState(youtubeUrl);
  useEffect(() => {
    setYoutubeInput(youtubeUrl);
  }, [youtubeUrl]);

  const [videoUrlError, setVideoUrlError] = useState('');

  const [youtubeTitle, setYoutubeTitle] = useState('');
  const youTubeId = getYouTubeId(youtubeUrl);
  const isYouTubeValid = !!youTubeId;
  useEffect(() => {
    setYoutubeTitle('');
    if (!isYouTubeValid) return;
    const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeUrl)}&format=json`;
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.title) setYoutubeTitle(data.title);
      })
      .catch(() => {});
  }, [youtubeUrl, isYouTubeValid]);

  const previewRef = useRef(null);
  const [computedHeight, setComputedHeight] = useState(0);
  useEffect(() => {
    const update = () => {
      const w = previewRef.current?.offsetWidth || 0;
      const byRatio = Math.round((w > 0 ? w : 0) * 9 / 16);
      const capEditor = typeof maxHeight === 'number' && maxHeight > 0 ? maxHeight : Infinity;
      const capViewport = Math.round(window.innerHeight * 0.6);
      const target = Math.min(byRatio || 0, capEditor, capViewport);
      setComputedHeight(Math.max(180, target || 0));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [maxHeight]);

  return (
    <div>
      <div className="flex items-center gap-2">
        <label className="mb-2 text-xs font-medium text-gray-600">Vídeo da aula</label>
      </div>

      <div>
        <Input
          placeholder="Insira a URL do vídeo no YouTube"
          value={youtubeInput}
          onChange={(e) => {
            const val = e.target.value;
            setYoutubeInput(val);
            if (youtubeIndex < 0 && !hasCreatedYouTubeRef.current) {
              onAddResource(lessonIndex, 'youtube', { content: val });
              hasCreatedYouTubeRef.current = true;
            } else if (youtubeIndex >= 0) {
              onResourceChange(lessonIndex, youtubeIndex, val);
            }
          }}
          onBlur={() => {
            const err = validateSingleField(youtubeUrlSchema, { youtubeUrl: youtubeInput }, 'youtubeUrl');
            setVideoUrlError(err || '');
            if (err && !(typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV)) {
              showToast({ message: 'Não foi possível renderizar a pré-visualização do vídeo. Verifique a URL.', type: 'error' });
            }
          }}
          error={!!videoUrlError}
        />
        <ErrorMessage message={videoUrlError} />
      </div>

      <div className="mt-4 text-sm font-medium text-gray-700">Pré-visualização do Vídeo</div>
      <div ref={previewRef} className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-1 w-full mx-auto overflow-hidden">
        <div className="w-full overflow-hidden rounded bg-white" style={{ height: computedHeight || undefined }}>
          {getYouTubeEmbedUrl(youtubeUrl) ? (
            <iframe
              title={`Vídeo da aula ${lessonIndex + 1}${youtubeTitle ? ` — ${youtubeTitle}` : ''}`}
              src={getYouTubeEmbedUrl(youtubeUrl)}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">Pré-visualização do Vídeo</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YouTubeVideoField;
