import { Measuring } from '../entity/Measuring';

export class PurchaseCreateDTO {
    name: string;

    quantity: number;

    measuring: Measuring;

    price: number;

    currency: string;
}
