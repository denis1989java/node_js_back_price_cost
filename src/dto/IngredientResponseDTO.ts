import { Measuring } from '../entity/Measuring';

export class IngredientResponseDTO {
    id: number;

    price: string;

    dishId: number;

    dishAmount: number;

    purchaseId: number;

    quantity: number;

    measuring: Measuring;

    name: string;
}
