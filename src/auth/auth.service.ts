import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        // console.log('--- BƯỚC 2: Tìm user với username =', username);
        const user = await this.usersService.findOneByUsername(username);
        // console.log('--- BƯỚC 3: User trong database =', user);
        if (user) {
            // Bắt buộc phải có await ở đây
            const isValid = await this.usersService.isValidPassword(pass, user.password);
            // console.log('--- BƯỚC 3.1: Mật khẩu khớp không? =', isValid);
            if (isValid) {
                return user;
            }
        }

        return null;
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
