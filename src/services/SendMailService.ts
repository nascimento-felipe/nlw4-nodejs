import nodeMailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

class SendMailService {
    // variável que vai receber o cliente de email, que vai enviar o email
    private client: Transporter

    constructor() {
        // dentro do construtor, ele cria uma conta de teste. Essa conta, quando criada, vai executar
        // a arrow function da frente, onde ele pega a conta criada e cria um "transportador" com os dados
        // da conta criadas
        nodeMailer.createTestAccount().then((account) => {

            // aqui a criação de um cliente pra mandar o email, tipo uma conta nova de email
            const transporter = nodeMailer.createTransport({
                host: account.smtp.host, // coloca o host
                port: account.smtp.port, // coloca a porta
                secure: account.smtp.secure, // garante a segurança
                auth: {
                    user: account.user, //entra usando o usuário
                    pass: account.pass // e entra usando a senha do usuário
                }
            });

            // por fim, o cliente recebe os dados que foram colocados dentro da constante transporter
            this.client = transporter;
        });
    }

    // função que envia o email pra alguma pessoa, tendo as informações passadas por parâmetros
    async execute(to: string, subject: string, variables: object, path: string, from: string) {

        // aqui é passado o caminho pro arquivo .hbs e é passado como urf8, pra reconhecer caracteres como 'ç' e 'ã'
        const templateFileContent = fs.readFileSync(path).toString("utf8");

        // nessa contante é recebido o .hbs compilado, onde o parâmetro é a constante que foi criada na linha de cima 
        const mailTemplateParse = handlebars.compile(templateFileContent);

        // o .hbs tem algumas variáveis que precisam ser passadas, então aqui elas são passadas.
        // essas variáveis são passadas dentro do parâmetro variables, que é um objeto
        const html = mailTemplateParse(variables);

        // depois de tudo, o email é enviado, usando os parâmetros passados
        const message = await this.client.sendMail({
            to,
            subject,
            html: html,
            from: from
        })

        // pra poder acessar a mensagem, é passado o id dela aqui e também a url
        console.log('Message sent: %s', message.messageId);
        console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(message));
    }
}

export default new SendMailService();

