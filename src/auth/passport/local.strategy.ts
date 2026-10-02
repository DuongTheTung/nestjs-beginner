
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        // console.log('--- BƯỚC 1: LocalStrategy nhận ---', { username, password });
        const user = await this.authService.validateUser(username, password);
        // console.log('--- BƯỚC 4: Kết quả sau validateUser ---', user);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
