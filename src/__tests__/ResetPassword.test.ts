import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';

import createConnection from '../database';

describe("ResetPassword", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        const connection = getConnection();

        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to send an reset password email to the user", async () => {

        await request(app).post("/users")
            .send({
                name: "Teste",
                email: "email@teste.com.br"
            });

        const response = await request(app).post("/resetpw")
            .send({
                email: "email@teste.com.br"
            });

        expect(response.status).toBe(200);
    })
})