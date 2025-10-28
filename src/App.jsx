import { useMemo, useState } from 'react';
import EpisodePlayer from './components/EpisodePlayer.jsx';
import episodesData from './data/episodes.json';
import { addResponse, loadResponses } from './storage.js';

function App() {
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-text">
        <p className="text-lg">No episodes available yet. Please check back soon.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8 sm:px-8">
        <header className="mb-8 space-y-2 text-center">
          <p className="text-sm uppercase tracking-widest text-accent">La Montañita</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">{selectedEpisode.title}</h1>
          {selectedEpisode.description && (
            <p className="text-base text-gray-600 sm:text-lg">{selectedEpisode.description}</p>
          )}
        </header>

        <EpisodePlayer
          episode={selectedEpisode}
          responses={responses}
          onCheckpointAnswered={handleResponse}
        />
      </div>
    </div>
  );
}

export default App;
