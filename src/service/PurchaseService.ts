import { InjectRepository } from 'typeorm-typedi-extensions';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { PurchaseRepository } from '../repository/PurchaseRepository';
import { User } from '../entity/User';
import { Purchase } from '../entity/Purchase';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserRepository } from '../repository/UserRepository';
import { ForbiddenError } from 'routing-controllers';
import { Messages } from '../util/Messages';
import { PurchaseResponseDTO } from '../dto/PurchaseResponseDTO';
import { fromPurchaseToPurchaseResponseDTO } from '../mapper/PurchaseMapper';

@injectable()
export default class PurchaseService {
    constructor(
        @InjectRepository(PurchaseRepository) private readonly purchaseRepository: PurchaseRepository,
        @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
    ) {}

    async find(userId: number): Promise<PurchaseResponseDTO[]> {
        const user: User = await this.userRepository.findOne(userId);
        if (!user) {
            throw new ForbiddenError(Messages.USER_NOT_EXIST);
        }
        const purchases: Purchase[] = await this.purchaseRepository.find(user);
        return purchases.map(purchase => fromPurchaseToPurchaseResponseDTO(purchase));
    }

    async findOne(id: number): Promise<PurchaseResponseDTO> {
        const purchase: Purchase = await this.purchaseRepository.findOne(id);
        return fromPurchaseToPurchaseResponseDTO(purchase);
    }

    save(purchase: Purchase): Promise<PurchaseResponseDTO> {
        return this.purchaseRepository.save(purchase);
    }

    update(purchase: Purchase): Promise<UpdateResult> {
        return this.purchaseRepository.update(purchase);
    }

    delete(id: number): Promise<DeleteResult> {
        return this.purchaseRepository.delete(id);
    }
}
