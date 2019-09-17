import { User } from '../entity/User';
import { AbstractRepository, DeleteResult, EntityRepository } from 'typeorm';
import { Service } from 'typedi';

@Service()
@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
    findOne(id: number): Promise<User> {
        return this.repository.findOne(id, { relations: ['userInfo', 'userInfo.address', 'userInfo.currency'] });
    }

    save(user: User): Promise<User> {
        return this.repository.save(user);
    }

    delete(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }

    findByEmail(email: string): Promise<User> {
        return this.repository.findOne({ email: email });
    }
}
