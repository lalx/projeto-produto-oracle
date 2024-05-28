const { ociHttpRequest } = require("./ociHttpRequest");
const nodemailer = require("nodemailer");

const queueId = "ocid1.queue.oc1.sa-saopaulo-1.amaaaaaaratte4qa2n2wbble6hlfph6gl4bn7iymvehfdw4k5qnvsgivrafq";
const queueRegion = "https://cell-1.queue.messaging.sa-saopaulo-1.oci.oraclecloud.com";
async function consumir() {
    try {
        console.log(`Aguardando mensagens na fila: ${queueId}`);

        while (true) {
            // Obtendo as mensagens da fila
            let retorno = await ociHttpRequest(`${queueRegion}/20210201/queues/${queueId}/messages?queueId=${queueId}&limit=10`, "GET");
            
            const messages = retorno.messages;
            if (messages.length === 0) {
                console.log("Nenhuma mensagem disponível. Verificando novamente em alguns segundos...");
                // Espera 5 segundos antes de tentar novamente
                await new Promise(res => setTimeout(res, 5000)); 
                continue;
            }

            messages.forEach(async msgFila => {
                console.log("Mensagem recebida:", msgFila.content);

                let email = msgFila.content.email;
                let msg = msgFila.content.msg;
        
                let receipt = msgFila.receipt;
        
                try {
                    // Código para enviar o e-mail.
                    enviarEmail("Resumo do Pedido", email, msg);
        
                    // Retirar da fila
                    await ociHttpRequest(`${queueRegion}/20210201/queues/${queueId}/messages/${receipt}`, "DELETE");
                } catch (ex) {
                    // Para recolocar a mensagem na fila, caso o processamento falhe...
                    let alteracao = {
                        visibilityInSeconds: 30
                    };
                    const retornoUpdate = await ociHttpRequest(`${queueRegion}/20210201/queues/${queueId}/messages/${receipt}`, "PUT", alteracao);
                }
            });
        }
    } catch (err) {
        console.error("Erro ao consumir mensagens:", err);
    }
}

const enviarEmail = (assunto, destinatario, corpoHtml) => {
    // Configuração do transportador de e-mail
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'gglaucojunior@gmail.com', // Seu e-mail
            pass: 'grau839355' // Sua senha ou app password
        }
    });

    // Detalhes do e-mail
    let mailOptions = {
        from: 'gglaucojunior@gmail.com', // Endereço de e-mail do remetente
        to: destinatario,
        subject: assunto,
        html: corpoHtml
    };

    // Enviar e-mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('E-mail enviado: ' + info.response);
    });
}

consumir();