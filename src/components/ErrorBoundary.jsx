import { Component } from 'react';

import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
  if (import.meta.env.DEV) console.error('ErrorBoundary capturou um erro:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
          <div className="max-w-md rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">Ops! Algo deu errado</h2>
            <p className="mb-6 text-gray-600">
              Ocorreu um erro inesperado. Por favor, tente recarregar a página ou entre em contato
              com o suporte se o problema persistir.
            </p>
            <div className="flex gap-4">
              <Button onClick={this.handleReset} className="flex-1">
                Tentar Novamente
              </Button>
              <Button
                onClick={() => (window.location.href = '/')}
                className="flex-1 bg-gray-500 hover:bg-gray-600"
              >
                Ir para Início
              </Button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6">
                <summary className="cursor-pointer text-sm text-gray-500">Detalhes do erro</summary>
                <pre className="mt-2 overflow-auto rounded bg-gray-100 p-4 text-xs">
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
