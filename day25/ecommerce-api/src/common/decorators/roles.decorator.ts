import { SetMetadata } from '@nestjs/common';

// Key dùng để lưu và đọc metadata
export const ROLES_KEY = 'roles';

// Decorator @Roles('admin') hoặc @Roles('admin', 'user')
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
