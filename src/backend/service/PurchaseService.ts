import { InjectRepository } from 'typeorm-typedi-extensions';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { PurchaseRepository } from '../repository/PurchaseRepository';
import { User } from '../entity/User';
import { Purchase } from '../entity/Purchase';
import { DeleteResult } from 'typeorm';
import { UserRepository } from '../repository/UserRepository';
import { Messages } from '../util/Messages';
import { PurchaseResponseDTO } from '../dto/PurchaseResponseDTO';
import { fromPurchaseToPurchaseResponseDTO } from '../mapper/PurchaseMapper';
import { PurchaseCreateDTO } from '../dto/PurchaseCreateDTO';
import { Currency } from '../entity/Currency';
import { Measuring } from '../entity/Measuring';
import { CurrencyRepository } from '../repository/CurrencyRepository';
import { PurchaseUpdateDTO } from '../dto/PurchaseUpdateDTO';
import UpdateResultUtil from '../util/UpdateResultUtil';
import PriceCostException from '../error/PriceCostException';

@injectable()
export default class PurchaseService {
    constructor(
        @InjectRepository(PurchaseRepository) private readonly purchaseRepository: PurchaseRepository,
        @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
        @InjectRepository(CurrencyRepository) private readonly currencyRepository: CurrencyRepository,
    ) {}

    async find(userId: number): Promise<PurchaseResponseDTO[]> {
        const user: User = await this.userRepository.findOne(userId);
        if (!user) {
            throw new PriceCostException(500, Messages.USER_NOT_EXIST);
        }
        const purchases: Purchase[] = await this.purchaseRepository.find(user);
        return purchases.map(purchase => fromPurchaseToPurchaseResponseDTO(purchase));
    }

    async findOne(id: number): Promise<PurchaseResponseDTO> {
        const purchase: Purchase = await this.purchaseRepository.findOne(id);
        return fromPurchaseToPurchaseResponseDTO(purchase);
    }

    async save(request: PurchaseCreateDTO, currentUser: User): Promise<PurchaseResponseDTO> {
        let purchase: Purchase = await this.getPurchaseData(request, currentUser);

        purchase = await this.purchaseRepository.save(purchase);

        return fromPurchaseToPurchaseResponseDTO(purchase);
    }

    async update(request: PurchaseUpdateDTO, currentUser: User): Promise<PurchaseResponseDTO> {
        const purchase: Purchase = await this.getPurchaseData(request, currentUser);
        purchase.id = request.id;

        const updateResult = await this.purchaseRepository.update(purchase);
        if (!UpdateResultUtil.isSuccess(updateResult)) {
            throw new PriceCostException(500, Messages.WRONG_PURCHASE);
        }

        return fromPurchaseToPurchaseResponseDTO(purchase);
    }

    delete(id: number): Promise<DeleteResult> {
        return this.purchaseRepository.delete(id);
    }

    private async getPurchaseData(request: PurchaseCreateDTO, currentUser: User): Promise<Purchase> {
        currentUser = await this.userRepository.findOne(currentUser.id);
        if (!currentUser) {
            throw new PriceCostException(500, Messages.USER_NOT_EXIST);
        }
        const baseCurrency: Currency = currentUser.userInfo.currency;
        const chooseCurrency: Currency = await this.currencyRepository.findOne(request.currency);
        const quantity: number = this.getPurchaseQuantity(request.quantity, request.measuring);
        const measuring: Measuring = this.getPurchaseMeasuring(request.measuring);
        const price: number = this.getPurchasePrice(request.price, baseCurrency, chooseCurrency, quantity);

        const purchase: Purchase = new Purchase();
        purchase.name = request.name;
        purchase.measuring = measuring;
        purchase.price = price;
        purchase.user = currentUser;

        return purchase;
    }

    private getPurchaseMeasuring(measuring: Measuring): Measuring {
        switch (measuring) {
            case Measuring.KG:
                measuring = Measuring.G;
                break;
            case Measuring.L:
                measuring = Measuring.ML;
                break;
        }
        return measuring;
    }

    private getPurchaseQuantity(quantity: number, measuring: Measuring): number {
        switch (measuring) {
            case Measuring.L:
            case Measuring.KG:
                quantity = quantity * 1000;
                break;
        }
        return quantity;
    }

    private getPurchasePrice(
        price: number,
        baseCurrency: Currency,
        chooseCurrency: Currency,
        quantity: number,
    ): number {
        price = price / quantity;
        if (chooseCurrency.code === 'USD') {
            price = price * baseCurrency.rate;
        }
        if (chooseCurrency.code !== 'USD' && chooseCurrency !== baseCurrency) {
            price = (price / chooseCurrency.rate) * baseCurrency.rate;
        }
        return price;
    }
}
