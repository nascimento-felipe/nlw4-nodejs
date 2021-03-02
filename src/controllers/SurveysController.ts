import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyRepository } from "../repositories/SurveysRepository";

class SurveysController {

    async create(request: Request, response: Response) {
        // constantes do body
        const { title, description } = request.body;

        // repositório de pesquisas
        const surveysRepository = getCustomRepository(SurveyRepository);

        // cria uma pesquisa nova
        const survey = surveysRepository.create({
            title,
            description
        });

        // salva a pesquisa criada
        await surveysRepository.save(survey);

        // retorna a pesquisa criada
        return response.status(201).json(survey);
    }

    async showAll(request: Request, response: Response) {
        // pega o repositório de pesquisas
        const surveysRepository = getCustomRepository(SurveyRepository);

        // pega todos os dados do repositório (tipo um SELECT *)
        const all = await surveysRepository.find();

        // retorna todos os repositórios de pesquisa
        return response.json(all);
    }

    async showOne(request: Request, response: Response) {
        // pega o title que é passado no route params
        const { title } = request.params;

        // pega o repositório de pesquisas
        const surveysRepository = getCustomRepository(SurveyRepository);

        // encontra a pesquisa que tem o title == const title, ou seja, o title que foi
        // passado na URL
        const survey = await surveysRepository.findOne({ title });

        // retorna id da pesquisa encontrada
        return response.json(survey.id);
    }
}

export { SurveysController };