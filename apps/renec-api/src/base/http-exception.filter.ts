import {
  BadRequestException,
  Exception,
  ExceptionMessage,
  ForbiddenException,
  InternalServerException,
  IResponseDto,
  IValidateError,
  NotFoundException,
  NotImplementedException,
  UnauthorizedException,
  ValidateException,
} from '@joktec/core';
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { isEmpty } from 'lodash';
import { ExceptionCode } from './exception.code';
import { extractLocale } from '../modules/localize/localize.utils';
import { Localize, LocalizeConfig } from '../modules/localize';

export interface ResponseDto extends IResponseDto {
  validate?: Array<{ path: string; messages: string[] }>;
}

@Catch(Exception)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly i18nConfig: LocalizeConfig;
  private readonly i18n: Localize;

  constructor() {
    this.i18nConfig = new LocalizeConfig({ locales: ['vi', 'en'] });
    this.i18n = new Localize({ ...this.i18nConfig });
  }

  catch(exception: Exception, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const locale = extractLocale(request, this.i18nConfig);
    const status: number = exception?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const messageKey: string = exception?.message || ExceptionMessage.INTERNAL_SERVER_ERROR;

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error('Something when wrong', exception, HttpExceptionFilter.name);
    }

    const errorBody: ResponseDto = {
      timestamp: new Date(),
      success: false,
      errorCode: this.getErrorCode(exception),
      message: this.transform(messageKey, locale),
    };

    if (exception instanceof ValidateException) {
      const validateError: IValidateError = exception.data;
      errorBody.validate = Object.entries(validateError).map(([path, messages]) => {
        return { path, messages: messages.map(m => this.transform(m, locale)) };
      });
    }

    const isProd: boolean = process.env.NODE_ENV === 'production';
    if (!isProd) {
      const errorData: any = exception?.data || exception.stack;
      Object.assign(errorBody, {
        error: errorBody.validate ? exception.stack : errorData,
        path: request.url,
        method: request.method,
      });
      if (!isEmpty(request.body)) errorBody.body = request.body;
      if (!isEmpty(request.query)) errorBody.query = request.query;
      if (!isEmpty(request['originQuery'])) errorBody.query = request['originQuery'];
      if (!isEmpty(request.params)) errorBody.params = request.params;
    }

    response.status(status).json(errorBody);
  }

  private transform(messageKey: string, locale: string): string {
    return this.i18n.__({ phrase: messageKey, locale });
  }

  private getErrorCode(exception: Exception): ExceptionCode {
    if (exception instanceof ValidateException) return ExceptionCode.INVALID_INPUT;
    if (exception instanceof BadRequestException) {
      if (!exception?.message) return ExceptionCode.UNDEFINED;
      return ExceptionCode[exception.message] || ExceptionCode.UNDEFINED;
    }
    if (exception instanceof UnauthorizedException) return ExceptionCode.JWT_EXCEPTION;
    if (exception instanceof ForbiddenException) return ExceptionCode.FORBIDDEN;
    if (exception instanceof NotFoundException) return ExceptionCode.NOT_FOUND;
    if (exception instanceof InternalServerException) return ExceptionCode.SYSTEM_ERROR;
    if (exception instanceof NotImplementedException) return ExceptionCode.NOT_IMPLEMENTED;
    return ExceptionCode.UNDEFINED;
  }
}
