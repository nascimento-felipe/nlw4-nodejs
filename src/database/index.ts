import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (): Promise<Connection> => {
    // pega as opções padrões da conexão com o BD
    const defaultOptions = await getConnectionOptions();

    // se a variável de ambiente 'NODE_ENV' tiver o valor "test", então o banco de dados usado vai ser o de testes,
    // se não, vai ser o banco de dados passado dentro das opções padronizadas.
    return createConnection(
        Object.assign(defaultOptions, {
            database: process.env.NODE_ENV === 'test'
                ? "./src/database/database.test.sqlite"
                : defaultOptions.database
        })
    )
}