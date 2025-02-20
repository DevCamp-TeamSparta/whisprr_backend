import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const AdminInfo = createParamDecorator(
  (data: keyof JwtAdminPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const jwtService = new JwtService();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];

    const payload = jwtService.decode(token) as JwtAdminPayload;

    return data ? payload[data] : payload;
  },
);

export interface JwtAdminPayload {
  email: string;
  IsAdmin: true;
}
