import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid';

// criação de um modelo de pesquisa, com todos os campos necessários para criar a pesquisa.
// o id não é criado pelo BD, mas sim pela biblioteca uuid, usada pra criar (adivinha?): *** UUID ***
@Entity("surveys")
class Survey {

    @PrimaryColumn()
    readonly id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuid();
        }
    }
}

export { Survey };