
import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorator/customize';

@Injectable()

export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }


    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException("Token không hợp lệ/ Không có token owe Bear");
        }

        // check permissions
        const targetMethod = request.method;
        const targetEndpoint = request.route?.path as string;

        const permissions = user?.permissions ?? [];
        let isExist = permissions.find((permission: any) => 
            targetMethod === permission.method &&
            targetEndpoint === permission.apiPath
        );

        if (targetEndpoint.startsWith('/api/v1/auth')) {
            isExist = true;
        }

        if (!isExist && user.role?.name !== "ADMIN" && user.role?.name !== "Admin") {
            throw new UnauthorizedException("Bạn không có quyền truy cập endpoint này");
        }

        return user;
    }
}
