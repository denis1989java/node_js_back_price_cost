import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Ingredient } from './Ingredient';

@Entity()
export class Dish {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('decimal', { precision: 65, scale: 14, nullable: true, default: 0 })
    amount: number;

    @ManyToOne(() => User, user => user.dishes, {
        onDelete: 'CASCADE',
    })
    user: User;

    @OneToMany(() => Ingredient, ingredient => ingredient.dish, {
        cascade: true,
    })
    @JoinColumn()
    ingredients: Ingredient[];
}
