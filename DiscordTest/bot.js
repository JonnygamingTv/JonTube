let jontube = require('jontube');
let Discord = require('discord.js');
let client = new Discord.Client();
let config = require("./config.json");
client.login(config.token);
client.on('ready', () => {
	console.log(`I'm ready as ${client.user.tag}`);
	client.user.setPresence({game: {name: 'JonTubing'}, status: 'online'});
});
let guilds = {};
client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  } else if(command === "play") {
	  let stuff = args.join(0).split('?v=');
	  if(stuff[1]) {
	  if(stuff[0].toLowerCase().includes("jontube.com")) {
		  jontube(stuff[1], function(videodata) {
			  try {
				  let JSONobj = JSON.parse(videodata);
				  jontube.getuser(JSONobj.cid, function(userdata){
					  if(userdata) {
					  let userJSON = JSON.parse(userdata);
					  let embed = new Discord.RichEmbed()
					  .setAuthor(`${userJSON.n}`, (userJSON.i?"https://JonTube.com/"+[userJSON.i.slice(3)]:"https://www.JonTube.com/JonTube.png"))
					  .setTitle(`${JSONobj.n}`)
					  .setDescription(`${JSONobj.d}\n\n_Uploaded by [${userJSON.n}](https://www.JonTube.com/channels/${JSONobj.cid})_`)
					  .setThumbnail(`https://JonTube.com/${JSONobj.thumb}`)
					  .setFooter(JSONobj.up, (userJSON.i?"https://JonTube.com/"+[userJSON.i.slice(3)]:"https://www.JonTube.com/JonTube.png"));
					  message.reply(embed);
					playMusic(message, JSONobj);
					  }
				  });
			  } catch(error) {
				  console.log(error);
			  }
			  
		  });
	  }
	  } else {
		  message.reply("No video provided");
	  }
  } else if(command === "nowplaying" || command == "np") {
	  if(guilds[message.guild.id]) {
		  
	  }
  } else if(command === "queue") {
	  
  }
});
function playMusic(message, JSONobj) {
if(!guilds[message.guild.id]) {
guilds[message.guild.id] = {
dispatcher: null,
queue: [],
channel: null,
timeout: null
}
}
if(message.member.voiceChannel) {
if(!guilds[message.guild.id].channel) {guilds[message.guild.id].channel = message.member.voiceChannel;} else if(message.member.hasPermission('MANAGE_GUILD')) {guilds[message.guild.id].channel = message.member.voiceChannel;}
guilds[message.guild.id].queue.push(JSONobj.vF);
guilds[message.guild.id].channel.join().then(connection => {
if(guilds[message.guild.id].timeout) clearTimeout(guilds[message.guild.id].timeout);
guilds[message.guild.id].dispatcher = connection.playArbitraryInput(`https://JonTube.com/${guilds[message.guild.id].queue[0]}`);
guilds[message.guild.id].dispatcher.setVolume(0.8);
guilds[message.guild.id].dispatcher.setBitrate(64);
guilds[message.guild.id].dispatcher.player.opusEncoder.bitrate = 64;
guilds[message.guild.id].dispatcher.on('end', () => {
guilds[message.guild.id].queue.shift();
if(!guilds[message.guild.id].queue[0]) {
guilds[message.guild.id].timeout = setTimeout(function() {
guilds[message.guild.id].channel.leave();
guilds[message.guild.id].dispatcher = null;
guilds[message.guild.id].channel = null;
}, 60000);
} else {
	playMusic(message);
}
});
});
}
}
