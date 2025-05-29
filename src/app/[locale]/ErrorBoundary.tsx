'use client';

import { Button } from '@/shared';
import { RefreshCw, Undo2 } from 'lucide-react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);

    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(_error: Error, errorInfo: React.ErrorInfo) {
    console.error(errorInfo);
  }
  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
  handleGoBack() {
    history.back();
    this.timeoutId = setTimeout(() => window.location.reload(), 100);
  }
  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
        <p className="text-xl font-semibold p-[20px]">{this.state.error?.toString()}</p>
        <div className="flex justify-center gap-[4px]">
          <Button variant="secondary" onClick={this.handleGoBack}>
            <Undo2 />
            Back
          </Button>
          <Button type="button" onClick={() => window.location.reload()}>
            <RefreshCw />
            Try again
          </Button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
