const STORAGE_KEY = 'lamontanitaResponses';

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('Unable to parse stored responses', error);
    return [];
  }
};

export const loadResponses = () => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return safeParse(raw);
};

export const saveResponses = (responses) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
};

export const addResponse = (response) => {
  const responses = loadResponses();
  responses.push(response);
  saveResponses(responses);
  return responses;
};
