import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController {

    // Cálculo de NPS
    /*
    1 2 3 4 5 6 7 8 9 10

    Detratores -> 0 - 6
    Passivos -> 7 e 8
    Promotores -> 9 e 10

    O Cálculo é: 
    (Número de promotores - número de detratores) / (número de respondentes) * 100
    
    */
    async execute(request: Request, response: Response) {

        // pega o id da pesquisa dentro da URL, no Route Params
        const { survey_id } = request.params;

        // Pega o repositório de pesquisas e usuários
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        // procura dentro do repositório pela row com o survey_id == survey_id e procura pelo valor que não está null
        const surveysUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull()),
        });

        // pega a quantidade de detractors, promoters e passives, procurando a nota
        const detractors = surveysUsers.filter((survey) => survey.value >= 0 && survey.value <= 6).length;
        const promoters = surveysUsers.filter((survey) => survey.value >= 9 && survey.value <= 10).length;
        const passives = surveysUsers.filter((survey) => survey.value >= 7 && survey.value <= 8).length;

        // pega o total de respostas pegando o tamanho do array do surveysUsers
        const totalAnswers = surveysUsers.length;

        // conta do cálculo de NPS
        const calculate = Number(
            (((promoters - detractors) / totalAnswers) * 100).toFixed(2)
        );

        // retorna a quantidade de det, pro e pas,, junto com o total de answers e o valor do nps
        return response.json({
            detractors,
            promoters,
            passives,
            totalAnswers,
            nps: calculate
        })

    }
}

export { NpsController };