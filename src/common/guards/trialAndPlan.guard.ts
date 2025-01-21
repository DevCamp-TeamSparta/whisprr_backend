import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TrialAndPlanGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ForbiddenException('Missing or invalid Authorization header');
    }
    const token = authHeader.split(' ')[1];

    const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET_KEY });

    const { freeTrialStatus, planStatus } = payload.sub;
    console.log(1, payload);
    if (freeTrialStatus === 'non-available' && planStatus === 'non-available') {
      throw new ForbiddenException('Access denied: trial and plan are non-available');
    }

    request.user = payload;

    return true;
  }
}
