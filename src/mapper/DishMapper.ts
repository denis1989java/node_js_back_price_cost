import { Dish } from '../entity/Dish';
import { DishResponseDTO } from '../dto/DishResponseDTO';

const objectMapper = require('object-mapper');

const dishResponseDTO = {
    id: 'id',
    name: 'name',
};

export function fromDishToDishResponseDTO(dish: Dish): DishResponseDTO {
    return objectMapper(dish, dishResponseDTO);
}
