import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import type { IUser } from '../users/users.interface';
import { RegisterUserDto } from '../users/dto/create-user.dto';
import { create } from 'domain';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { response, Response } from 'express';
import { RolesService } from '../roles/roles.service';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private rolesService: RolesService
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
    async login(user: IUser, response: Response) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };
        const refresh_token = this.createRefreshToken({ payload });

        //update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id);

        //set refresh token as cookies
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.getOrThrow<string>("JWT_REFRESH_EXPIRE") as ms.StringValue),
        });

        const tempRole = await this.rolesService.findOne(role._id as any) as any;

        return {
            access_token: this.jwtService.sign(payload),

            user: {
                _id,
                name,
                email,
                role,
                permissions: tempRole?.permissions ?? []
            }
        };
    }

    async register(user: RegisterUserDto) {
        let newUser = await this.usersService.register(user);

        return {
            _id: newUser?._id,
            createdAt: newUser?.createdAt,
        }
    }

    createRefreshToken = (payload: any) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN"),
            expiresIn: ms(this.configService.getOrThrow<string>("JWT_REFRESH_EXPIRE") as ms.StringValue) / 1000,
        });
        return refresh_token;
    }

    processNewToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN")
            })

            let user = await this.usersService.findUserByToken(refreshToken);
            if (user) {
                //update refresh_token
                const { _id, name, email, role } = user;
                const payload = {
                    sub: "token refresh",
                    iss: "from server",
                    _id,
                    name,
                    email,
                    role
                };
                const refresh_token = this.createRefreshToken({ payload });

                //update user with refresh token
                await this.usersService.updateUserToken(refresh_token, _id.toString());

                //set refresh token as cookies
                response.clearCookie("refresh_token");

                response.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: ms(this.configService.getOrThrow<string>("JWT_REFRESH_EXPIRE") as ms.StringValue),
                });
                const tempRole = await this.rolesService.findOne((role as any)?._id ?? role.toString());

                return {
                    access_token: this.jwtService.sign(payload),

                    user: {
                        _id,
                        name,
                        email,
                        role,
                        permissions: tempRole?.permissions ?? []
                    }
                };
            }
            else {
                throw new BadRequestException("refresh token heets hanj. vui longf login");

            }
        }
        catch (error) {
            throw new BadRequestException("refresh token heets hanj. vui longf login");
        };

    }

    logout = async (response: Response, user: IUser) => {
        await this.usersService.updateUserToken("", user._id);
        response.clearCookie("refresh_token");
        return "ok";
    }
}
