import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrdersService } from './orders.service.js';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos los pedidos',
    description: 'Obtiene la lista completa de pedidos registrados.',
  })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('reports/heavy-process')
  @ApiOperation({
    summary: 'Generar reporte pesado',
    description: 'Genera un reporte que requiere un procesamiento prolongado.',
  })
  generateHeavyReport() {
    return this.ordersService.generateHeavyReport();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un pedido por ID',
    description: 'Obtiene el detalle de un pedido específico.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del pedido',
    example: 1,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un pedido',
    description: 'Crea un nuevo pedido con los datos proporcionados.',
  })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }
}
