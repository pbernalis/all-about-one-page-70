import { Component, ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: undefined };
  
  static getDerivedStateFromError(error: Error): State { 
    return { error }; 
  }
  
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }
  
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen grid place-items-center p-6 text-center">
          <div className="max-w-lg space-y-3">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="opacity-80">Please refresh the page or return to home.</p>
            <button 
              className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90" 
              onClick={() => this.setState({ error: undefined })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}