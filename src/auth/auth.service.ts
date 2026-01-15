import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { HashingService } from 'src/common/hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.userService.findByEmail(loginAuthDto.email);
    const error = new UnauthorizedException('Usuário ou senha inválidos.');

    if (!user) {
      throw error;
    }

    const isPasswordValid = await this.hashingService.compare(
      loginAuthDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw error;
    }
    const jwtPayload: JwtPayload = { sub: user.id };
    const accessToken = await this.jwtService.signAsync(jwtPayload);

    user.forceLogout = false;
    await this.userService.save(user);

    return { accessToken };
  }
}
