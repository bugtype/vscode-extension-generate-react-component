/* eslint-disable max-classes-per-file */

export class InputValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InputValidationError';
  }
}

export class FileAlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FileAlreadyExistsError';
  }
}
