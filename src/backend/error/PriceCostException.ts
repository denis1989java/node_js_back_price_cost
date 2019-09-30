import { CustomError } from 'ts-custom-error';

export default class PriceCostException extends CustomError {
    status: number;
    message: string;

    public constructor(status: number, message?: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
