let jontube = require('jontube');
let Discord = require('discord.js');
let client = new Discord.Client();
let config = require("./config.json");
client.login(config.token);
client.on('ready', () => {
	console.log(`I'm ready as ${client.user.tag}`);
	client.user.setPresence({game: {name: 'JonTubing'}, status: 'online'});
});
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
	  console.log(stuff[1]);
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
					  if(message.member.voiceChannel) {
						  message.member.voiceChannel.join().then(connection => {
							  connection.playArbitraryInput(JSONobj.vF);
						  });
					  }
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
});
