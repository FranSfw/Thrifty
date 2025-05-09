import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { IsNotEmpty, MaxLength, Min } from "class-validator";
import { Branch } from "./branch";
import { Log } from "./log";

// Definición del enum ProductCategory
export enum ProductCategory {
  DRINKS = "drinks",
  DESSERTS = "desserts",
  CUPS = "cups",
  CONES = "cones",
  INGREDIENTS = "ingredients",
  BUCKET = "bucket",
  THRIFTY_PACK = "thrifty_pack",
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  @IsNotEmpty()
  @MaxLength(100)
  productName!: string;

  @Column({ length: 500, nullable: true })
  @MaxLength(500)
  description!: string;

  @Column({ type: "enum", enum: ProductCategory })
  @IsNotEmpty()
  category!: ProductCategory;

  @Column()
  @IsNotEmpty()
  @Min(0)
  initialQuantity!: number;

  @IsNotEmpty()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price!: number;

  @Column()
  @IsNotEmpty()
  @Min(0)
  cost!: number;

  @Column({ nullable: true, length: 1000 })
  @MaxLength(1000)
  imageSrc!: string;

  @Column()
  @IsNotEmpty()
  addedAt!: Date;

  @Column()
  branchId!: number;

  @ManyToOne(() => Branch, (branch) => branch.products)
  @JoinColumn({ name: "branchId" })
  branch!: Branch;

  @OneToMany(() => Log, (log) => log.product)
  logs!: Log[];
}
