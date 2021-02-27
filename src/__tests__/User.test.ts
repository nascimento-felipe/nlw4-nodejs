import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';

import createConnection from '../database'

// é o que acontece no /Surveys.test.ts

// Começo do bloco de testes
describe("User", () => {
    beforeAll(async () => { // Isso aqui é pra começar os testes, antes de tudo é necessário criar um banco de dados
        const connection = await createConnection(); // pra poder fazer os testes sem danificar o BD da aplicação.
        await connection.runMigrations();
    });

    afterAll(async () => { // Aqui é ele falando que depois de tudo, é  necessário dropar a DB de testes criada.
        const connection = getConnection();

        await connection.dropDatabase();
        await connection.close();
    });

    // Primeiro teste
    it("Should be able to create a new user", async () => { // Esse teste é para criar um novo usuário. Pra isso, 
        const response = await request(app).post("/users") // a rota "/users" é acessada no método POST e espera-se
            .send({                                        // que a o status da resposta seja 201, de 'criado'.
                email: "user@example.com",
                name: "User Example"
            });

        expect(response.status).toBe(201);
    });

    // Segundo teste
    it("Should not be able to create a user with an email which a already exists", async () => {
        const response = await request(app).post("/users") // Já esse segundo teste é pra não deixar criar um usuário
            .send({                                        // com um email já usado. Pra isso, ele cria um usuário igual
                email: "user@example.com",                 // o do teste 1, e espera-se que o status da resposta seja 400.
                name: "User Example"
            });

        expect(response.status).toBe(400);
    })
});