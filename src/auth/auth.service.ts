import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');
    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository, private jwtService: JwtService) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signUp(authCredentialsDto);
    }

    async signin(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const userName = await this.userRepository.validateUserPassword(authCredentialsDto);
        if (!userName) {
            throw new UnauthorizedException('Invalid data');
        }

        const payload: JwtPayload = { userName };
        const accessToken = await this.jwtService.sign(payload);
        this.logger.debug(`Generated Jwt Token with payload ${JSON.stringify(payload)}`);
        return { accessToken };
    }
}
