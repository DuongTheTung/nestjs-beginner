import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../users/users.interface';
import { RegisterUserDto } from '../users/dto/create-user.dto';
import { create } from 'domain';

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

    //encode
    async login(user: IUser) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };
        return {
            access_token: this.jwtService.sign(payload),
            _id,
            name,
            email,
            role
        };
    }

    async register(user: RegisterUserDto) {
        let newUser = await this.usersService.register(user);

        return {
            _id: newUser?._id,
            createdAt: newUser?.createdAt,
        }
    }
}
