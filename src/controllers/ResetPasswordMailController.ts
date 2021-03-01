import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { UserRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';

class ResetPassword {
    async execute(request: Request, response: Response) {
        // pega o email do body
        const { email } = request.body;

        // pega o repositório de usuários
        const usersRepository = getCustomRepository(UserRepository);

        // encontra o usuário com email == email dentro do repositório
        const user = await usersRepository.findOne({ email });

        // se o usuário não existir, throw error personalizado 
        if (!user) {
            throw new AppError("User does not exists.");
        };

        // pega o handleBars do nps e coloca a variável name dentro de um objeto
        const npsPath = resolve(__dirname, '..', 'views', 'emails', 'resetPassword.hbs')
        const variable = {
            name: user.name
        }

        // executa a função dentro de sendmailservice com os parâmetros pedidos
        await SendMailService.execute(email, 'Reset password', variable, npsPath, "carros eletrizados <noreply@eletrizados.com.br>")

        //retorna o usuário
        return response.json(user);
    }
};

export { ResetPassword };