import React, { useEffect } from 'react';

interface ApiKeyPromptProps {
  onKeySet: () => void;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onKeySet }) => {
  useEffect(() => {
    // Per coding guidelines, the API key must be handled via environment variables.
    // This component should not prompt the user for a key.
    // We call onKeySet immediately to continue the application flow.
    onKeySet();
  }, [onKeySet]);

  return null; // Do not render any UI for API key input.
};

export default ApiKeyPrompt;
