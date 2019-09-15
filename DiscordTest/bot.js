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
  } else if(command === 'invite') {
	  message.reply(`https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=0&redirect_uri=https%3A%2F%2Fwww.JonTube.com&scope=bot`);
  } else if(command === "play") {
	if(message.channel.type == 'text') {
	  let stuff = args.join(0).split('?v=');
	  if(stuff[1]) {
		  stuff[1] = stuff[1].replace("\n","");
	  if(stuff[0].toLowerCase().includes("jontube.com")) {
		  jontube(stuff[1], function(videodata) {
			  try {
				  let JSONobj = JSON.parse(videodata);
				  jontube.getuser(JSONobj.cid, function(userdata){
					  if(userdata) {
					  let userJSON = JSON.parse(userdata);
					  let embed = new Discord.RichEmbed()
					  .setAuthor(`${userJSON.n}`, (userJSON.i?"https://JonTube.com/"+encodeURI([userJSON.i.slice(3)]):"https://www.JonTube.com/JonTube.png"))
					  .setTitle(`${JSONobj.n}`)
					  .setDescription(`${JSONobj.d}\n\n_Uploaded by [${userJSON.n}](https://www.JonTube.com/channels/${JSONobj.cid})_`)
					  .setThumbnail(`https://JonTube.com/${encodeURI(JSONobj.thumb)}`)
					  .setFooter(JSONobj.up, (userJSON.i?"https://JonTube.com/"+encodeURI([userJSON.i.slice(3)]):"https://www.JonTube.com/JonTube.png"));
					  message.reply(embed);
					playMusic(message, JSONobj, stuff[1]);
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
	}
  } else if(command === "nowplaying" || command == "np") {
	  if(message.channel.type == 'text') {
	  if(guilds[message.guild.id]) {
		  if(guilds[message.guild.id].queueID[0]) {
		  jontube(guilds[message.guild.id].queueID[0], function(videodata) {
			  try {
				  let JSONobj = JSON.parse(videodata);
				  jontube.getuser(JSONobj.cid, function(userdata){
					  if(userdata) {
					  let userJSON = JSON.parse(userdata);
					  let embed = new Discord.RichEmbed()
					  .setAuthor(`${userJSON.n}`, (userJSON.i?"https://JonTube.com/"+encodeURI([userJSON.i.slice(3)]):"https://www.JonTube.com/JonTube.png"))
					  .setTitle(`${JSONobj.n}`)
					  .setDescription(`${JSONobj.d}\n\n_Uploaded by [${userJSON.n}](https://www.JonTube.com/channels/${JSONobj.cid})_`)
					  .setThumbnail(`https://JonTube.com/${encodeURI(JSONobj.thumb)}`)
					  .setFooter(JSONobj.up, (userJSON.i?"https://JonTube.com/"+encodeURI([userJSON.i.slice(3)]):"https://www.JonTube.com/JonTube.png"));
					  message.reply(embed);
					  }
				  });
			  } catch(error) {
				  console.log(error);
			  }
			  
		  });
		  } else {
			  message.reply("Nothing is currently playing.");
		  }
	  }
	  }
  } else if(command === "queue") {
	  if(message.channel.type == 'text') {
	  message.reply(guilds[message.guild.id].queue);
	  }
  }
});
function playMusic(message, JSONobj, ID) {
if(!guilds[message.guild.id]) {
guilds[message.guild.id] = {
dispatcher: null,
queue: [],
queueF: [],
queueID: [],
channel: null,
timeout: null,
playing: false,
listening: false
}
}
if(message.member.voiceChannel) {
if(!guilds[message.guild.id].channel) {guilds[message.guild.id].channel = message.member.voiceChannel;} else if(message.member.hasPermission('MANAGE_GUILD')) {guilds[message.guild.id].channel = message.member.voiceChannel;}
guilds[message.guild.id].queueF.push(JSONobj.vF);
if(ID) guilds[message.guild.id].queueID.push(ID);
if(!guilds[message.guild.id].channel) return;
guilds[message.guild.id].channel.join().then(connection => {
if(guilds[message.guild.id].timeout) clearTimeout(guilds[message.guild.id].timeout);
if(!guilds[message.guild.id].playing) {
guilds[message.guild.id].dispatcher = connection.playArbitraryInput(`http://JonTube.com/${encodeURI(guilds[message.guild.id].queueF[0])}`);
guilds[message.guild.id].dispatcher.setVolume(0.8);
guilds[message.guild.id].dispatcher.setBitrate(64);
guilds[message.guild.id].dispatcher.player.opusEncoder.bitrate = 64;
guilds[message.guild.id].playing = true;
}
if(!guilds[message.guild.id].listening) {
	guilds[message.guild.id].listening = true;
guilds[message.guild.id].dispatcher.on('end', function() {
guilds[message.guild.id].playing = false;
guilds[message.guild.id].queueF.shift();
guilds[message.guild.id].queueF.pop();
guilds[message.guild.id].queue.shift();
guilds[message.guild.id].queue.pop();
guilds[message.guild.id].queueID.shift();
guilds[message.guild.id].queueID.pop();
if(!guilds[message.guild.id].queue[0]) {
guilds[message.guild.id].timeout = setTimeout(function() {
if(guilds[message.guild.id].channel) guilds[message.guild.id].channel.leave();
guilds[message.guild.id].dispatcher = null;
guilds[message.guild.id].channel = null;
}, 60000);
} else {
	setTimeout(function() {
	playMusic(message, JSONobj);
	}, 1000);
}
});
}
guilds[message.guild.id].queue.push(JSONobj.n);
});
}
}
