import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserInfo } from './UserInfo';

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    city: string;

    @Column()
    country: string;

    @Column()
    street: string;

    @Column()
    zip: string;

    @OneToOne(() => UserInfo, userInfo => userInfo.address)
    userInfo: UserInfo;
}
