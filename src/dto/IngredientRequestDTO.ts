import {Measuring} from '../entity/Measuring';

export class IngredientRequestDTO {

    id: number;

    dishId: number;

    purchaseId: number;

    quantity: number;

    measuring: Measuring;

    name: string;

}
