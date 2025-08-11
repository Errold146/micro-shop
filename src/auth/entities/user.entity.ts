import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @ApiProperty({
        example: "9d74bfc9-48b0-4220-9d52-7ffc3c8bd9a3",
        description: 'User Id = uuid',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({
        example: "example@email.com",
        description: 'Email user',
        nullable: false,
        uniqueItems: true
    })
    @Column('text', { unique: true })
    email: string

    @ApiProperty({
        example: 'Password123',
        description: 'Password user',
        minLength: 8,
        nullable: false
    })
    @Column('text', { select: false })
    password: string

    @ApiProperty({
        example: 'Juan Perez...',
        description: 'User Full Name',
        nullable: false
    })
    @Column('text')
    fullName: string

    @ApiProperty({
        example: 'true or false',
        description: 'User status',
        default: "true",
        required: false
    })
    @Column('bool', { default: true })
    isActive: boolean

    @ApiProperty({
        example: ['user', 'admin', 'super-user'],
        isArray: true,
        default: 'user'
    })
    @Column('text', { array: true, default: ['user'] })
    roles: string[]

    @OneToMany(
        () => Product,
        product => product.user,
        { cascade: true }
    )
    product: Product[]

    @BeforeInsert()
    checkFieldsInsert() {
        this.email = this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    checkFieldsUpdate() {
        this.checkFieldsInsert()
    }
}
