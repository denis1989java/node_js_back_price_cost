import { IsNotEmpty } from 'class-validator';

export class UserInfoUpdateDTO {
    @IsNotEmpty()
    id: number;

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
