import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Currency {
    constructor(code: string, name: string) {
        this.code = code;
        this.name = name;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column('decimal', { precision: 65, scale: 14, nullable: true })
    rate: number;
}
