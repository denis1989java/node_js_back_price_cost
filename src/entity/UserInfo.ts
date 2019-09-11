import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Address } from './Address';

@Entity()
export class UserInfo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    currency: string;

    @Column()
    birthDate: Date;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column()
    phone: string;

    @OneToOne(type => User, user => user.userInfo)
    user: User;

    @OneToOne(type => Address, address => address.userInfo, {
        cascade: true,
    })
    @JoinColumn()
    address: Address;
}
