import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { userName, password } = authCredentialsDto;
        const user = new User();
        user.userName = userName;
        user.password = password;
        await user.save();
    }

}
