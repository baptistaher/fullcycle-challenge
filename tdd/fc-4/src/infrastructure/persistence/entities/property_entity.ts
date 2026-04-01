import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity("properties")
export class PropertyEntity {

    @PrimaryColumn("uuid")
    id!: string;

    @Column()
    name!: string;


    @Column()
    description!: string;

    @Column()  
    maxGuests!: number;
}