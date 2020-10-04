const Discord = require('discord.js');
const fs = require('fs');

const coinfile = require("./coins.json");
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const client = new Discord.Client()


client.on('ready', () => {
    console.log('Bot logged in as ' + client.user.tag + ' succesfully!')
    console.log('The Bot is on ' + client.guilds.cache.size + ' servers!')
    client.user.setStatus('online')
    client.user.setActivity(`Creator Code : texfn`, {type: 'WATCHING'});

})

client.on('message', message => {

    if(message.member.user.bot) return;

    if(!coinfile[message.author.id]) {
        coinfile[message.author.id] = {
            coins : 100
        }
    }

    fs.writeFile("./coins.json", JSON.stringify(coinfile), err => {
        if(err) {
            console.log(err);
        }
    });

    //Help command
    if(message.content === "!help") {
        let embed = new Discord.MessageEmbed()
        .setAuthor(message.member.displayName)
        .setColor("GREEN")
        .setTitle("Help:")
        .addField("!report", "report a player")
        .addField("!ticket", "create's a ticket for you")
        .addField("!flip", "make a coinflip")
        .addField("!play", "[ONLY WORKS IF you have CravyyMusic]")
        .setThumbnail("https://media.giphy.com/media/kgUU1f4LqGkuqAn5Qw/giphy.gif")
        .setFooter("If you have any issues add Craqed#5275 on Discord")
        message.channel.send(embed);
    }

    //Clear command
    if(message.content.startsWith ("!clear")) {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return;
        let messages = message.content.split(" ").slice(1).join("");

        message.delete();
        if(isNaN(messages)) return message.reply("The Value is not correct!");

        message.channel.bulkDelete(messages);
        message.channel.send("deleted messages!").then(msg =>msg.delete({timeout: "4000"}));
    }
    //Server info
    if(message.content === "!serverinfo") {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return;
        if(!message.guild) return;

        let server = {
            logo: message.guild.iconURL(),
            name: message.guild.name,
            createdAt: message.guild.createdAt,
            id: message.guild.id,
            owner: message.member.guild.owner.username,
            region: message.guild.region,
            verified: message.guild.verified,
            members: message.guild.memberCount
        }

        let embed = new Discord.MessageEmbed()
        .setTitle("**ServerInfo**")
        .setColor("RANDOM")
        .setThumbnail(server.logo)
        .addField("**Name**: ", server.name, true)
        .addField("**ID**:", server.id, true)
        .addField("**createdAt**:", server.createdAt, true)
        .addField("**owner**:", server.owner, true)
        .addField("**region**:", server.region, true)
        .addField("**verified**:", server.verified, true)
        .addField("**members**:", server.members, true)

        message.channel.send(embed);
    }

    if(message.content === "!ping") {
        message.channel.send("pong :ping_pong: took " + client.ws.ping + "ms")
    }

    if(message.content.startsWith("!user")) {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return;
        let user = message.mentions.users.first() || message.author

        let userinfo = {
            avater: user.avatarURL(),
            name: user.username,
            createdAt: user.createdAt,
            id: user.id,
            status: user.presence.status,
            bot: user.bot,
            discrim: `#${user.discriminator}`
        }

        let embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setThumbnail(userinfo.avater)
        .addField("**UserName**: ", userinfo.name, true)
        .addField("**discriminator**", userinfo.discrim, true)
        .addField("**ID**:", userinfo.id, true)
        .addField("**Status**:", userinfo.status, true)
        .addField("**Bot**:", userinfo.bot, true)
        .addField("**createdAt**:", user.createdAt, true)

        message.channel.send(embed);
    }

    if(message.content.startsWith("!kick")) {
        if(!message.member.hasPermission('KICK_MEMBERS')) return;

        let user = message.mentions.members.first();

        if(!user) return message.reply("Specify a user");

        message.guild.member(user).kick().catch(error =>{
            if(error) {
            message.channel.send("A error has ocurred " + error)
            } else {
                message.channel.send("succesfully kicked").then(msg=>msg.delete({timeout: "5000"}));
            }
        })
    }

    if(message.content.startsWith("!ban")) {
        if(!message.member.hasPermission('BAN_MEMBERS')) return;

        let user = message.mentions.members.first();

        if(!user) return message.reply("Specify a user");

        message.guild.member(user).ban().catch(error=>{
            if(error) {
                message.channel.send("A error has ocurred " + error)
            } else {
                message.channel.send("succesfully banned").then(msg=>msg.delete({timeout: "5000"}));
            }
        })
    }


    if(message.content.startsWith("!flip")) {
        if(!coinfile[message.author.id]) {
            coinfile[message.author.id] = {
                coins : 100
            }
        }
        let bounty  = message.content.split(" ").slice(1, 2).join("");

        let val  = message.content.split(" ").slice(2, 3).join("");

        Number(bounty)

        if(isNaN(bounty)) return message.reply("You did not enter a number for the coins.You specified **"+ bounty +"**!")

        if(!bounty) return message.reply("You have not specified any coins!")

        if(!val) return message.reply("You have not specified HEAD or NUMBER!")

        if(coinfile[message.author.id].coins < bounty) return message.reply("You don't have enough coins!")

        coinfile[message.author.id].coins -= bounty;

        let chance = Math.floor(Math.random() * 2);

        if(chance == 0) {
            if(val.toLowerCase() == "head") {
                message.reply("And it's..... **Head** !Your specified Coins have been doubled");

                bounty = bounty *2

                coinfile[message.author.id].coins += bounty
            } else {
                if(val.toLowerCase() == "number") {
                    message.reply("And it's..... **Head** !You lost")
                } else {
                    coinfile[message.author.id].coins += bounty;
                }
            }
        } else {
            if(val.toLowerCase() == "number") {
                message.reply("And it's..... **number** !Your specified Coins have been doubled");

                bounty = bounty *2

                coinfile[message.author.id].coins += bounty
            } else {
                if(val.toLowerCase() == "head") {
                    message.reply("And it's..... **number** ! You lost")
                } else {
                    coinfile[message.author.id].coins += bounty;
                }
            }
        }

        fs.writeFile("./coins.json", JSON.stringify(coinfile), err => {
            if(err) {
                console.log(err);
            }
        })

    }
    if(message.content === "!coins") {
        let embed = new Discord.MessageEmbed()
        .setTitle("coins from " + message.author.username)
        .setDescription("Your Coins: " + coinfile[message.author.id].coins)
        .setThumbnail("https://media.giphy.com/media/13yNFN1TlNCjC0/giphy.gif")
        .setColor("YELLOW")

        message.channel.send(embed);
    }

    //BAN
    //Ticket
    //REport
    //flip
    //levelsystem
    //embed
    //userinfo
    //setup

})

client.login(process.env.token);

