export declare const UserInfo: (...dataOrPipes: (keyof JwtPayload | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
export interface JwtPayload {
    uuid: string;
    freeTrialStatus: 'available' | 'non-available';
    planStatus: 'active' | 'inactive';
    iat?: number;
    exp?: number;
}
