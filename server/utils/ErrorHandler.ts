class ErrorHandler extends Error {
  statusCode: Number;

  constructor(message: any, statusCode: Number) {
    super(message);
    this.statusCode = statusCode;

    // Captures stack trace and assigns it to this error instance
    Error.captureStackTrace(this, this.constructor);
    
  }
}

export default ErrorHandler;