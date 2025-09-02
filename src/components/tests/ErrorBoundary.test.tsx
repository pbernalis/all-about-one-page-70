import { render } from '@testing-library/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ReactNode } from 'react';
import { describe, it, expect } from 'vitest';

function Boom(): never { 
  throw new Error('boom'); 
}

function Slot({ children }: { children: ReactNode }) { 
  return <>{children}</>; 
}

describe('ErrorBoundary', () => {
  it('renders fallback on error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Slot>
          <Boom />
        </Slot>
      </ErrorBoundary>
    );
    expect(getByText(/Something went wrong/i)).toBeDefined();
  });
});