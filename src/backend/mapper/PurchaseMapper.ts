import { Purchase } from '../entity/Purchase';
import { PurchaseResponseDTO } from '../dto/PurchaseResponseDTO';
import { Measuring } from '../entity/Measuring';

const objectMapper = require('object-mapper');

const purchaseResponseDTO = {
    id: 'id',
    name: 'name',
    price: 'price',
    measuring: {
        key: 'measuring',
        transform: function(value: string): string {
            return value as Measuring;
        },
    },
};

export function fromPurchaseToPurchaseResponseDTO(purchase: Purchase): PurchaseResponseDTO {
    return objectMapper(purchase, purchaseResponseDTO);
}
