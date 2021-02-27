import { Router } from 'express';
import { AnswerController } from './src/controllers/AnswerController';
import { ForgotPassword } from './src/controllers/ForgotPasswordMailController';
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
const forgotPasswordController = new ForgotPassword();

router.post("/users", userController.create);

router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);

router.post("/sendMail", sendMailController.execute);

router.get("/answers/:value", answerController.execute);

router.get("/nps/:survey_id", npsController.execute);

router.post("/forgotpw", forgotPasswordController.execute)
export { router };