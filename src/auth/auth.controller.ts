import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-cred.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // @post /auth/signup
  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/login')
  login(
    @Body() AuthCredentialsDto: AuthCredentialsDto,
  ): Promise<{ token: string }> {
    return this.authService.login(AuthCredentialsDto);
  }
}
