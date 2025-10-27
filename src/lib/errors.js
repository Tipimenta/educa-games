export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status ?? 0;
    this.data = data ?? {};
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Não autorizado.', data) {
    super(message);
    this.name = 'UnauthorizedError';
    this.status = 401;
    this.data = data ?? {};
  }
}

export class NetworkError extends Error {
  constructor(message = 'Erro de rede.', data) {
    super(message);
    this.name = 'NetworkError';
    this.status = 0;
    this.data = data ?? {};
  }
}

export class ValidationError extends Error {
  constructor(message = 'Erro de validação.', data) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
    this.data = data ?? {};
  }
}
