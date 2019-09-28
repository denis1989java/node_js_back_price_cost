import { InjectRepository } from 'typeorm-typedi-extensions';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { DishRepository } from '../repository/DishRepository';
import { UserRepository } from '../repository/UserRepository';
import { DeleteResult } from 'typeorm';
import { IngredientRepository } from '../repository/IngredientRepository';
import { IngredientRequestDTO } from '../dto/IngredientRequestDTO';
import { IngredientResponseDTO } from '../dto/IngredientResponseDTO';
import { Purchase } from '../entity/Purchase';
import { PurchaseRepository } from '../repository/PurchaseRepository';
import PriceCostException from '../error/PriceCostException';
import { Messages } from '../util/Messages';
import { Ingredient } from '../entity/Ingredient';
import { Measuring } from '../entity/Measuring';
import { Dish } from '../entity/Dish';
import { fromIngredientToIngredientResponseDTO } from '../mapper/IngredientMapper';
import UpdateResultUtil from '../util/UpdateResultUtil';

@injectable()
export default class IngredientService {
    constructor(
        @InjectRepository(IngredientRepository) private readonly ingredientRepository: IngredientRepository,
        @InjectRepository(DishRepository) private readonly dishRepository: DishRepository,
        @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
        @InjectRepository(PurchaseRepository) private readonly purchaseRepository: PurchaseRepository,
    ) {}

    public async save(request: IngredientRequestDTO): Promise<IngredientResponseDTO> {
        let dish: Dish = await this.getAndValidateDish(request.dishId);

        let ingredient: Ingredient = await this.fillIngredientData(
            new Ingredient(request.name, request.measuring),
            request,
            dish,
        );

        ingredient = await this.ingredientRepository.save(ingredient);

        dish = await this.updateDish(request.dishId);

        return this.getReturnData(dish.amount, ingredient);
    }

    public async update(request: IngredientRequestDTO): Promise<IngredientResponseDTO> {
        let dish: Dish = await this.getAndValidateDish(request.dishId);

        let ingredient: Ingredient = await this.ingredientRepository.findOne(request.id);
        if (!ingredient) {
            throw new PriceCostException(500, Messages.WRONG_INGREDIENT);
        }

        ingredient = await this.fillIngredientData(new Ingredient(request.name, request.measuring), request, dish);

        const updateResult = await this.ingredientRepository.update(ingredient);
        if (!UpdateResultUtil.isSuccess(updateResult)) {
            throw new PriceCostException(500, Messages.WRONG_INGREDIENT);
        }

        dish = await this.updateDish(request.dishId);

        return this.getReturnData(dish.amount, ingredient);
    }

    delete(id: number): Promise<DeleteResult> {
        return this.ingredientRepository.delete(id);
    }

    private async getAndValidateDish(dishId: number): Promise<Dish> {
        const dish: Dish = await this.dishRepository.findOne(dishId);
        if (!dish) {
            throw new PriceCostException(500, Messages.WRONG_DISH);
        }
        return dish;
    }

    private async getDishAmount(ingredients: Ingredient[]): Promise<number> {
        return ingredients
            .map(ingredient => ingredient.price)
            .map(Number)
            .reduce((prev: number, next: number) => {
                return prev + next;
            });
    }

    private async updateDish(dishId: number): Promise<Dish> {
        let dish = await this.dishRepository.findOne(dishId);

        dish.amount = await this.getDishAmount(dish.ingredients);

        dish = await this.dishRepository.save(dish);

        return dish;
    }

    private getReturnData(amount: number, ingredient: Ingredient): IngredientResponseDTO {
        const ingredientResponseDTO = fromIngredientToIngredientResponseDTO(ingredient);
        ingredientResponseDTO.dishAmount = amount;

        return ingredientResponseDTO;
    }

    private async fillIngredientData(
        ingredient: Ingredient,
        request: IngredientRequestDTO,
        dish: Dish,
    ): Promise<Ingredient> {
        ingredient.quantity = request.quantity;
        ingredient.price = await this.getIngredientPrice(request.measuring, request.quantity, request.purchaseId);
        ingredient.dish = dish;
        return ingredient;
    }

    private async getIngredientPrice(measuring: Measuring, quantity: number, purchaseId: number): Promise<number> {
        const purchase: Purchase = await this.purchaseRepository.findOne(purchaseId);
        if (!purchase) {
            throw new PriceCostException(500, Messages.WRONG_PURCHASE);
        }
        let price: number = purchase.price * quantity;
        if (measuring === Measuring.L || measuring === Measuring.KG) {
            price = price * 1000;
        }
        return price;
    }
}
