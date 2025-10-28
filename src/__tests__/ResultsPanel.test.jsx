import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import ResultsPanel from '../components/ResultsPanel.jsx';

describe('ResultsPanel', () => {
  test('renders choice results with percentages', () => {
    render(
      <ResultsPanel
        checkpoint={{
          id: 'cp-choice',
          type: 'choice',
          prompt: 'Choose your anchor',
          options: ['Peace', 'Time', 'Freedom'],
        }}
        responses={[
          { episodeId: 'ep1', checkpointId: 'cp-choice', answer: 'Peace' },
          { episodeId: 'ep1', checkpointId: 'cp-choice', answer: 'Peace' },
          { episodeId: 'ep1', checkpointId: 'cp-choice', answer: 'Freedom' },
        ]}
      />
    );

    expect(screen.getByText('Peace')).toBeInTheDocument();
    expect(screen.getByText('67%')).toBeInTheDocument();
    expect(screen.getByText('Freedom')).toBeInTheDocument();
    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  test('renders shared words for text responses', () => {
    render(
      <ResultsPanel
        checkpoint={{ id: 'cp-text', type: 'text', prompt: 'Share a word' }}
        responses={[
          { episodeId: 'ep1', checkpointId: 'cp-text', answer: 'Peace and calm' },
          { episodeId: 'ep1', checkpointId: 'cp-text', answer: 'Calm breeze' },
          { episodeId: 'ep1', checkpointId: 'cp-text', answer: 'Peace of mind' },
        ]}
      />
    );

    expect(screen.getByText('peace')).toBeInTheDocument();
    expect(screen.getByText('calm')).toBeInTheDocument();
    expect(screen.getByText(/×2/)).toBeInTheDocument();
  });
});
