import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

// =============================================================================
// Entidad Order (en memoria)
// -----------------------------------------------------------------------------
// Se usan CLASES (no interfaces) a propósito: Swagger solo puede leer los
// decoradores de una clase; las interfaces desaparecen al compilar.
//
// Esta entidad contiene campos sensibles (passwordHash, creditCard,
// clientSecret). El servicio los devuelve tal cual: el SanitizeInterceptor
// los limpia antes de que lleguen al cliente, y por eso la documentación
// muestra únicamente lo que el cliente realmente recibe.
// =============================================================================

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
}

export class Customer {
  @ApiProperty({ description: 'Nombre del cliente', example: 'Ana Pérez' })
  name: string;

  @ApiProperty({
    description: 'Email del cliente',
    example: 'ana.perez@example.com',
  })
  email: string;

  /** Hash de la contraseña del cliente. NUNCA debe salir de la API. */
  @ApiHideProperty()
  passwordHash: string;
}

export class OrderItem {
  @ApiProperty({ description: 'ID del producto', example: 101 })
  productId: number;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Teclado mecánico',
  })
  productName: string;

  @ApiProperty({ description: 'Cantidad de unidades', example: 1 })
  quantity: number;

  @ApiProperty({ description: 'Precio por unidad', example: 89.9 })
  unitPrice: number;
}

export class PaymentInfo {
  /** Número completo de tarjeta. Se enmascara antes de salir de la API. */
  @ApiProperty({
    description: 'Tarjeta enmascarada: solo se ven los últimos 4 dígitos',
    example: '**** **** **** 4242',
  })
  creditCard: string;

  /** Secreto de la pasarela de pagos. NUNCA debe salir de la API. */
  @ApiHideProperty()
  clientSecret: string;
}

export class Order {
  @ApiProperty({ description: 'ID del pedido', example: 1 })
  id: number;

  @ApiProperty({ description: 'Datos del cliente', type: Customer })
  customer: Customer;

  @ApiProperty({ description: 'Productos del pedido', type: [OrderItem] })
  items: OrderItem[];

  @ApiProperty({ description: 'Total del pedido', example: 139.9 })
  total: number;

  @ApiProperty({
    description: 'Estado del pedido',
    enum: OrderStatus,
    example: OrderStatus.PAID,
  })
  status: OrderStatus;

  @ApiProperty({ description: 'Datos de pago', type: PaymentInfo })
  payment: PaymentInfo;

  @ApiProperty({
    description: 'Fecha de creación del pedido',
    example: '2026-09-01T10:15:00.000Z',
  })
  createdAt: Date;
}
