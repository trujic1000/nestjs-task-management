import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-cred.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async login(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ token: string }> {
    const username = await this.userRepository.login(authCredentialsDto);

    // Create the token
    const payload: JwtPayload = { username };
    const token = await this.jwtService.sign(payload);
    this.logger.debug(
      `Generated JWT Token with payload: ${JSON.stringify(payload)}`,
    );

    return { token };
  }
}
