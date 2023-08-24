import { IsEmail, Matches } from 'class-validator';

export class AuthLoginUserDto {
  @IsEmail()
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*\d)[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/, {
    message: 'invalid password',
  })
  password: string;
}
