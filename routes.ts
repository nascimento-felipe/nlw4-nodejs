import { Router } from 'express';
import { AnswerController } from './src/controllers/AnswerController';
import { ResetPassword } from './src/controllers/ResetPasswordMailController';
import { NpsController } from './src/controllers/NpsController';
import { SendMailController } from './src/controllers/SendMailController';
import { SurveysController } from './src/controllers/SurveysController';
import { UserController } from './src/controllers/UserController';

const router = Router();
const userController = new UserController();
const surveyController = new SurveysController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();
const resetPasswordController = new ResetPassword();

router.post("/users", userController.create);

router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.showAll);

router.post("/sendMail", sendMailController.execute);

router.get("/answers/:value", answerController.execute);

router.get("/nps/:survey_id", npsController.execute);

router.post("/resetpw", resetPasswordController.execute)

export { router };