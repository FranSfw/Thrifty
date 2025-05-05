import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Log } from "./log";
import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    @IsNotEmpty()
    @MaxLength(100)
    name!: string;

    @Column({ length: 100, unique: true })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    email!: string;

    @Column({ length: 255 })
    @IsNotEmpty()
    @MaxLength(255)
    password!: string;

    @Column({ length: 50 })
    @IsNotEmpty()
    @MaxLength(50)
    role!: string;

    // Relación con Log (un usuario puede tener muchos logs)
    @OneToMany(() => Log, log => log.user)
    logs!: Log[];
}