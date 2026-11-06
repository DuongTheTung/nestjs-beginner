import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { displayName, emails, photos } = profile;
        const email = emails?.[0]?.value;

        if (!email) {
            return done(new UnauthorizedException('Không thể lấy email từ tài khoản Google'), false);
        }

        const googleUser = {
            email,
            name: displayName,
            avatar: photos?.[0]?.value,
        };

        const user = await this.authService.validateGoogleUser(googleUser);
        done(null, user);
    }
}
