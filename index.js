const Discord = require('discord.js');
const keys = require('./keys');
const DM = require('discord-yt-player');
const ytdl = require('ytdl-core');
const PREXIX = '$'

const client = new Discord.Client();

client.on('ready', () => console.log("ready!"));

client.on('message', async msg => {
    if (msg.author.bot) return undefined;
    if (!msg.content.startsWith(PREXIX)) return undefined;
    const args = msg.content.split(' ');

    if (msg.content.startsWith(`${PREXIX}play`)) {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send("Not in a voice channel, can't play music");
        const permission = voiceChannel.permissionsFor(msg.client.user);
        if (!permission.has('CONNECT')) {
            return msg.channel.send("can't connect to voice channel");
        }
        if (!permission.has('SPEAK')) {
            return msg.channel.send("Im muted");
        }

        try {
            var connection = await voiceChannel.join();
        } catch(err){
            console.log(err);
            return msg.channel.send(`Error!: ${err}`);
        }

        const dispatcher = connection.playStream(ytdl(args[1])
            .on('end', () => {
                console.log('song ended');
            })
            .on('error', error => {
                console.error(error);
            }));
        
            dispatcher.setVolumeLogarithmic(5 / 5);

            if (msg.content.startsWith(`${PREXIX}vol`)) {
                if(msg.content instanceof number){
                    dispatcher.setVolumeLogarithmic(msg.content);
                } else {
                    msg.channel.send("Please enter a numeric value");
                }
                
            }
    }
});


client.login(keys.token);
