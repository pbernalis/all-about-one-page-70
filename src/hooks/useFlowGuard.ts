import { useCallback, useReducer } from 'react';

type Phase = 'idle' | 'picking-layout' | 'generating-content' | 'rendering' | 'error';

type State = { phase: Phase; error?: string };

type Action =
  | { type: 'START' }
  | { type: 'PICKED' }
  | { type: 'GENERATED' }
  | { type: 'RENDERED' }
  | { type: 'ERROR'; error: string }
  | { type: 'RESET' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START':
      if (state.phase !== 'idle' && state.phase !== 'error') return state; // idempotent
      return { phase: 'picking-layout' };
    case 'PICKED':
      if (state.phase !== 'picking-layout') return state;
      return { phase: 'generating-content' };
    case 'GENERATED':
      if (state.phase !== 'generating-content') return state;
      return { phase: 'rendering' };
    case 'RENDERED':
      return { phase: 'idle' };
    case 'ERROR':
      return { phase: 'error', error: action.error };
    case 'RESET':
      return { phase: 'idle' };
    default:
      return state;
  }
}

export function useFlowGuard() {
  const [state, dispatch] = useReducer(reducer, { phase: 'idle' } as State);

  const start = useCallback(() => dispatch({ type: 'START' }), []);
  const picked = useCallback(() => dispatch({ type: 'PICKED' }), []);
  const generated = useCallback(() => dispatch({ type: 'GENERATED' }), []);
  const rendered = useCallback(() => dispatch({ type: 'RENDERED' }), []);
  const setError = useCallback((e: unknown) => dispatch({ type: 'ERROR', error: String(e) }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const inFlight = state.phase !== 'idle' && state.phase !== 'error';

  return { state, inFlight, start, picked, generated, rendered, setError, reset };
}