import { User } from '../entity/User';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../repository/UserRepository';
import { Messages } from '../util/Messages';
import { ForbiddenError } from 'routing-controllers';
import PasswordUtil from '../util/PasswordUtil';
import TokenUtil from '../util/TokenUtil';
import { UserCreateDTO } from '../dto/UserCreateDTO';
import { CredentialDTO } from '../dto/CredentialDTO';
import { injectable } from 'inversify';

@injectable()
export default class AuthenticationService {
    constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository) {}

    public async isCredentialsValid(request: UserCreateDTO): Promise<CredentialDTO> {
        const persistUser: User = await this.userRepository.findByEmail(request.email);

        if (!persistUser) {
            throw new ForbiddenError(Messages.CREDENTIALS_INVALID);
        }
        if (!(await PasswordUtil.isValidPassword(persistUser.password, request.password))) {
            throw new ForbiddenError(Messages.CREDENTIALS_INVALID);
        }

        const token = await TokenUtil.create(persistUser.email);

        return new CredentialDTO(token, persistUser);
    }
}
