import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserInfo } from './UserInfo';
import { IsEmail } from 'class-validator';
import { UserStatus } from './UserStatus';
import { Dish } from './Dish';
import { Purchase } from './Purchase';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    password: string;

    @Column()
    status: UserStatus;

    @OneToOne(() => UserInfo, userInfo => userInfo.user, {
        cascade: true,
    })
    @JoinColumn()
    userInfo: UserInfo;

    @OneToMany(() => Dish, dish => dish.user)
    @JoinColumn()
    dishes: Dish[];

    @OneToMany(() => Purchase, purchase => purchase.user)
    @JoinColumn()
    purchases: Purchase[];
}
