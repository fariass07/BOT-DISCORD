import { Client, GuildBan, IntentsBitField } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.AutoModerationExecution,
    ]
});

const prefix = '!';

client.on("messageCreate", (message) => {

    if (message.author.bot) return;


    if (message.mentions.has(client.user.id)) {
        message.reply("Oi! Tudo bem?");
    }

    if (message.content.startsWith(prefix)) {

        message.reply("Como posso ajudar?");

        if (message.content.startsWith(prefix) && message.mentions.members.first()) {
            const member = message.mentions.members.first();

            message.guild.members.ban(member).then(() => {
                console.log(`Banindo ${member.user.tag}`);
            }).catch(console.error);
        }
    }
});

client.on('ready', (e) => {
    console.log(`${client.user.tag} is online!`);
});

client.login(process.env.TOKEN);