import { IsEnum, IsOptional } from 'class-validator';

export class UpdateUserRoleDto {
  @IsEnum(['USER', 'ADMIN', 'SUPPORT'])
  role: 'USER' | 'ADMIN' | 'SUPPORT';
}

