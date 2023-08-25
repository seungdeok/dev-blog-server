import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('/login')
  async login(@Body() authLoginUserDto: AuthLoginUserDto) {
    return await this.authService.authenticateUser(authLoginUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/verifyToken')
  async verifyToken(@Request() req) {
    const authorization = req.headers['authorization'];
    if (!authorization) {
      return null;
    }
    const accessToken = authorization.split(' ')[1];
    return await this.authService.verifyToken(accessToken);
  }
}
