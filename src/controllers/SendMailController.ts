import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { resolve } from 'path';

import { SurveyRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UserRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";


class SendMailController {

    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UserRepository);
        const surveysRepository = getCustomRepository(SurveyRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({ email })

        if (!user) {
            return response.status(400).json({
                error: "User does not exists."
            });
        };

        const survey = surveysRepository.findOne({ id: survey_id })

        if (!survey) {
            return response.status(400).json({
                error: "Survey does not exists."
            });
        };

        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        })

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: [{ user_id: user.id }, { value: null }],
            relations: ["user", "survey"],
        })

        const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');
        const variables = {
            name: user.name,
            title: (await survey).title,
            description: (await survey).description,
            user_id: user.id,
            link: process.env.URL_MAIL
        }

        if (surveyUserAlreadyExists) {
            await SendMailService.execute(email, (await survey).title, variables, npsPath);
            return response.json(surveyUserAlreadyExists);
        }

        await surveysUsersRepository.save(surveyUser);

        await SendMailService.execute(email, (await survey).title, variables, npsPath);

        return response.json(surveyUser);
    }
}

export { SendMailController };