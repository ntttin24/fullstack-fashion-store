import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, CreateVariantDto, UpdateVariantDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('featured') featured?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sortBy') sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'name',
    @Query('limit') limit?: string,
  ) {
    // Build filters object only with defined values
    const filters: any = {};
    
    if (category) filters.category = category;
    if (search) filters.search = search;
    if (featured !== undefined) filters.featured = featured === 'true';
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (sortBy) filters.sortBy = sortBy;
    if (limit) filters.limit = parseInt(limit, 10);
    
    return this.productsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  // Variant management endpoints
  @Get(':id/variants')
  getVariants(@Param('id') id: string) {
    return this.productsService.getVariants(id);
  }

  @Get(':id/variants/:color/:size')
  getVariant(
    @Param('id') id: string,
    @Param('color') color: string,
    @Param('size') size: string,
  ) {
    return this.productsService.getVariant(id, decodeURIComponent(color), decodeURIComponent(size));
  }

  @Post(':id/variants')
  addVariant(@Param('id') id: string, @Body() dto: CreateVariantDto) {
    return this.productsService.addVariant(id, dto);
  }

  @Put(':id/variants/:color/:size')
  updateVariantStock(
    @Param('id') id: string,
    @Param('color') color: string,
    @Param('size') size: string,
    @Body() dto: UpdateVariantDto,
  ) {
    return this.productsService.updateVariantStock(
      id,
      decodeURIComponent(color),
      decodeURIComponent(size),
      dto.stock,
    );
  }

  @Delete(':id/variants/:color/:size')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteVariant(
    @Param('id') id: string,
    @Param('color') color: string,
    @Param('size') size: string,
  ) {
    return this.productsService.deleteVariant(id, decodeURIComponent(color), decodeURIComponent(size));
  }
}





















