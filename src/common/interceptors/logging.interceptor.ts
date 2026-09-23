import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';

import type { Request } from 'express';

import { Observable, tap } from 'rxjs';

// =============================================================================
// LoggingInterceptor  —  👤 Estudiante 2
// -----------------------------------------------------------------------------
// Objetivo: registrar en consola cada petición y cuánto tardó.
//
// Operador RxJS: tap() → ejecuta un efecto secundario (loguear) SIN
//                 modificar la respuesta.
// =============================================================================
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;
    const url = request.url;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - start;
          this.logger.log(`${method} ${url} ${ms}ms`);
        },
        error: (err) => {
          const ms = Date.now() - start;
          this.logger.error(`${method} ${url} ${ms}ms - ${err.message}`);
        },
      }),
    );
  }
}
