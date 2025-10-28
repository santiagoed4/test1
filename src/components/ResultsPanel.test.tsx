import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ResultsPanel from './ResultsPanel.jsx';

const checkpoint = {
  id: 'choice',
  type: 'choice',
  prompt: 'Choose your anchor',
  options: ['Peace', 'Freedom'],
};

describe('ResultsPanel', () => {
  it('renders aggregate choice percentages', () => {
    const responses = [
      { episodeId: 'ep1', checkpointId: 'choice', answer: 'Peace' },
      { episodeId: 'ep1', checkpointId: 'choice', answer: 'Peace' },
      { episodeId: 'ep1', checkpointId: 'choice', answer: 'Freedom' },
    ];

    render(<ResultsPanel checkpoint={checkpoint} responses={responses} />);

    expect(screen.getByText('Peace')).toBeInTheDocument();
    expect(screen.getByText('Freedom')).toBeInTheDocument();
    expect(screen.getByText('67%')).toBeInTheDocument();
    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  it('shows nothing when there are no responses', () => {
    const { container } = render(<ResultsPanel checkpoint={checkpoint} responses={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
