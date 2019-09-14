import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Ingredient } from './Ingredient';

@Entity()
export class Dish {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    amount: string;

    @ManyToOne(() => User, user => user.dishes)
    user: User;

    @OneToMany(() => Ingredient, ingredient => ingredient.dish)
    ingredients: Ingredient[];
}
