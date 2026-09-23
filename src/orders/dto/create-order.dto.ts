import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

// =============================================================================
// DTOs de entrada para POST /orders
// -----------------------------------------------------------------------------
// Las validaciones (class-validator) hacen que el ValidationPipe global
// responda 400 si el body no cumple. Los @ApiProperty() documentan esas mismas
// reglas en Swagger y generan un body de ejemplo para "Try it out".
// =============================================================================

export class OrderItemDto {
  @ApiProperty({ description: 'ID del producto', example: 101, minimum: 1 })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Teclado mecánico',
  })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ description: 'Cantidad de unidades', example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Precio por unidad (mayor que 0)',
    example: 50,
  })
  @IsPositive()
  unitPrice: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Nombre del cliente', example: 'Carla Díaz' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({
    description: 'Email del cliente',
    example: 'carla@example.com',
  })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({
    description: 'Productos del pedido (al menos uno)',
    type: [OrderItemDto],
    minItems: 1,
    example: [
      {
        productId: 101,
        productName: 'Teclado mecánico',
        quantity: 2,
        unitPrice: 50,
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Número de tarjeta: exactamente 16 dígitos numéricos',
    example: '4242424242421234',
    pattern: '^\\d{16}$',
  })
  @Matches(/^\d{16}$/, {
    message: 'creditCard debe tener exactamente 16 dígitos numéricos',
  })
  creditCard: string;
}
