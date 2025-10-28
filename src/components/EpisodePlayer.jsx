import { useEffect, useMemo, useRef, useState } from 'react';
import CheckpointModal from './CheckpointModal.jsx';
import ResultsPanel from './ResultsPanel.jsx';

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
};

const EpisodePlayer = ({ episode, responses, onCheckpointAnswered }) => {
  const audioRef = useRef(null);
  const [activeCheckpointId, setActiveCheckpointId] = useState(null);
  const [recentCheckpointId, setRecentCheckpointId] = useState(null);

  const completedCheckpointIds = useMemo(() => {
    return new Set(
      responses
        .filter((response) => response.episodeId === episode.id)
        .map((response) => response.checkpointId)
    );
  }, [responses, episode.id]);

  useEffect(() => {
    const lastResponse = [...responses]
      .filter((response) => response.episodeId === episode.id)
      .pop();
    setRecentCheckpointId(lastResponse?.checkpointId ?? null);
  }, [responses, episode.id]);

  const activeCheckpoint = useMemo(() => {
    return episode.checkpoints.find((checkpoint) => checkpoint.id === activeCheckpointId) ?? null;
  }, [episode.checkpoints, activeCheckpointId]);

  const isEpisodeComplete =
    completedCheckpointIds.size === episode.checkpoints.length && episode.checkpoints.length > 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (activeCheckpoint) return;
      const currentMs = audio.currentTime * 1000;
      const nextCheckpoint = episode.checkpoints.find(
        (checkpoint) => !completedCheckpointIds.has(checkpoint.id) && currentMs >= checkpoint.timeMs
      );
      if (nextCheckpoint) {
        setActiveCheckpointId(nextCheckpoint.id);
      }
    };

    const handlePlay = () => {
      if (activeCheckpoint) {
        audio.pause();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('seeked', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('seeked', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
    };
  }, [episode.checkpoints, completedCheckpointIds, activeCheckpoint]);

  useEffect(() => {
    if (activeCheckpoint) {
      audioRef.current?.pause();
    }
  }, [activeCheckpoint]);

  const handleAnswer = (answer) => {
    if (!activeCheckpoint) return;
    const audio = audioRef.current;
    const timestamp = audio ? Math.round(audio.currentTime * 1000) : activeCheckpoint.timeMs;

    onCheckpointAnswered({
      episodeId: episode.id,
      checkpointId: activeCheckpoint.id,
      timestamp,
      answer,
    });

    setRecentCheckpointId(activeCheckpoint.id);
    setActiveCheckpointId(null);

    requestAnimationFrame(() => {
      if (!audio) return;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(() => {});
      }
    });
  };

  const recentResponses = useMemo(() => {
    if (!recentCheckpointId) return [];
    return responses.filter(
      (response) => response.episodeId === episode.id && response.checkpointId === recentCheckpointId
    );
  }, [responses, episode.id, recentCheckpointId]);

  return (
    <section className="flex flex-1 flex-col">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-accent">Listen &amp; explore</h2>
          <p className="text-sm text-gray-500">
            {episode.checkpoints.length} reflection stop{episode.checkpoints.length === 1 ? '' : 's'}
          </p>
        </div>
        <audio
          ref={audioRef}
          className="w-full"
          controls
          src={episode.audioUrl}
        >
          Your browser does not support the audio element.
        </audio>
        <ul className="mt-6 space-y-3">
          {episode.checkpoints.map((checkpoint) => {
            const completed = completedCheckpointIds.has(checkpoint.id);
            return (
              <li
                key={checkpoint.id}
                className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700"
              >
                <div>
                  <p className="font-medium text-gray-800">{checkpoint.prompt}</p>
                  <p className="text-xs text-gray-500">Stop at {formatTime(checkpoint.timeMs / 1000)}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    completed ? 'bg-accent/10 text-accent' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {completed ? 'Completed' : 'Upcoming'}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {recentCheckpointId && (
        <ResultsPanel
          checkpoint={episode.checkpoints.find((checkpoint) => checkpoint.id === recentCheckpointId)}
          responses={recentResponses}
        />
      )}

      {isEpisodeComplete && (
        <div className="mt-6 rounded-3xl bg-accent/10 p-6 text-center text-sm text-accent">
          Thank you for walking the ridge. Your reflections live on this device and guide the collective pulse of La
          Montañita.
        </div>
      )}

      {activeCheckpoint && (
        <CheckpointModal checkpoint={activeCheckpoint} onSubmit={handleAnswer} />
      )}
    </section>
  );
};

export default EpisodePlayer;
