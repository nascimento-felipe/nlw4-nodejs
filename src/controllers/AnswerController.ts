import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";


class AnswerController {
    async execute(request: Request, response: Response) {
        // Pega o valor na URL ("/algumacoisa/:value")
        const { value } = request.params;

        // pega um parêmetro na URL ("/algumacoisa/:value?variavel=value2")
        const { u } = request.query;

        // pega o repositório de usuários e surveys da pasta de repositórios
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        // procura no repositório de usuários e surveys pelo usuário que tem o id == u, que é passada na URL
        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        });

        // SE não existir esse usuário com a pesquisa, throw error (personalizado rs).
        if (!surveyUser) {
            throw new AppError("Survey User does not exists.");
        }

        // troca o valor da pesquisa do usuário pelo valor pego no params
        surveyUser.value = Number(value);

        // promisse que salva a pesquisa no repositório
        await surveysUsersRepository.save(surveyUser);

        // retorna o valor da pesquisa do usuário salva
        return response.json(surveyUser);
    }
}

export { AnswerController };