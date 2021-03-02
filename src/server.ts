import { app } from "./app";

// aqui ele roda o servidor quando o comando "yarn dev" é digitado.
// foi dividido assim pra poder acessar dentro dos testes, sem ligar o servidor
// daí dá pra usar o servidor próprio da biblioteca de testes. (a supertest) 
app.listen(3333, () => console.log('Server is running'));