export class MeasuringResponseDTO {

    constructor(index: number, measuring: string, text: string) {
        this.index = index;
        this.measuring = measuring;
        this.text = text;
    }

    index: number;

    measuring: string;

    text: string;

}
