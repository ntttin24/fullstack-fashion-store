import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(private uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(@UploadedFile() file: any) {
    try {
      this.logger.log('Single image upload request received');
      const url = await this.uploadService.uploadImage(file);
      return { url };
    } catch (error) {
      this.logger.error(`Single upload error: ${error.message}`, error.stack);
      throw new HttpException(
        {
          message: error.message || 'Upload failed',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultiple(@UploadedFiles() files: any[]) {
    try {
      this.logger.log(`Multiple images upload request received: ${files?.length || 0} files`);
      
      if (!files || files.length === 0) {
        throw new HttpException('No files provided', HttpStatus.BAD_REQUEST);
      }

      const urls = await this.uploadService.uploadMultiple(files);
      return { urls };
    } catch (error) {
      this.logger.error(`Multiple upload error: ${error.message}`, error.stack);
      throw new HttpException(
        {
          message: error.message || 'Upload failed',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}














