
const errorMapByCode: Map <number, () => ErrorWithCode> = new Map();
const errorMapByName: Map <string, () => ErrorWithCode> = new Map();

export abstract class ErrorWithCode extends Error {
    /**Error code, this must be identical*/
    abstract code: number;
}

type MaybeErrorWithCode = ErrorWithCode | null | undefined;


/**
 * ConversationNotStartedError: Conversation not started
 * 
 * @category Errors
 * @category generated
 */
export class ConversationNotStartedError extends ErrorWithCode {
    readonly code: number = 1000;
    readonly name: string = ConversationNotStartedError.name;
    stack?: string | undefined;
    cause?: unknown;

    constructor() {
        super('Conversation not started');
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, ConversationNotStartedError)
        }
    }
}
errorMapByCode.set(1000, () => new ConversationNotStartedError());
errorMapByName.set(ConversationNotStartedError.name, () => new ConversationNotStartedError());

/**
 * LoggerNotExistError: Logger not existed, please try enable it
 * 
 * @category Errors
 * @category generated
 */
export class LoggerNotExistError extends ErrorWithCode {
    readonly code: number = 2000;
    readonly name: string = LoggerNotExistError.name;
    stack?: string | undefined;
    cause?: unknown;

    constructor() {
        super('Logger not existed, please try enable it');
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, LoggerNotExistError)
        }
    }
}
errorMapByCode.set(2000, () => new LoggerNotExistError());
errorMapByName.set(LoggerNotExistError.name, () => new LoggerNotExistError());


/**
 * NotClassifiedError: The Mind Expression engine does not understand the message
 * within the conversation configurations.
 * 
 * @category Errors
 * @category generated
 */
export class NotClassifiedError extends ErrorWithCode {
    readonly code: number = 204;
    readonly name: string = NotClassifiedError.name;
    stack?: string | undefined;
    cause?: unknown;

    constructor() {
        super('The Mind Expression engine does not understand the message within the conversation configurations.');
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, NotClassifiedError)
        }
    }
}
errorMapByCode.set(204, () => new NotClassifiedError());
errorMapByName.set(NotClassifiedError.name, () => new NotClassifiedError());

/**
 * EmptyInputMessageError: Conversation not started
 * 
 * @category Errors
 * @category generated
 */
export class EmptyInputMessageError extends ErrorWithCode {
    readonly code: number = 210;
    readonly name: string = EmptyInputMessageError.name;
    stack?: string | undefined;
    cause?: unknown;

    constructor() {
        super('Empty input message');
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, EmptyInputMessageError)
        }
    }
}
errorMapByCode.set(210, () => new EmptyInputMessageError());
errorMapByName.set(EmptyInputMessageError.name, () => new EmptyInputMessageError());

/**
 * ConversationTerminatedError: The message and response ends the current conversation.
 * 
 * @category Errors
 * @category generated
 */
export class ConversationTerminatedError extends ErrorWithCode {
    readonly code: number = 220;
    readonly name: string = ConversationTerminatedError.name;
    stack?: string | undefined;
    cause?: unknown;

    constructor() {
        super('The message and response ends the current conversation.');
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, ConversationTerminatedError)
        }
    }
}
errorMapByCode.set(220, () => new ConversationTerminatedError());
errorMapByName.set(ConversationTerminatedError.name, () => new ConversationTerminatedError());

/**
 * BadRequestError: Authorization or request data wrong, please check again.
 * 
 * @category Errors
 * @category generated
 */
export class BadRequestError extends ErrorWithCode {
    readonly code: number = 400;
    readonly name: string = BadRequestError.name;
    stack?: string | undefined;
    cause?: unknown;

    constructor() {
        super('Request data wrong, please check again.');
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, BadRequestError)
        }
    }
}
errorMapByCode.set(400, () => new BadRequestError());
errorMapByName.set(BadRequestError.name, () => new BadRequestError());

/**
 * UnauthorizedError: Unauthorized.
 * 
 * @category Errors
 * @category generated
 */
export class UnauthorizedError extends ErrorWithCode {
    readonly code: number = 401;
    readonly name: string = UnauthorizedError.name;
    stack?: string | undefined;
    cause?: unknown;

    constructor() {
        super('Unauthorized');
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, UnauthorizedError)
        }
    }
}
errorMapByCode.set(401, () => new UnauthorizedError());
errorMapByName.set(UnauthorizedError.name, () => new UnauthorizedError());

/**
 * QueryIdDuplicatedError: query-id is duplicated.
 * 
 * @category Errors
 * @category generated
 */
export class QueryIdDuplicatedError extends ErrorWithCode {
    readonly code: number = 409;
    readonly name: string = UnauthorizedError.name;
    stack?: string | undefined;
    cause?: unknown;

    constructor() {
        super('query-id is duplicated');
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, QueryIdDuplicatedError)
        }
    }
}
errorMapByCode.set(409, () => new QueryIdDuplicatedError());
errorMapByName.set(QueryIdDuplicatedError.name, () => new QueryIdDuplicatedError());

/**
 * InternalServerError: Internal server error.
 * 
 * @category Errors
 * @category generated
 */
export class InternalServerError extends ErrorWithCode {
    readonly code: number = 500;
    readonly name: string = InternalServerError.name;
    stack?: string | undefined;
    cause?: unknown;

    constructor() {
        super('Internal server error.');
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, InternalServerError)
        }
    }
}
errorMapByCode.set(500, () => new InternalServerError());
errorMapByName.set(InternalServerError.name, () => new InternalServerError());


/**
 * Attempts to resolve a custom error from the provided error code.
 * @category Errors
 * @category generated
 */
export function errorFromCode(code: number): MaybeErrorWithCode {
    const createError = errorMapByCode.get(code);
    return createError != null ? createError() : null;
}
  
/**
 * Attempts to resolve a custom error from the provided error name
 * @category Errors
 * @category generated
 */
export function errorFromName(name: string): MaybeErrorWithCode {
    const createError = errorMapByName.get(name);
    return createError != null ? createError() : null;
}


export const MIGHT_NOT_ERROR_CODES = [200, 201, 202, 204, 220];