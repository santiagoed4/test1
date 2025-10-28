import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'htm';
import EpisodePlayer from './components/EpisodePlayer.js';
import episodesData from './data/episodes.js';
import { addResponse, loadResponses } from './storage.js';

const html = htm.bind(React.createElement);

const App = () => {
  const [responses, setResponses] = useState(() => loadResponses());
  const [selectedEpisodeId] = useState(episodesData.episodes[0]?.id ?? null);

  const selectedEpisode = useMemo(() => {
    return episodesData.episodes.find((episode) => episode.id === selectedEpisodeId) ?? null;
  }, [selectedEpisodeId]);

  const handleResponse = (response) => {
    const updated = addResponse(response);
    setResponses(updated);
  };

  if (!selectedEpisode) {
    return html`<div className="empty-state">No episodes available yet. Please check back soon.</div>`;
  }

  return html`
    <div className="page">
      <div className="wrapper">
        <header className="header">
          <p className="header__tagline">La Montañita</p>
          <h1 className="header__title">${selectedEpisode.title}</h1>
          ${selectedEpisode.description
            ? html`<p className="header__description">${selectedEpisode.description}</p>`
            : null}
        </header>
        <${EpisodePlayer}
          episode=${selectedEpisode}
          responses=${responses}
          onCheckpointAnswered=${handleResponse}
        />
      </div>
    </div>
  `;
};

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(html`<${App} />`);
