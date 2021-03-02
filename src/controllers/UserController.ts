import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class UserController {
    async create(request: Request, response: Response) {
        // pega o nome e o email passados no body
        const { name, email } = request.body;

        // cria o formato da validação do YUP, colocando na constante schema
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

        mas com o try catch fica melhor pra passar as informações, pra colocar o erro personalizado.
        */
        try {
            await schema.validate(request.body, { abortEarly: false });
        } catch (error) {
            throw new AppError(error);
        }

        // pega o repositório de usuários
        const usersRepository = getCustomRepository(UserRepository)

        // é o mesmo que "SELECT * FROM USERS WHERE email = "email", mas ele para no primeiro
        // resultado encontrado. Pra voltar todos os usuários com esse email, daí poderia usar o
        // usersRepository.find()
        const userAlreadyExists = await usersRepository.findOne({
            email
        });

        // se o usuário já existir, daí ele mostra um erro.
        if (userAlreadyExists) {
            throw new AppError("User already exists.");
        }

        // cria o usuário dentro do repositório de usuários
        const user = usersRepository.create({
            name, email
        });

        // salva o repositório de usuários
        await usersRepository.save(user);

        // retorna um status de 201 e também o usuário salvo
        return response.status(201).json(user);
    }
}

export { UserController };
