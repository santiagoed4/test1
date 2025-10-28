import React, { useEffect, useState } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const CheckpointModal = ({ checkpoint, onSubmit }) => {
  const [textValue, setTextValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const isText = checkpoint.type === 'text';

  useEffect(() => {
    setTextValue('');
    setSelectedOption('');
  }, [checkpoint.id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isText) {
      const trimmed = textValue.trim();
      if (!trimmed) return;
      onSubmit(trimmed);
    } else if (selectedOption) {
      onSubmit(selectedOption);
    }
  };

  const isDisabled = isText ? textValue.trim().length === 0 : !selectedOption;

  return html`
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h2 className="modal-title">Pause & Reflect</h2>
        <p className="modal-prompt">${checkpoint.prompt}</p>
        <form className="modal-form" onSubmit=${handleSubmit}>
          ${isText
            ? html`<textarea
                className="textarea"
                value=${textValue}
                onChange=${(event) => setTextValue(event.target.value)}
                placeholder="Share your word or sentence"
                autoFocus
              />`
            : html`<div className="choice-options">
                ${(checkpoint.options ?? []).map(
                  (option) => html`<label className="choice-option" key=${option}>
                    <input
                      type="radio"
                      name=${`checkpoint-${checkpoint.id}`}
                      value=${option}
                      checked=${selectedOption === option}
                      onChange=${(event) => setSelectedOption(event.target.value)}
                    />
                    <span>${option}</span>
                  </label>`
                )}
              </div>`}
          <button type="submit" className="button" disabled=${isDisabled}>
            Submit & Continue
          </button>
        </form>
      </div>
    </div>
  `;
};

export default CheckpointModal;
