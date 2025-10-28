import { useEffect, useState } from 'react';

const CheckpointModal = ({ checkpoint, onSubmit }) => {
  const [textValue, setTextValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const isText = checkpoint.type === 'text';

  useEffect(() => {
    setTextValue('');
    setSelectedOption('');
  }, [checkpoint.id]);

  const trimmedText = textValue.trim();
  const isSubmitDisabled = isText ? trimmedText.length === 0 : !selectedOption;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitDisabled) return;

    if (isText) {
      onSubmit(trimmedText);
    } else {
      onSubmit(selectedOption);
    }
  };

  return (
    <div className="modal-backdrop fixed inset-0 z-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-accent">Pause &amp; Reflect</h2>
        <p className="mb-6 text-base text-gray-700">{checkpoint.prompt}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isText ? (
            <textarea
              className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-base text-gray-800 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
              rows={3}
              value={textValue}
              onChange={(event) => setTextValue(event.target.value)}
              placeholder="Share your word or sentence"
              autoFocus
            />
          ) : (
            <div className="space-y-3">
              {checkpoint.options?.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition hover:border-accent"
                >
                  <input
                    type="radio"
                    name={`checkpoint-${checkpoint.id}`}
                    value={option}
                    checked={selectedOption === option}
                    onChange={(event) => setSelectedOption(event.target.value)}
                    className="h-4 w-4 text-accent focus:ring-accent"
                  />
                  <span className="text-base text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-full rounded-full px-6 py-3 text-base font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-accent/60 ${
              isSubmitDisabled
                ? 'cursor-not-allowed bg-accent/60'
                : 'bg-accent hover:bg-accent/90'
            }`}
          >
            Submit &amp; Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckpointModal;
