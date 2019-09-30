import { AbstractRepository, EntityRepository, UpdateResult } from 'typeorm';
import { Service } from 'typedi';
import { UserInfo } from '../entity/UserInfo';

@Service()
@EntityRepository(UserInfo)
export class UserInfoRepository extends AbstractRepository<UserInfo> {
    findOne(id: number): Promise<UserInfo> {
        return this.repository.findOne(id, { relations: ['address', 'user'] });
    }

    save(userInfo: UserInfo): Promise<UserInfo> {
        return this.repository.save(userInfo);
    }

    update(userInfo: UserInfo): Promise<UpdateResult> {
        return this.repository.update(userInfo.id, userInfo);
    }
}
