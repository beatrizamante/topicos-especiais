export const ERROR_CODES = {
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
  INTERNAL_SERVICE_ERROR: "INTERNAL_SERVICE_ERROR",
  UNAUTHORIZED_ERROR: "UNAUTHORIZED_ERROR",
  UNAUTHENTICATED_ERROR: "UNAUTHENTICATED_ERROR",
  INVALID_FICTION_ERROR: "INVALID_FICTION_ERROR",
  INVALID_USER_ERROR: "INVALID_USER_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
};

export class BaseError extends Error {
  public readonly code: string;

  constructor(message: string) {
    super(message);
    this.code = "BASE_ERROR";
  }
}

export class UnauthorizedError extends BaseError {
  public readonly code = "UNAUTHORIZED_ERROR";

  constructor({ message }: { message: string }) {
    super(message);
  }
}

export class UnathenticatedError extends BaseError {
  public readonly code = "UNAUTHENTICATED_ERROR";

  constructor({ message }: { message: string }) {
    super(message);
  }
}

export class ExternalServiceError extends BaseError {
  public readonly code = "EXTERNAL_SERVICE_ERROR";

  constructor({ message }: { message: string }) {
    super(message);
  }
}

export class DatabaseError extends BaseError {
  public readonly code = "DATABASE_ERROR";

  constructor({ message }: { message: string }) {
    super(message);
  }
}

export class InvalidFictionError extends BaseError {
  public readonly code = "INVALID_FICTION_ERROR";

  constructor({ message }: { message: string }) {
    super(message);
  }
}

export class InvalidUserError extends BaseError {
  public readonly code = "INVALID_USER_ERROR";

  constructor({ message }: { message: string }) {
    super(message);
  }
}
