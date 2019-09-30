import { Currency } from '../entity/Currency';
import { CurrencyResponseDTO } from '../dto/CurrencyResponseDTO';

const objectMapper = require('object-mapper');

const currencyResponseDTO = {
    id: 'id',
    name: 'name',
    code: 'code',
};

export function fromCurrencyToCurrencyResponseDTO(currency: Currency): CurrencyResponseDTO {
    return objectMapper(currency, currencyResponseDTO);
}
