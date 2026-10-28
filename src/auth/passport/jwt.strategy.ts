
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IUser } from '../../users/users.interface';
import { RolesService } from '../../roles/roles.service';

// giải mã và xác minh jwt
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private rolesService: RolesService,
    ) {
        super({
            //trích xuất JWT từ Header 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // xác thực chữ ký
            secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN')!,
        });
    }

    // khi token hợp lệ
    async validate(payload: IUser) {
        const { _id, name, email, role } = payload;
        // tìm role của user
        const userRole = role as unknown as { _id: string; name: string };
        // tìm quyền của role
        const tempRole = await this.rolesService.findOne(userRole._id);

        return {
            _id,
            name,
            email,
            role,
            permissions: tempRole?.permissions ?? []
        };
    }
}
