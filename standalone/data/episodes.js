const episodesData = {
  episodes: [
    {
      id: 'ep1',
      title: 'The Moment It Changed',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      description: 'An audio walk through the valley just before dawn.',
      checkpoints: [
        {
          id: 'cp1',
          timeMs: 90_000,
          type: 'text',
          prompt: 'One word: what do you protect most when life turns uncertain?',
        },
        {
          id: 'cp2',
          timeMs: 300_000,
          type: 'choice',
          prompt: 'Choose your anchor',
          options: ['Peace', 'Time', 'Freedom', 'Love'],
        },
      ],
    },
  ],
};

export default episodesData;
