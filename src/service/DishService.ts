import { User } from '../entity/User';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Messages } from '../util/Messages';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { DishRepository } from '../repository/DishRepository';
import { DishCreateDTO } from '../dto/DishCreateDTO';
import { DishResponseDTO } from '../dto/DishResponseDTO';
import { UserRepository } from '../repository/UserRepository';
import { PriceCostException } from '../error/PriceCostException';
import { Dish } from '../entity/Dish';
import { fromDishToDishResponseDTO } from '../mapper/DishMapper';
import { DishUpdateDTO } from '../dto/DishUpdateDTO';
import { DeleteResult } from 'typeorm';

@injectable()
export default class DishService {
    constructor(
        @InjectRepository(DishRepository) private readonly dishRepository: DishRepository,
        @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
    ) {}

    public async save(request: DishCreateDTO, currentUser: User): Promise<DishResponseDTO> {
        currentUser = await this.userRepository.findOne(currentUser.id);
        if (!currentUser) {
            throw new PriceCostException(500, Messages.USER_NOT_EXIST);
        }

        let dish: Dish = new Dish();
        dish.name = request.name;
        dish.user = currentUser;

        dish = await this.dishRepository.save(dish);

        return fromDishToDishResponseDTO(dish);
    }

    public async update(request: DishUpdateDTO): Promise<DishResponseDTO> {
        let dish: Dish = await this.dishRepository.findOne(request.id);
        if (!dish) {
            throw new PriceCostException(500, Messages.DISH_NOT_EXIST);
        }

        dish.name = request.name;

        dish = await this.dishRepository.save(dish);

        /* const updateResult = await await this.dishRepository.update(dish);
        if (!UpdateResultUtil.isSuccess(updateResult)) {
            throw new PriceCostException(500, Messages.WRONG_DISH);
        }*/

        return fromDishToDishResponseDTO(dish);
    }

    delete(id: number): Promise<DeleteResult> {
        return this.dishRepository.delete(id);
    }
}
