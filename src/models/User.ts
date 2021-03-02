import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid';

// modelo de usuário criado. O sistema de criar o id com o uuid é igual o usado dentro do modelo
// de pesquisas.
@Entity("users")
class User {

    @PrimaryColumn()
    readonly id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuid();
        }
    }
}

export { User };