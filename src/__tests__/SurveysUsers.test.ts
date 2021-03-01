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
        const survey = await request(app).post("/surveys")
            .send({
                title: "teste",
                description: "teste"
            });

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

        console.log(id);
        expect(res.body).toHaveProperty("id");
    })
})

/*

                                *** LOG DO ERRO ***
                                
SurveyUser › Should create a email, linking a survey and a user in the database

    expect(received).toHaveProperty(path)

    Expected path: "id"
    Received path: []

    Received value: {"message": "Internal server error: Cannot read property 'title' of undefined", "status": "Error"}

      39 |
      40 |         console.log(id);
    > 41 |         expect(res.body).toHaveProperty("id");
         |                          ^
      42 |     })
      43 | })

      at src/__tests__/SurveysUsers.test.ts:41:26
      at step (src/__tests__/SurveysUsers.test.ts:33:23)
      at Object.next (src/__tests__/SurveysUsers.test.ts:14:53)
      at fulfilled (src/__tests__/SurveysUsers.test.ts:5:58)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        25.525 s

*/