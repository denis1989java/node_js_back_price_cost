import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Address } from './Address';
import { Currency } from './Currency';

@Entity()
export class UserInfo {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Currency)
    @JoinColumn()
    currency: Currency;

    @Column()
    birthDate: Date;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column()
    phone: string;

    @OneToOne(() => User, user => user.userInfo, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    user: User;

    @OneToOne(() => Address, address => address.userInfo, {
        cascade: true,
    })
    @JoinColumn()
    address: Address;
}
