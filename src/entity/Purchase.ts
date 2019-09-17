import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Measuring } from './Measuring';

@Entity()
export class Purchase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('decimal', { precision: 65, scale: 14, nullable: true })
    price: number;

    @Column()
    measuring: Measuring;

    @ManyToOne(() => User, user => user.purchases)
    user: User;
}
