// Importando dependências
import { Client, GuildBan, IntentsBitField } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();
import ms from 'ms';

// Criando um novo cliente do Discord
const client = new Client({
    // Definindo as intenções do cliente
    intents: [
        IntentsBitField.Flags.Guilds, // Para receber eventos relacionados a servidores
        IntentsBitField.Flags.GuildMembers, // Para receber eventos relacionados a membros
        IntentsBitField.Flags.GuildMessages, // Para receber eventos relacionados a mensagens
        IntentsBitField.Flags.MessageContent, // Para receber conteúdo de mensagens
        IntentsBitField.Flags.AutoModerationExecution, // Para receber eventos de moderação automática
    ]
});

// Definindo o prefixo dos comandos
const prefix = '!';

// Evento que é disparado quando uma mensagem é criada
client.on("messageCreate", (message) => {
    // Verificando se a mensagem foi enviada por um bot
    if (message.author.bot) return;

    // Verificando se a mensagem começa com o prefixo
    if (message.content.startsWith(prefix)) {
        // Dividindo a mensagem em argumentos
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        // Verificando qual comando foi executado
        switch (command) {
            case 'ban':
                // Chamando a função para banir um membro
                banMember(message, args);
                break;
            case 'silence':
                // Chamando a função para silenciar um membro
                silenceMember(message, args);
                break;
            case 'kick':
                kickMember(message, args)
                break;
                
            default:
                // Resposta padrão para comandos não encontrados
                message.reply("Comando não encontrado!");
        }
    }
});

// Função para banir um membro
function banMember(message, args) {
    // Verificando se o membro foi mencionado
    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ');
    const time = args[0];

    // Verificando se o membro foi encontrado
    if (!member) return message.reply("Membro não encontrado!");
    // Verificando se o motivo foi especificado
    if (!reason) return message.reply("Motivo não especificado!");
    // Verificando se o tempo foi especificado
    if (!time) return message.reply("Tempo não especificado!");

    // Convertendo o tempo para milissegundos
    const banTime = ms(time);
    // Verificando se o tempo é muito curto
    if (banTime < 1000) return message.reply("Tempo muito curto!");

    // Banindo o membro
    message.guild.members.ban(member, { reason, days: banTime / 86400000 })
        .then(() => {
            // Resposta após o banimento
            message.channel.send(`@${message.author.tag} baniu @${member.user.tag} por ${banTime}`);
        })
        .catch(console.error);
}

// Função para silenciar um membro
function silenceMember(message, args) {
    // Verificando se o membro foi mencionado
    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ');
    const time = args[0];

    // Verificando se o membro foi encontrado
    if (!member) return message.reply("Membro não encontrado!");
    // Verificando se o motivo foi especificado
    if (!reason) return message.reply("Motivo não especificado!");
    // Verificando se o tempo foi especificado
    if (!time) return message.reply("Tempo não especificado!");

    // Convertendo o tempo para milissegundos
    const silenceTime = ms(time);
    // Verificando se o tempo é muito curto
    if (silenceTime < 1000) return message.reply("Tempo muito curto!");

    // Silenciando o membro
    member.timeout(silenceTime, reason)
        .then(() => {
            // Resposta após o silenciamento
            console.log(`Silenciando ${member.user.tag} por ${reason} por ${time}`);
            message.reply(`Silenciando ${member.user.tag} por ${reason} por ${time}`);
        })
        .catch(console.error);
}

function kickMember(message, args){
    const member = message.mentions.members.fist();
    const reason = args.slice(1).join('');

    if (!member) return message.reply("Membro não encontrado.");
    if (!reason) return message.reply("Motivo não especificado.");
    
    message.guild.members.kick(member, {reason})
        .then(() => {
            // Resposta após o banimento
            message.channel.send(`@${message.author.tag} expulsou @${member.user.tag} por ${reason}`);
        })
        .catch(console.error);
}

// Evento que é disparado quando o cliente está pronto
client.on('ready', (e) => {
    // Resposta quando o cliente está online
    console.log(`${client.user.tag} está online!`);
});