import { GatewayResponse } from '../../services/ExpressionApi/ExpressionApi.types';
import { ErrorWithCode, errorFromCode } from '.';

export default class ErrorHandler {
  constructor() {}

  static handleGatewayError = (error: any): GatewayResponse => {
    // Is match format of GatewayResponse
    if (error?.code && error?.description) {
      return error;
    }
    // get error code
    const errorCode: number =
      typeof error === 'number'
        ? error
        : typeof error?.code === 'number'
        ? error?.code
        : this.getErrorCode(error?.message ?? error);
    const eFromCode =
      error instanceof ErrorWithCode
        ? error
        : errorFromCode(errorCode ?? error);
    return {
      code: eFromCode?.code ?? errorCode ?? -1,
      description:
        eFromCode?.message ??
        eFromCode?.name ??
        error?.message ??
        'UNKNOWN_ERROR',
      language: 'EN',
    };
  };

  static getErrorCode = (errorString: string) => {
    const codes = errorString.match(/[\d]+/g);

    return Number(codes?.[0]);
  };
}
