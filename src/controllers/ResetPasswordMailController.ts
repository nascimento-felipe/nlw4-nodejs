import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { UserRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';

class ResetPassword {
    async execute(request: Request, response: Response) {
        const { email } = request.body;
        const usersRepository = getCustomRepository(UserRepository);

        const user = await usersRepository.findOne({ email });

        if (!user) {
            throw new AppError("User does not exists.");
        };

        const npsPath = resolve(__dirname, '..', 'views', 'emails', 'resetPassword.hbs')
        const variable = {
            name: user.name
        }
        await SendMailService.execute(email, 'Reset password', variable, npsPath, "carros eletrizados <noreply@eletrizados.com.br>")

        return response.json(user);
    }
};

export { ResetPassword };