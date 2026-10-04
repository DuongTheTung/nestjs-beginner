import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from '../decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterUserDto } from '../users/dto/create-user.dto';

@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    handleLogin(@Request() req: any) {
        return this.authService.login(req.user);
    }

    @Public()
    @ResponseMessage("Register a new user")
    @Post('/register')
    handleRegister(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

}
