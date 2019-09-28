import {Purchase} from '../entity/Purchase';
import {PurchaseResponseDTO} from '../dto/PurchaseResponseDTO';

const objectMapper = require('object-mapper');

const purchaseResponseDTO = {
    id: 'id',
    name: 'name',
    price: 'price',
    /*  measuring: {
          key: 'measuring',
          transform: function(value: number): string {
              return Measuring[value];
          },
      },*/
};

export function fromPurchaseToPurchaseResponseDTO(purchase: Purchase): PurchaseResponseDTO {
    return objectMapper(purchase, purchaseResponseDTO);
}
