import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { QueryProductsDto } from './dto/query-products.dto';
import { ProductDto, PaginatedProductsDto } from './dto/product.dto';
import { CreateProductDto, UpdateProductDto } from './dto/admin-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query() query: QueryProductsDto): Promise<PaginatedProductsDto> {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductDto> {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() dto: CreateProductDto): Promise<ProductDto> {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductDto> {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, AdminGuard)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}
