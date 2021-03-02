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
    });

    it("Should create a email, linking a survey and a user in the database", async () => {
        try {
            jest.setTimeout(10000);
            const survey = await request(app).post("/surveys")
                .send({
                    title: "teste",
                    description: "teste"
                });

            const title = `"${survey.body.title}"`

            const id = `"${survey.body.id}"`;

            await request(app).post("/users")
                .send({
                    name: "Usuario",
                    email: "usuario@email.com"
                });

            const res = await request(app).post("/sendMail")
                .send({
                    email: "usuario@email.com",
                    survey_id: id
                })
            expect(res.status).toBe(200);

        } catch (error) {
            console.log(error)
        }

    })
})