import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-container">
          <div className="romantic-card">
            <span style={{ fontSize: '4rem' }}>💔</span>
            <h1 className="card-title" style={{ marginTop: '1rem' }}>
              Oops, something went wrong!
            </h1>
            <p className="card-subtitle" style={{ marginBottom: '1.5rem' }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              type="button"
              className="btn-primary-yes"
              onClick={() => window.location.reload()}
            >
              Reload Page ✨
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
