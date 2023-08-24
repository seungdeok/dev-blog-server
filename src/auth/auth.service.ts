import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;

  constructor(private readonly configService: ConfigService) {
    this.userPool = new CognitoUserPool({
      UserPoolId: configService.get('AWS_COGNITO_USER_POOL_ID'),
      ClientId: configService.get('AWS_COGNITO_CLIENT_ID'),
    });
  }

  createSecretHash(clientId: string, clientSecret: string, username: string) {
    const hash = crypto
      .createHmac('SHA256', clientSecret)
      .update(clientId + username)
      .digest('base64');

    return hash;
  }

  async authenticateUser(authLoginUserDto: AuthLoginUserDto) {
    const { email, password } = authLoginUserDto;
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
}
