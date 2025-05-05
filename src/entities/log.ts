import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Product } from "./product";
import { User } from "./user";

// Definición del enum LogReason
export enum LogReason {
    ESTETIC = "estetic",
    NOT_USABLE = "not_usable",
    SALE = "sale",
    PURCHASE = "purchase",
    REFUND = "refund"
}

@Entity()
export class Log {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    productId!: number;

    @ManyToOne(() => Product, product => product.logs)
    @JoinColumn({ name: "productId" })
    product!: Product;

    @Column()
    @IsNotEmpty()
    quantityOfChange!: string;

    @Column()
    @IsNotEmpty()
    movedAt!: Date;

    @Column()
    userId!: number;

    @ManyToOne(() => User, user => user.logs)
    @JoinColumn({ name: "userId" })
    user!: User;

    @Column({ type: "enum", enum: LogReason })
    @IsNotEmpty()
    reason!: LogReason;
}