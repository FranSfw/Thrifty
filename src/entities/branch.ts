import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { IsNotEmpty, MaxLength } from "class-validator";
import { Product } from "./product";

@Entity()
export class Branch {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    @IsNotEmpty()
    @MaxLength(100)
    branchName!: string;

    @Column({ length: 255 })
    @IsNotEmpty()
    @MaxLength(255)
    address!: string;

    @OneToMany(() => Product, product => product.branch)
    products!: Product[];
}