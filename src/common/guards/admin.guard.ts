import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ForbiddenException('Missing or invalid Authorization header');
    }
    const token = authHeader.split(' ')[1];

    const payload = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
    });

    const { IsAdmin } = payload;

    if (IsAdmin !== true) {
      throw new ForbiddenException('Access denied: not admin account');
    }

    request.admin = payload;

    return true;
  }
}
