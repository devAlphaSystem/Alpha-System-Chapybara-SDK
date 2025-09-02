export class ChapybaraError extends Error {
  constructor(message) {
    super(message);
    this.name = "ChapybaraError";
  }
}

export class APIError extends ChapybaraError {
  constructor(status, error) {
    super(error?.error || `Request failed with status code ${status}`);
    this.name = "APIError";
    this.status = status;
    this.code = error?.code;
    this.requestId = error?.requestId;
  }
}

export class AuthenticationError extends APIError {
  constructor(status, error) {
    super(status, error);
    this.name = "AuthenticationError";
  }
}

export class RateLimitError extends APIError {
  constructor(status, error) {
    super(status, error);
    this.name = "RateLimitError";
  }
}

export class NotFoundError extends APIError {
  constructor(status, error) {
    super(status, error);
    this.name = "NotFoundError";
  }
}

export class ServerError extends APIError {
  constructor(status, error) {
    super(status, error);
    this.name = "ServerError";
  }
}

export class BadRequestError extends APIError {
  constructor(status, error) {
    super(status, error);
    this.name = "BadRequestError";
  }
}
