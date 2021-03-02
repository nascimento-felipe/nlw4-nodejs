import { EntityRepository, Repository } from "typeorm";
import { SurveyUser } from "../models/SurveyUser";

// repositório de pesquisas_usuários

@EntityRepository(SurveyUser)
class SurveysUsersRepository extends Repository<SurveyUser> {

}

export { SurveysUsersRepository };