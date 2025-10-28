import React from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

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

    return html`
      <div className="results-card">
        <h3 className="results-card__title">Community anchor</h3>
        <div className="results-card__body">
          ${counts.map(({ option, count }) => {
            const percent = total === 0 ? 0 : Math.round((count / total) * 100);
            return html`<div className="results-line" key=${option}>
              <div className="results-line__top">
                <span>${option}</span>
                <span>${percent}%</span>
              </div>
              <div className="results-bar">
                <div className="results-bar__fill" style=${{ width: `${percent}%` }}></div>
              </div>
            </div>`;
          })}
        </div>
        <p className="results-card__meta">
          ${total} reflection${total === 1 ? '' : 's'} stored on this device.
        </p>
      </div>
    `;
  }

  const wordStats = buildWordStats(responses);

  return html`
    <div className="results-card">
      <h3 className="results-card__title">Shared words</h3>
      <div className="word-cloud">
        ${wordStats.length
          ? wordStats.map(
              ([word, count]) => html`<span className="word-chip" key=${word}>
                ${word}<span className="word-chip__count">×${count}</span>
              </span>`
            )
          : html`<p className="results-card__meta">
              Words will appear here as more reflections are saved on this device.
            </p>`}
      </div>
      <p className="results-card__meta">
        ${responses.length} reflection${responses.length === 1 ? '' : 's'} stored on this device.
      </p>
    </div>
  `;
};

export default ResultsPanel;
