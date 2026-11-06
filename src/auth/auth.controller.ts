import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from '../decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { RegisterUserDto, UserLoginDto } from '../users/dto/create-user.dto';
import type { Response, Request } from 'express';
import type { IUser } from '../users/users.interface';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

// nhận request từ client
@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @ApiOperation({ summary: "Đăng nhập tài khoản bằng email/mật khẩu" })
    @ApiBody({ type: UserLoginDto })
    @Post('/login')
    @ResponseMessage("Đăng nhập thành công")
    handleLogin(@Req() req: any,
        @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response);
    }

    @Public()
    @ApiOperation({ summary: "Đăng ký tài khoản người dùng mới" })
    @ResponseMessage("Register a new user")
    @Post('/register')
    handleRegister(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @ApiOperation({ summary: "Lấy thông tin tài khoản hiện tại từ token" })
    @ResponseMessage("Get user information")
    @Get('/account')
    handleGetAccount(@User() user: IUser) {
        return { user };
    }

    @Public()
    @ApiOperation({ summary: "Lấy Access Token mới bằng Refresh Token qua Cookie" })
    @ResponseMessage("Get user refresh token")
    @Get('/refresh')
    handleRefreshToken(@Req() request: Request,
        @Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies["refresh_token"];

        return this.authService.processNewToken(refreshToken, response);
    }

    @ApiOperation({ summary: "Đăng xuất tài khoản" })
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
    @ApiOperation({ summary: "Khởi tạo đăng nhập / đăng ký bằng Google (chuyển hướng sang Google)" })
    @Get('/google')
    @ResponseMessage("Redirect to Google Login")
    handleGoogleLogin() {
        // Guard tự động chuyển hướng sang Google
    }

    @Public()
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({ summary: "Nhận kết quả callback từ Google OAuth 2.0" })
    @Get('/google/callback')
    @ResponseMessage("Đăng nhập bằng Google thành công")
    handleGoogleCallback(
        @Req() req: any,
        @Res({ passthrough: true }) response: Response,
    ) {
        return this.authService.login(req.user, response);
    }
}
