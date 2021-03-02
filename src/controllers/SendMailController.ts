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
        // pega as contantes do body
        const { email, survey_id } = request.body;

        // pega os repositórios
        const usersRepository = getCustomRepository(UserRepository);
        const surveysRepository = getCustomRepository(SurveyRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        // procura dentro do repositório de usuários e retorna aquele com o email == const email
        // e coloca dentro de uma const user
        const user = await usersRepository.findOne({ email })

        // se o ususário não existir, throw new error
        if (!user) {
            throw new AppError("User does not exists.");
        };

        // procura dentro do repositório de pesquisas e retorna aquela com o id == const survey_id
        // e daí cria uma constante survey pra armazenar ela
        const survey = surveysRepository.findOne({ id: survey_id })

        // se a pesquisa não existir, throw new error
        if (!survey) {
            throw new AppError("Survey does not exists.");
        };

        // procura dentro da tabela surveys_user e retorna aquela onde o user_id == user.id (da constante)
        // e salva dentro de uma constante
        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: { user_id: user.id, value: null },
            relations: ["user", "survey"],
        })

        // procura pelo arquivo com o html do email de nps.
        const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

        // cria uma constante variables pra salvar os dados pra usar os parâmetros dentro da função "sendMailService" 
        const variables = {
            name: user.name,
            title: (await survey).title,
            description: (await survey).description,
            id: "", // o id fica vazio, mas ali em baixo faz sentido.
            link: process.env.URL_MAIL
        }

        // se a pesquisa_usuário já existir, não cria de novo no banco, só retorna o usuário e manda o email.
        if (surveyUserAlreadyExists) {
            variables.id = surveyUserAlreadyExists.id; // se existir, pega o id dele pra colocar na constante de variáveis

            await SendMailService.execute(email, (await survey).title, variables, npsPath, "NPS <noreply@nps.com.br>");
            return response.json(surveyUserAlreadyExists);
        }

        // se a pesquisa não existir, cria no repositório
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        })

        // aqui ele seta o id das variáveis com o usuário_pesquisa criado
        variables.id = surveyUser.id;

        // salva o usuário_pesquisa criado 
        await surveysUsersRepository.save(surveyUser);

        //  as função de enviar email é chamada, e os parâmetros são passados aqui
        await SendMailService.execute(email, (await survey).title, variables, npsPath, "NPS <noreply@nps.com.br>");

        // retorna a pesquisa_usuário
        return response.json(surveyUser);
    }
}

export { SendMailController };