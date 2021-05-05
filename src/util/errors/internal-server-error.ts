import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import type { APIErrorInterface } from './api-error';

const isSerializable = (value: any) => {
  try {
    JSON.parse(JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
};

export default class InternalServerError extends Error implements APIErrorInterface {
  public readonly statusCode;

  public readonly error;

  public detail;

  constructor(error: any) {
    super();

    this.name = 'InternalServerError';
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

    this.error = error;
    this.detail = `The server encountered an internal error or misconfiguration and was unable to complete your request.
    Please contact the server administrator and inform them of the time the error occurred and anything you might have done that may have caused the error.
    More information about this error may be available in the server error log.`;
  }

  toJSON() {
    if (this.error instanceof Error) {
      this.detail = this.error.toString();
    } else if (isSerializable(this.error)) {
      this.detail = JSON.stringify(this.error);
    }

    return {
      status: getReasonPhrase(this.statusCode),
      title: this.name,
      detail: this.message,
    };
  }
}
