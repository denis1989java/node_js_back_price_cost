export class CurrencyRatesResponseDTO {
    disclaimer: string;

    license: string;

    timestamp: number;

    base: string;

    rates: { [index: string]: number };
}
