
import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_SKIP_PERMISSION = 'isSkipPermission';
export const SkipCheckPermission = () => SetMetadata(IS_SKIP_PERMISSION, true);

export const RESPONSE_MESSAGE = "response_message";
export const ResponseMessage = (message: string) =>
    SetMetadata(RESPONSE_MESSAGE, message);

//Custom Parameter Decorator lấy thông tin người dùng
export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
