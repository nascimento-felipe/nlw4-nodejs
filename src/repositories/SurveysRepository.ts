import { EntityRepository, Repository } from "typeorm";
import { Survey } from "../models/Survey";

// repositório de pesquisas

@EntityRepository(Survey)
class SurveyRepository extends Repository<Survey> {

};

export { SurveyRepository };