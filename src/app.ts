import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import createConnection from "./database";
import { router } from '../routes';
import { AppError } from './errors/AppError';

// aqui é criada uma conexão com o banco de dados
createConnection();
// constante app recebe o express 
const app = express();

// app pode usar o json e o router, pra poder pegar as rotas
app.use(express.json());
app.use(router);

// se algum erro por capturado, ele é retornado
app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
    // se for um erro que nós colocamos como regra (tipo aqueles de !user ou surveyAlreadyExist), ele manda a mensagem
    // colocada lá e também o status code
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            message: err.message
        });
    };

    // se não for, é um erro interno do server, então ele envia a mensagem do erro e o status de 500
    return response.status(500).json({
        status: "Error",
        message: `Internal server error: ${err.message}`
    })
})

export { app };