import { IsNotEmpty } from 'class-validator';

export class UserInfoCreateDTO {
    @IsNotEmpty()
    userId: number;

    @IsNotEmpty()
    currency: string;

    @IsNotEmpty()
    birthDate: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    surname: string;

    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    city: string;

    @IsNotEmpty()
    country: string;

    @IsNotEmpty()
    street: string;

    @IsNotEmpty()
    zip: string;
}
