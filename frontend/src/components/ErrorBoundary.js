import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center bg-[#111111] border border-[#E60000]/30 p-8">
          <div className="text-center">
            <h2 className="text-xl uppercase font-bold text-white mb-4">SOMETHING WENT WRONG</h2>
            <p className="text-[#A1A1AA] text-sm mb-6 max-w-md">
              {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
            </p>
            <button
              onClick={() => {
                this.resetError();
                if (this.props.onReset) this.props.onReset();
              }}
              className="bg-white text-black hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-6 py-3"
            >
              TRY AGAIN
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
