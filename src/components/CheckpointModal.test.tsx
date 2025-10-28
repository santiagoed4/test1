import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CheckpointModal from './CheckpointModal.jsx';

const baseCheckpoint = {
  id: 'cp-1',
  prompt: 'Write one word',
  type: 'text',
};

describe('CheckpointModal', () => {
  it('disables continue until a text answer is provided', () => {
    render(<CheckpointModal checkpoint={baseCheckpoint} onSubmit={vi.fn()} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Peace' } });

    expect(submitButton).not.toBeDisabled();
  });

  it('requires a selection for choice checkpoints', () => {
    const checkpoint = {
      ...baseCheckpoint,
      type: 'choice',
      options: ['Peace', 'Time'],
    };
    const handleSubmit = vi.fn();

    render(<CheckpointModal checkpoint={checkpoint} onSubmit={handleSubmit} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();

    const radio = screen.getByLabelText('Time');
    fireEvent.click(radio);

    expect(submitButton).not.toBeDisabled();

    fireEvent.click(submitButton);
    expect(handleSubmit).toHaveBeenCalledWith('Time');
  });
});
