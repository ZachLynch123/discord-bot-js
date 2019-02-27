const Discord = require('discord.js');
const keys = require('./keys');
const DM = require('discord-yt-player');
const ytdl = require('ytdl-core');
const searchYoutube = require('youtube-api-v3-search');
const YoutubeSearch = require('./youtubeTest');
const PREXIX = '$'

const client = new Discord.Client();

const queue = new Map();

client.on('ready', () => console.log("ready!"));

client.on('message', async msg => {
    if (msg.author.bot) return undefined;
    if (!msg.content.startsWith(PREXIX)) return undefined;
    const args = msg.content.split(' ');
    const serverQueue = queue.get(msg.guild.id);

    if (msg.content.startsWith(`${PREXIX}play`)) {
        let arg = [];

        for(let i = 0; i < args.length; i++) {
            if (i > 0) {
                arg.push(args[i])
            }
        }
        
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send("Not in a voice channel, can't play music");
        const permission = voiceChannel.permissionsFor(msg.client.user);
        if (!permission.has('CONNECT')) {
            return msg.channel.send("can't connect to voice channel");
        }
        if (!permission.has('SPEAK')) {
            return msg.channel.send("Im muted");
        }

        const options = {
            q: arg.join(' '),
            part: 'snippet',
            type: 'video'
        }

        searchYoutube(keys.youtubeApi, options)
            .then(res => {                
                const title = res.items[0].snippet.title;
                const url = 'https://www.youtube.com/watch?v=' + res.items[0].id.videoId;
                const song = {
                    title: title,
                    url: url
                }


                if (!serverQueue) {
                    const queueConstuct = {
                        textChannel: msg.channel,
                        voiceChannel: voiceChannel,
                        connection: null,
                        songs: [],
                        volume: 5,
                        playing: true
                    };
                    queue.set(msg.guild.id, queueConstuct);

                    queueConstuct.songs.push(song);

                    let connect = voiceChannel.join();
                    queueConstuct.connection = connect;
                    play(msg.guild, queueConstuct.songs[0]);
                    return msg.channel.send('initial serverQueue creatiobn')
                } else {
                    serverQueue.songs.push(song);
                    return msg.channel.send(`addon`)
                }
                

                connect.then(connection => {
                    const stream = ytdl(song.url, { filter: 'audioonly' });
                    const dispatcher = connection.playStream(stream, { seek: 0, volume: 1 })
                    .on('end', () => {
                        console.log('end');
                    })
                })
                .catch(e => console.log(e))

            })
            .catch(e => console.log(e));
            
        
        
/*         const song = {
            title: songInfo.title,
            url: songInfo.video_url
        }  */
        
    } else if (msg.content.startsWith(`${PREXIX}stop`)) {
        if (!msg.member.voiceChannel) return msg.channel.send("You are not in voice channel");
        if (!serverQueue) return msg.channel.send("Nothing to stop");
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        return undefined;
    }

    else if (msg.content.startsWith(`${PREXIX}skip`)) {
        if (!msg.member.voiceChannel) return msg.channel.send("You are not in voice channel");
        if (!serverQueue) return msg.channel.send("Nothing to skip");
        serverQueue.connection.dispatcher.end();
        return "skip";
    }

});

play = (guild, song) => {
    const serverQueue = queue.get(guild.id);

    console.log(serverQueue.connection);
    
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    serverQueue.connection.then(connect => {
        const stream = ytdl(song.url, { filter: 'audioonly' });
        const dispatcher = connect.playStream(stream, { seek: 0, volume: 1 })
        .on('end', () => {
            console.log('end');
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
    })
    .catch(e => console.log(e))
}


/* play = (guild, song) => {
    const serverQueue = queue.get(guild.id);
    serverQueue.connection.then(x => {
        

        // put everything in this function in the .then part


        if (!song) {
        x.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    console.log(ytdl(song.url));
    
    const dispatcher = x.connection.playStream(ytdl(song.url))
        .on('end', () => {
            console.log('song ended');
            x.songs.shift();
            play(guild, x.songs[0]);
            msg.channel.send(`Now playing ${song.title}`);
        })
        .on('error', error => {console.error(error);});
        
    dispatcher.setVolumeLogarithmic(5 / 5);
    })
    .catch(e => {console.log(e)}) */
    

    

/* skip = (guild, song) => {
    const serverQueue = queue.get(guild.id);
    if (!serverQueue.song[1]) {
        msg.channel.send("Add more songs to the queue");
    }
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', () => {
            
        });
} */


client.login(keys.token);