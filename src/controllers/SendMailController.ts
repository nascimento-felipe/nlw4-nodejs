import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { resolve } from 'path';

import { SurveyRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UserRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import { AppError } from "../errors/AppError";


class SendMailController {

    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UserRepository);
        const surveysRepository = getCustomRepository(SurveyRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({ email })

        if (!user) {
            throw new AppError("User does not exists.");
        };

        const survey = surveysRepository.findOne({ id: survey_id })

        if (!survey) {
            throw new AppError("Survey does not exists.");
        };


        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: { user_id: user.id, value: null },
            relations: ["user", "survey"],
        })

        const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');
        const variables = {
            name: user.name,
            title: (await survey).title,
            description: (await survey).description,
            id: "",
            link: process.env.URL_MAIL
        }

        if (surveyUserAlreadyExists) {
            variables.id = surveyUserAlreadyExists.id;

            await SendMailService.execute(email, (await survey).title, variables, npsPath);
            return response.json(surveyUserAlreadyExists);
        }


        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        })

        variables.id = surveyUser.id;

        await surveysUsersRepository.save(surveyUser);

        await SendMailService.execute(email, (await survey).title, variables, npsPath);

        return response.json(surveyUser);
    }
}

export { SendMailController };