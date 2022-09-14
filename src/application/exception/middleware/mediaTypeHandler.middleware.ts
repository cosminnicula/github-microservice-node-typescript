import { IncomingHttpHeaders } from 'http';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function handleMediaType(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const acceptHeader = getHeader('accept', request.headers);

  if (!acceptHeader || (acceptHeader !== 'application/json' && acceptHeader !== '*/*')) {
    response.status(StatusCodes.NOT_ACCEPTABLE).send({
      message: `Media type ${acceptHeader} not supported.`,
      status: StatusCodes.NOT_ACCEPTABLE
    });
  }

  next();
}

function getHeader(headerKey: string, headers: IncomingHttpHeaders) {
  const foundHeader = Object.keys(headers).find(header => header.toLowerCase() === headerKey);
  return foundHeader && headers[foundHeader] && (headers[foundHeader] as string).toLowerCase() || '';
}