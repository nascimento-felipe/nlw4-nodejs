import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';
import createConnection from '../database';

describe("SurveyUser", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        const connection = getConnection();

        await connection.dropDatabase();
        await connection.close();
    })

    it("Should create a email, linking a survey and a user in the database", async () => {
        await request(app).post("/surveys")
            .send({
                title: "teste",
                description: "teste"
            });

        const survey = await request(app).get("/surveys/teste");

        await request(app).post("/users")
            .send({
                name: "Usuario",
                email: "usuario@email.com"
            });

        const response = await request(app).post("/sendMail")
            .send({
                email: "usuario@email.com",
                survey_id: survey.body.id
            })

        expect(response.status).toBe(200);
    })
})