import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserInfo } from './UserInfo';
import { IsEmail } from 'class-validator';
import { UserStatus } from './UserStatus';

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

    @OneToOne(type => UserInfo, userInfo => userInfo.user)
    @JoinColumn()
    userInfo: UserInfo;
}
