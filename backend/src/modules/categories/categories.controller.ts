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
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/category.dto';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/admin-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(): Promise<CategoryDto[]> {
    return this.categoriesService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() dto: CreateCategoryDto): Promise<CategoryDto> {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, AdminGuard)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoriesService.remove(id);
  }
}
