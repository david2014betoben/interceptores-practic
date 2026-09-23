import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

// =============================================================================
// SanitizeInterceptor  —  👤 Estudiante 4
// -----------------------------------------------------------------------------
// Objetivo: que ningún dato sensible salga de la API, sin importar qué
// endpoint lo devuelva.
//
//   Lo que devuelve el servicio:            Lo que recibe el cliente:
//   "customer": {                           "customer": {
//     "name": "Ana Pérez",                    "name": "Ana Pérez",
//     "passwordHash": "$2b$10$..."            (sin passwordHash)
//   },                                      },
//   "payment": {                            "payment": {
//     "creditCard": "4111111111114242",       "creditCard": "**** **** **** 4242"
//     "clientSecret": "pi_..._secret_..."     (sin clientSecret)
//   }                                       }
//
// Operador RxJS: map()  → transforma el valor antes de enviarlo.
// =============================================================================

/** Campos que se ELIMINAN por completo de la respuesta. */
export const REMOVED_FIELDS = ['passwordHash', 'clientSecret'];

/** Campos que se ENMASCARAN (solo quedan visibles los últimos 4 dígitos). */
export const MASKED_FIELDS = ['creditCard'];

/**
 * '4111111111114242' → '**** **** **** 4242'
 */
export function maskCreditCard(value: string): string {
  return '**** **** **** ' + value.slice(-4);
}

/**
 * Recorre CUALQUIER valor (objeto, array, primitivo) y devuelve una COPIA
 * limpia. Debe funcionar igual para un pedido suelto que para un array de
 * pedidos, y para objetos anidados a cualquier profundidad.
 */
export function sanitize(value: unknown): unknown {
  // Un array se limpia elemento por elemento
  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  // Un Date también es 'object': se devuelve tal cual para conservar createdAt
  if (value instanceof Date) {
    return value;
  }

  // Un objeto se copia en uno NUEVO (nunca se muta el original del servicio)
  if (value !== null && typeof value === 'object') {
    const clean: Record<string, unknown> = {};

    for (const [key, val] of Object.entries(value)) {
      if (REMOVED_FIELDS.includes(key)) {
        continue;
      }

      if (MASKED_FIELDS.includes(key) && typeof val === 'string') {
        clean[key] = maskCreditCard(val);
      } else {
        clean[key] = sanitize(val);
      }
    }

    return clean;
  }

  // string, number, boolean, null, undefined: se devuelven sin cambios
  return value;
}

@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data) => sanitize(data)));
  }
}
