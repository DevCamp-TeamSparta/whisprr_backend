import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const UserInfo = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const jwtService = new JwtService(); // JWT Service 인스턴스 생성
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];

    const payload = jwtService.decode(token) as JwtPayload;

    return data ? payload[data] : payload;
  },
);

export interface JwtPayload {
  uuid: string;
  freeTrialStatus: 'available' | 'non-available';
  planStatus: 'available' | 'non-available';
  tokenVersion: number;
  iat?: number;
  exp?: number;
}
