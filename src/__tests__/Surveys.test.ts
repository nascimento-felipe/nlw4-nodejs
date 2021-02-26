import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';

import createConnection from '../database'


// Aqui começa o teste, onde o describe é o teste pra rodar
describe("Surveys", () => {
    // função assíncrona pra criar o BD de testes (before all = antes de tudo)
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    // função assíncrona também pra tirar o BD depois de terminar os teste (afterAll = depois de Tudo)
    afterAll(async () => {
        const connection = getConnection();

        await connection.dropDatabase();
        await connection.close();
    });

    // Começo dos testes.
    it("Should be able to create a new survey", async () => { // Esse primeiro teste verifica se é possível criar uma
        const response = await request(app).post("/surveys") //  nova pesquisa no BD. Pra isso, é criada uma constante
            .send({                                         //  "response" que recebe a resposta da rota "/surveys",
                title: "teste",                             // com título e descrição. Depois, é passado o que é esperado 
                description: "teste"                        // que aconteça com a response. No caso, é esperado que o status
            });                                             // da response seja 201 e o body tenha a propriedade "id".

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });

    it("Should be able to get all surveys", async () => { // Já nesse segundo aqui, a ideia é conseguir acessar a rota
        await request(app).post("/surveys")               // "/surveys" com o método GET. Pra isso, primeiro é criada uma 
            .send({                                       // nova pesquisa, e depois é esperado que a o tamanho da resposta 
                title: "Title 2",                         // seja 2, contando com a pesquisa criada nesse teste e no teste acima.
                description: "teste 2"
            });
        const response = await request(app).get("/surveys");

        expect(response.body.length).toBe(2);
    });
});