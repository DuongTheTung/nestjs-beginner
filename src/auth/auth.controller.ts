import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from '../decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterUserDto } from '../users/dto/create-user.dto';
import type { Response, Request, response } from 'express';
import type { IUser } from '../users/users.interface';

@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    @ResponseMessage("User login")
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
}
