import {IngredientResponseDTO} from '../dto/IngredientResponseDTO';
import {Ingredient} from '../entity/Ingredient';

const objectMapper = require('object-mapper');

const ingredientResponseDTO = {
    id: 'id',
    name: 'name',
    price: 'price',
    quantity: 'quantity',
    /*  measuring: {
          key: 'measuring',
          transform: function(value: number): string {
              return Measuring[value];
          },
      },*/
    'dish.id': 'dishId',
};

export function fromIngredientToIngredientResponseDTO(ingredient: Ingredient): IngredientResponseDTO {
    return objectMapper(ingredient, ingredientResponseDTO);
}
