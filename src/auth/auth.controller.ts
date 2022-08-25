import { Body, CacheInterceptor, Controller, Get, Headers, Logger, Post, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiBearerAuth, ApiHeader, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReqSignInDTO } from '../auth/dtos/requests/sign-in.dto'; 
import { ReqSignUpDTO } from '../auth/dtos/requests/sign-up.dto';
import { AuthService } from './auth.service';
import { ReqForgotPasswordDTO }  from './dtos/requests/ForgotPassword.dto';
import { ReqResetPasswordDTO } from './dtos/requests/ResetPassword.dto';
import { Token } from './interfaces/token.interface';
import { ResSignUpDTO } from './dtos/responses/sign-up.dto';
import { ResSignInDTO } from './dtos/responses/sign-in.dto';
import { ResForgotPasswordDTO } from './dtos/responses/ForgotPassword.dto';
import { ResLogoutDTO } from './dtos/responses/logout.dto';
import { ResResetPasswordDTO } from './dtos/responses/reset-password.dto';

@UseInterceptors(CacheInterceptor)
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('signup')
    @ApiBody({ type: ReqSignUpDTO })
    @ApiResponse({ status: 201, description: 'SignUp', type: ResSignUpDTO})
    @UsePipes(new ValidationPipe({ transform: true }))
    signup(@Body() user: ReqSignUpDTO) {
      return this.authService.signup(user);
    }

    @Get('users/confirm?')
    async verifyEmail(@Query('token') token) {
      return this.authService.verifyEmail(token);
    }

    @Post('signin')
    @ApiBody({type: ReqSignInDTO})
    @ApiResponse({ status: 201, description: 'SignIn', type: ResSignInDTO})
    async signin(@Body() user: ReqSignInDTO) {
      return await this.authService.signin(user);
    }

    @Post('logout')
    @ApiBearerAuth()
    @ApiResponse({ status: 201, description: 'Logout', type: ResLogoutDTO})
    @ApiHeader({
      name: 'Authorization',
      description: 'Adding a token to the blacklist',
    })
    blackListToken(@Headers('Authorization') token: string): Promise<Token> {
      return this.authService.blackListToken(token);
    }


    @Post('forgot-password')
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiBody({ type: ReqForgotPasswordDTO })
    @ApiResponse({ status: 200, description: 'ForgotPassword', type: ResForgotPasswordDTO})
    async forgotPassword(@Body() email: ReqForgotPasswordDTO) {      
      return await this.authService.forgotPassword(email.email);
    }

    @Post('users/reset-password?')
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiBody({ type: ReqResetPasswordDTO })
    @ApiQuery({ name: 'token' })
    @ApiResponse({ status: 201, description: 'reset password', type: ResResetPasswordDTO})
    async resetPassword(@Query('token') token, @Body() password: ReqResetPasswordDTO) {
      return await this.authService.resetPassword(token, password);
    }
}
