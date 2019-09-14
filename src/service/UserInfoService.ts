import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserInfoRepository } from '../repository/UserInfoRepository';
import { UserInfo } from '../entity/UserInfo';
import { User } from '../entity/User';
import { UserRepository } from '../repository/UserRepository';
import { UserInfoCreateDTO } from '../dto/UserInfoCreateDTO';
import { ForbiddenError } from 'routing-controllers';
import { Messages } from '../util/Messages';
import { Address } from '../entity/Address';
import { UserStatus } from '../entity/UserStatus';
import { fromUserInfoToUserInfoResponseDTO } from '../mapper/UserInfoMapper';
import { UserInfoUpdateDTO } from '../dto/UserInfoUpdateDTO';
import UpdateResultUtil from '../util/UpdateResultUtil';
import { UserInfoResponseDTO } from '../dto/UserInfoResponseDTO';
import { injectable } from 'inversify';
import { CurrencyRepository } from '../repository/CurrencyRepository';

@injectable()
export default class UserInfoService {
    constructor(
        @InjectRepository(UserInfoRepository) private readonly userInfoRepository: UserInfoRepository,
        @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
        @InjectRepository(CurrencyRepository) private readonly currencyRepository: CurrencyRepository,
    ) {}

    async findOne(id: number): Promise<UserInfoResponseDTO> {
        const userInfo = await this.userInfoRepository.findOne(id);
        return fromUserInfoToUserInfoResponseDTO(userInfo);
    }

    async save(request: UserInfoCreateDTO): Promise<UserInfoResponseDTO> {
        let user: User = await this.userRepository.findOne(request.userId);

        if (!user) {
            throw new ForbiddenError(Messages.USER_NOT_EXIST);
        }
        if (user.status !== UserStatus.REGISTERED) {
            throw new ForbiddenError(Messages.WRONG_USER_STATUS);
        }

        const address: Address = new Address();
        address.city = request.city;
        address.country = request.country;
        address.street = request.street;
        address.zip = request.zip;

        let userInfo: UserInfo = new UserInfo();
        userInfo.currency = await this.currencyRepository.findOne(request.currency);
        userInfo.name = request.name;
        userInfo.surname = request.surname;
        userInfo.birthDate = new Date(request.birthDate);
        userInfo.phone = request.phone;
        userInfo.address = address;
        userInfo.user = user;

        userInfo = await this.userInfoRepository.save(userInfo);

        user.userInfo = userInfo;

        user = await this.userRepository.save(user);

        return fromUserInfoToUserInfoResponseDTO(user.userInfo);
    }

    async update(request: UserInfoUpdateDTO): Promise<UserInfoResponseDTO> {
        const userInfo: UserInfo = await this.userInfoRepository.findOne(request.id);
        const user: User = userInfo.user;
        if (!userInfo) {
            throw new ForbiddenError(Messages.USER_INFO_NOT_EXIST);
        }
        if (!user) {
            throw new ForbiddenError(Messages.USER_NOT_EXIST);
        }
        if (user.status !== UserStatus.PROFILE_FULLFILLED) {
            throw new ForbiddenError(Messages.WRONG_USER_STATUS);
        }
        if (!userInfo.address) {
            throw new ForbiddenError(Messages.ADDRESS_NOT_EXIST);
        }

        userInfo.name = request.name;
        userInfo.surname = request.surname;
        userInfo.birthDate = new Date(request.birthDate);
        userInfo.phone = request.phone;
        userInfo.address.city = request.city;
        userInfo.address.country = request.country;
        userInfo.address.street = request.street;
        userInfo.address.zip = request.zip;

        const updateResult = await this.userInfoRepository.update(userInfo);
        if (!UpdateResultUtil.isSuccess(updateResult)) {
            // todo DM write custom application Exception
            throw new ForbiddenError(Messages.WRONG_USER_INFO);
        }

        return fromUserInfoToUserInfoResponseDTO(userInfo);
    }
}
