import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from '../decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { RegisterUserDto, UserLoginDto } from '../users/dto/create-user.dto';
import type { Response, Request } from 'express';
import type { IUser } from '../users/users.interface';
import { ApiBody } from '@nestjs/swagger';

// nhận request từ client
@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: UserLoginDto })
    @Post('/login')
    @ResponseMessage("Đăng nhập thành công")
    handleLogin(@Req() req: any,
        @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response);
    }

    @Public()
    @ResponseMessage("Register a new user")
    @Post('/register')
    handleRegister(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @ResponseMessage("Get user information")
    @Get('/account')
    handleGetAccount(@User() user: IUser) {
        return { user };
    }

    @Public()
    @ResponseMessage("Get user refresh token")
    @Get('/refresh')
    handleRefreshToken(@Req() request: Request,
        @Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies["refresh_token"];

        return this.authService.processNewToken(refreshToken, response);
    }

    @ResponseMessage("Logout user")
    @Post("/logout")
    handleLogout(
        @Res({ passthrough: true }) response: Response,
        @User() user: IUser
    ) {
        return this.authService.logout(response, user);
    }

    @Public()
    @UseGuards(GoogleAuthGuard)
    @Get('/google')
    @ResponseMessage("Redirect to Google Login")
    handleGoogleLogin() {
        // Guard tự động chuyển hướng sang Google
    }

    @Public()
    @UseGuards(GoogleAuthGuard)
    @Get('/google/callback')
    @ResponseMessage("Đăng nhập bằng Google thành công")
    handleGoogleCallback(
        @Req() req: any,
        @Res({ passthrough: true }) response: Response,
    ) {
        return this.authService.login(req.user, response);
    }
}
