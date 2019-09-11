import {User} from '../entity/User';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {UserRepository} from '../repository/UserRepository';
import {UserStatus} from '../entity/UserStatus';
import {Messages} from '../util/Messages';
import {fromUserToUserResponseDTO} from '../mapper/UserMapper';
import {UserResponseDTO} from '../dto/UserResponseDTO';
import {ForbiddenError} from 'routing-controllers';
import PasswordUtil from '../util/PasswordUtil';
import TokenUtil from '../util/TokenUtil';
import {UserCreateDTO} from '../dto/UserCreateDTO';
import {DeleteResult} from 'typeorm';
import {CredentialDTO} from '../dto/CredentialDTO';
import {injectable} from 'inversify';
import 'reflect-metadata';

const bcrypt = require('bcrypt');

@injectable()
export default class UserService {
    constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository) {
    }

    public async findOne(id: number): Promise<UserResponseDTO> {
        const user: User = await this.userRepository.findOne(id);
        return fromUserToUserResponseDTO(user);
    }

    public delete(id: number): Promise<DeleteResult> {
        return this.userRepository.delete(id);
    }

    public async save(request: UserCreateDTO): Promise<UserResponseDTO> {
        if (await this.userRepository.findByEmail(request.email)) {
            throw new ForbiddenError(Messages.USER_ALREADY_EXIST);
        }

        let user: User = new User();
        user.password = await bcrypt.hash(request.password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
        user.email = request.email;
        user.status = UserStatus.REGISTERED;

        user = await this.userRepository.save(user);

        return fromUserToUserResponseDTO(user);
    }

    public async isCredentialsValid(request: UserCreateDTO): Promise<CredentialDTO> {
        const persistUser: User = await this.userRepository.findByEmail(request.email);

        if (!persistUser) {
            throw new ForbiddenError(Messages.CREDENTIALS_INVALID);
        }
        if (!(await PasswordUtil.isValidPassword(persistUser.password, request.password))) {
            throw new ForbiddenError(Messages.CREDENTIALS_INVALID);
        }

        const token = await TokenUtil.create(persistUser.email);

        return {token: token, email: persistUser.email};
    }
}
