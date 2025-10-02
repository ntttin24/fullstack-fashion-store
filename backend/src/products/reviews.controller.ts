import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('products/:productId/reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  findAll(@Param('productId') productId: string) {
    return this.reviewsService.findAll(productId);
  }

  @Get('can-review')
  @UseGuards(JwtAuthGuard)
  canReview(
    @Param('productId') productId: string,
    @CurrentUser() user: any,
  ) {
    return this.reviewsService.canUserReview(productId, user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Param('productId') productId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(productId, user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reviewsService.delete(id, user.id, user.role);
  }
}


