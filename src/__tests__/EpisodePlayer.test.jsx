import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import EpisodePlayer from '../components/EpisodePlayer.jsx';

const episode = {
  id: 'ep-test',
  title: 'Test Episode',
  audioUrl: 'https://example.com/audio.mp3',
  checkpoints: [
    {
      id: 'cp-text',
      timeMs: 0,
      type: 'text',
      prompt: 'Share a word that grounds you.',
    },
  ],
};

let originalRequestAnimationFrame;
let playSpy;
let pauseSpy;

describe('EpisodePlayer', () => {
  beforeAll(() => {
    originalRequestAnimationFrame = globalThis.requestAnimationFrame;
    globalThis.requestAnimationFrame = (callback) => {
      callback(0);
      return 0;
    };
  });

  beforeEach(() => {
    playSpy = vi
      .spyOn(window.HTMLMediaElement.prototype, 'play')
      .mockImplementation(() => Promise.resolve());
    pauseSpy = vi
      .spyOn(window.HTMLMediaElement.prototype, 'pause')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    playSpy.mockRestore();
    pauseSpy.mockRestore();
  });

  afterAll(() => {
    globalThis.requestAnimationFrame = originalRequestAnimationFrame;
  });

  test('pauses playback at a checkpoint and displays the modal', async () => {
    const { container } = render(
      <EpisodePlayer episode={episode} responses={[]} onCheckpointAnswered={vi.fn()} />
    );

    const audio = container.querySelector('audio');
    expect(audio).not.toBeNull();

    audio.currentTime = 0;
    fireEvent.timeUpdate(audio);

    await waitFor(() => {
      expect(screen.getByText('Pause & Reflect')).toBeInTheDocument();
    });

    fireEvent.play(audio);

    expect(pauseSpy).toHaveBeenCalled();
  });

  test('submits a response and resumes playback', async () => {
    const onCheckpointAnswered = vi.fn();
    const user = userEvent.setup();

    const { container } = render(
      <EpisodePlayer episode={episode} responses={[]} onCheckpointAnswered={onCheckpointAnswered} />
    );

    const audio = container.querySelector('audio');
    expect(audio).not.toBeNull();

    audio.currentTime = 0.9;
    fireEvent.timeUpdate(audio);

    const textarea = await screen.findByPlaceholderText('Share your word or sentence');
    await user.type(textarea, 'Peace');

    await user.click(screen.getByRole('button', { name: /submit & continue/i }));

    await waitFor(() => {
      expect(onCheckpointAnswered).toHaveBeenCalledWith(
        expect.objectContaining({
          episodeId: 'ep-test',
          checkpointId: 'cp-text',
          answer: 'Peace',
        })
      );
    });

    expect(playSpy).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByText('Pause & Reflect')).not.toBeInTheDocument();
    });
  });
});
