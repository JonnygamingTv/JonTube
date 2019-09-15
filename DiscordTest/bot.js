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
  switch(command) {
  case "ping":
	const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
	break;
  case "invite":
	message.reply(`https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=0&redirect_uri=https%3A%2F%2Fwww.JonTube.com&scope=bot`);
	break;
  case "play":
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
	break;
  case "nowplaying":
  case "np":
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
	break;
  case "queue":
	  if(message.channel.type == 'text') {
		  if(guilds[message.guild.id]) {
		  if(args[0] == 'clear') {
			  if(message.member.hasPermission('MANAGE_GUILD')) {
guilds[message.guild.id].queueF = [];
guilds[message.guild.id].queue = [];
guilds[message.guild.id].queueID = [];
message.reply('cleared!');
			  }
		  }
	  message.reply(guilds[message.guild.id].queue);
		  }
	  }
	break;
  case "skip":
	  if(message.channel.type == 'text') {
		  if(guilds[message.guild.id]) {
			  if(guilds[message.guild.id].dispatcher) {
				  if(message.member.hasPermission('MANAGE_GUILD')) {
					  guilds[message.guild.id].dispatcher.end();
					  message.reply("Skipped!");
				  } else {
					  if(!guilds[message.guild.id].skippers) guilds[message.guild.id].skippers = [];
					  if(!guilds[message.guild.id].skips) guilds[message.guild.id].skips = 0;
					  if(!guilds[message.guild.id].skippers.includes(message.author.id)) {
						  guilds[message.guild.id].skippers.push(message.author.id);
						  guilds[message.guild.id].skips++;
						  if((guilds[message.guild.id].skips / guilds[message.guild.id].channel.members) > 0.5) {
							  guilds[message.guild.id].dispatcher.end();
							  message.reply("Skipped!");
						  } else {
						  message.reply(`You want to skip! **${guilds[message.guild.id].skips}/${[message.guild.id].channel.members.size}** wanted this.`);
						  }
					  } else {
						  message.reply(`You already want to skip this, you need **${(guilds[message.guild.id].channel.members.size / 2) - guilds[message.guild.id].skips}** more people to do this`);
					  }
				  }
			  }
		  }
	  }
	break;
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
if(ID) {guilds[message.guild.id].queueF.push(JSONobj.vF);
guilds[message.guild.id].queueID.push(ID);
guilds[message.guild.id].queue.push(JSONobj.n);}
if(!guilds[message.guild.id].channel) return;
guilds[message.guild.id].channel.join().then(connection => {
if(guilds[message.guild.id].timeout) clearTimeout(guilds[message.guild.id].timeout);
if(!guilds[message.guild.id].playing) {
guilds[message.guild.id].dispatcher = connection.playArbitraryInput(`http://JonTube.com/${encodeURI(guilds[message.guild.id].queueF[0])}`);
guilds[message.guild.id].dispatcher.setVolume(0.7);
guilds[message.guild.id].dispatcher.setBitrate(64);
guilds[message.guild.id].dispatcher.player.opusEncoder.bitrate = 64;
guilds[message.guild.id].playing = true;
}
if(!guilds[message.guild.id].listening) {
	guilds[message.guild.id].listening = true;
guilds[message.guild.id].dispatcher.on('end', function() {
	console.log("ended");
	if(guilds[message.guild.id].skippers) guilds[message.guild.id].skippers = [];
	if(guilds[message.guild.id].skips) guilds[message.guild.id].skips = 0;
	guilds[message.guild.id].listening = false;
guilds[message.guild.id].playing = false;
guilds[message.guild.id].queueF.shift();
guilds[message.guild.id].queue.shift();
guilds[message.guild.id].queueID.shift();
if(!guilds[message.guild.id].queue[0]) {
	console.log("no more");
guilds[message.guild.id].timeout = setTimeout(function() {
if(guilds[message.guild.id].channel) guilds[message.guild.id].channel.leave();
guilds[message.guild.id].dispatcher = null;
guilds[message.guild.id].channel = null;
}, 60000);
} else {
	console.log("there's more");
	setTimeout(function() {
		guilds[message.guild.id].playing = false;
	playMusic(message, JSONobj);
	}, 1000);
}
});
}
});
}
}
