import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class UserController {
    async create(request: Request, response: Response) {
        const { name, email } = request.body;

        const schema = yup.object().shape({
            name: yup.string().required("Nome é obrigatório"), // Pode setar a mensagem de erro aqui
            email: yup.string().email().required("Email não é válido")
        });

        // Daria pra fazer um if assim:
        /*
            if (!(await schema.isValid(request.body))) {
                return response.status(400).json({
                    error: "Validation Failed."
                })
            }

        mas com o try catch fica melhor pra passar as informações.
        */
        try {
            await schema.validate(request.body, { abortEarly: false });
        } catch (error) {
            throw new AppError(error);
        }

        const usersRepository = getCustomRepository(UserRepository)

        // é o mesmo que "SELECT * FROM USERS WHERE email = "email"
        const userAlreadyExists = await usersRepository.findOne({
            email
        });

        if (userAlreadyExists) {
            throw new AppError("User already exists.");
        }

        const user = usersRepository.create({
            name, email
        });

        await usersRepository.save(user);

        return response.status(201).json(user);
    }
}

export { UserController };
