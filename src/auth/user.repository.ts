import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { userName, password } = authCredentialsDto;

        const user = new User();
        user.userName = userName;
        user.salt = await bcrypt.genSalt();;
        user.password = await this.hashPassword(password, user.salt);

        try {
            await user.save();
        } catch (err) {
            if (err.code === '23505') {
                throw new ConflictException('User Existed before');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { userName, password } = authCredentialsDto;
        const user = await this.findOne({ userName });
        if (user && await user.validatePassword(password)) {
            return user.userName;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

}
