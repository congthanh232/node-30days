import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Interface của user sau khi JWT verify
export interface CurrentUserType {
  userId: string;
  email: string;
  role: string;
}

// Decorator lấy user hiện tại từ request
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserType => {
    const request = ctx.switchToHttp().getRequest<{
      user: CurrentUserType;
    }>();
    return request.user;
  },
);
