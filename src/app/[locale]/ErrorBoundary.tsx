'use client';

import { Button } from '@/shared/components/ui/button';
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
  constructor(props: Props) {
    super(props);

    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(_error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
  }
  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div>
        <h2>{this.state.error?.toString()}</h2>
        {this.state.errorInfo && (
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>에러상세</summary>
            {this.state.errorInfo.componentStack}
          </details>
        )}
        <Button type="button" onClick={() => this.setState({ hasError: false })}>
          Try again?
        </Button>
      </div>
    );
  }
}

export default ErrorBoundary;
