const { Client, MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Collection } = require('discord.js')
const { token, prefix  } = require('./config')
const client = new Client({ intents: 32767 })
const {Manager} = require('discord-autorole-badges')
const chalk = require('chalk')
const fs = require('fs')
const config = require(`./roller`)
client.on('ready', async () => {
    client.user.setPresence({ activities:[{ name: "</> Levian Code" }], status: "idle" })
})

client.on('messageCreate', async message => {
    try{
        let client = message.client
        if (message.author.bot) return
        if (message.channel.type == "DM") return
        if (!message.content.startsWith(prefix)) return
        let command = message.content.split(' ')[0].slice(prefix.length)
        let params = message.content.split(' ').slice(1)
        let cmd
        if (client.commands.has(command)) {
            cmd = client.commands.get(command)
        } else if (client.aliases.has(command)) {
            cmd = client.commands.get(client.aliases.get(command))
        }
        if (cmd) {
            cmd.run(client, message, params)
        }
    }catch(e){
        message.reply({ embeds: [
            new MessageEmbed()
            .setDescription(`**Beklenmedik bir hatayla karşılaştık!**`)
        ] })
        console.log(e)
    }
})

const log = message => {
    console.log(`${message}`)
}

client.aliases = new Collection()
client.commands = new Collection()
fs.readdir('./commands/', (err, files) => {
    if(!files) return console.log(chalk.bold.red(`Komutlar klasörü yok!`))
    if (err) console.error(err)
    log(chalk.bold.blue(`${files.length} komut yüklenecek.`))
    files.forEach(f => {
        let props = require(`./commands/${f}`)
        log(chalk.bold.gray(`Yüklenen komut: ${props.name}.`))
        client.commands.set(props.name, props)
        props.aliases.forEach(alias => {
            client.aliases.set(alias, props.name)
        })
    })
})


client.login(token).then(() => console.log(chalk.bold.green("LC - Giriş başarılı"))).catch(e => {
    console.log(e)
    console.log(chalk.bold.red("LC - Giriş başarısız"))
    process.exit(1)
})



let manager = new Manager(client, {
    DISCORD_EMPLOYEE: config.discordstaff,
    PARTNERED_SERVER_OWNER: config.discordpartner,
    HYPESQUAD_EVENTS: config.hypesquadevents,
    BUGHUNTER_LEVEL_1: config.bughunterlevel1,
    HOUSE_BRAVERY: config.hypesquadbravery,
    HOUSE_BRILLIANCE: config.hypesquadbrilliance,
    HOUSE_BALANCE: config.hypesquadbalance,
    EARLY_SUPPORTER: config.earlysupporter,
    BUGHUNTER_LEVEL_2: config.bughunterlevel2,
    EARLY_VERIFIED_BOT_DEVELOPER: config.botdeveloper,
    DISCORD_CERTIFIED_MODERATOR: config.discordmod,

})

client.on("guildMemberAdd", async (member) => {
    await manager.setRole(member);
});