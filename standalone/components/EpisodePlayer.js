import React, { useEffect, useMemo, useRef, useState } from 'react';
import htm from 'htm';
import CheckpointModal from './CheckpointModal.js';
import ResultsPanel from './ResultsPanel.js';

const html = htm.bind(React.createElement);

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

  return html`
    <section className="episode">
      <div className="card card--subtle">
        <div className="card__top">
          <h2 className="card__title">Listen & explore</h2>
          <p className="card__meta">
            ${episode.checkpoints.length} reflection stop${episode.checkpoints.length === 1 ? '' : 's'}
          </p>
        </div>
        <audio ref=${audioRef} className="audio-player" controls src=${episode.audioUrl}>
          Your browser does not support the audio element.
        </audio>
        <ul className="checkpoint-list">
          ${episode.checkpoints.map((checkpoint) => {
            const completed = completedCheckpointIds.has(checkpoint.id);
            return html`<li className="checkpoint-item" key=${checkpoint.id}>
              <div>
                <p className="checkpoint-item__text">${checkpoint.prompt}</p>
                <p className="checkpoint-item__time">Stop at ${formatTime(checkpoint.timeMs / 1000)}</p>
              </div>
              <span className=${`checkpoint-pill ${completed ? 'checkpoint-pill--done' : ''}`}>
                ${completed ? 'Completed' : 'Upcoming'}
              </span>
            </li>`;
          })}
        </ul>
      </div>

      ${recentCheckpointId
        ? html`<${ResultsPanel}
            checkpoint=${episode.checkpoints.find((checkpoint) => checkpoint.id === recentCheckpointId)}
            responses=${recentResponses}
          />`
        : null}

      ${isEpisodeComplete
        ? html`<div className="thanks-card">
            Thank you for walking the ridge. Your reflections live on this device and guide the collective pulse of La
            Montañita.
          </div>`
        : null}

      ${activeCheckpoint
        ? html`<${CheckpointModal} checkpoint=${activeCheckpoint} onSubmit=${handleAnswer} />`
        : null}
    </section>
  `;
};

export default EpisodePlayer;
