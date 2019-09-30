import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Dish } from './Dish';
import { Measuring } from './Measuring';

@Entity()
export class Ingredient {
    constructor(name: string, measuring: Measuring) {
        this.name = name;
        this.measuring = measuring;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('decimal', { precision: 65, scale: 14, nullable: true })
    price: number;

    @Column()
    measuring: Measuring;

    @Column()
    quantity: number;

    @ManyToOne(() => Dish, dish => dish.ingredients, {
        onDelete: 'CASCADE',
    })
    dish: Dish;
}
