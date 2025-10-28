const normalizeWord = (word) =>
  word
    .toLowerCase()
    .replace(/[^a-záéíóúñü']/gi, '')
    .trim();

const STOP_WORDS = new Set([
  'the',
  'and',
  'to',
  'a',
  'of',
  'in',
  'it',
  'is',
  'i',
  'you',
  'for',
  'on',
  'that',
  'with',
  'this',
  'my',
  'me',
]);

const buildWordStats = (responses) => {
  const counts = new Map();
  responses.forEach((response) => {
    const words = String(response.answer)
      .split(/\s+/)
      .map(normalizeWord)
      .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
    words.forEach((word) => {
      counts.set(word, (counts.get(word) ?? 0) + 1);
    });
  });
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);
};

const ResultsPanel = ({ checkpoint, responses }) => {
  if (!checkpoint || !responses?.length) {
    return null;
  }

  if (checkpoint.type === 'choice') {
    const total = responses.length;
    const counts = (checkpoint.options ?? []).map((option) => ({
      option,
      count: responses.filter((response) => response.answer === option).length,
    }));

    return (
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-accent">Community anchor</h3>
        <div className="space-y-4">
          {counts.map(({ option, count }) => {
            const percent = total === 0 ? 0 : Math.round((count / total) * 100);
            return (
              <div key={option}>
                <div className="mb-1 flex items-center justify-between text-sm font-medium text-gray-700">
                  <span>{option}</span>
                  <span>{percent}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-gray-500">{total} reflection{total === 1 ? '' : 's'} stored on this device.</p>
      </div>
    );
  }

  const wordStats = buildWordStats(responses);

  return (
    <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-accent">Shared words</h3>
      <div className="flex flex-wrap gap-2">
        {wordStats.length ? (
          wordStats.map(([word, count]) => (
            <span
              key={word}
              className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent"
            >
              {word}
              <span className="ml-1 text-xs text-accent/70">×{count}</span>
            </span>
          ))
        ) : (
          <p className="text-sm text-gray-500">
            Words will appear here as more reflections are saved on this device.
          </p>
        )}
      </div>
      <p className="mt-4 text-sm text-gray-500">{responses.length} reflection{responses.length === 1 ? '' : 's'} stored on this device.</p>
    </div>
  );
};

export default ResultsPanel;
