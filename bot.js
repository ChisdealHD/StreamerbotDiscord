/*jshint esversion: 6 */
/*
 * Chis's Music Bot
 * Developed by ChisdealHD & Bacon_Space
 * Visit https://discord.gg/QWuVhAD for more information.
 */
const errorlog = require("./data/errors.json");

const Discord = require("discord.js");
const started = Date()

var config = require('./config.json');
const bot = new Discord.Client()
const os = require('os')
const admins = config.admins;
const prefix = config.prefix;
const ytkey = config.youtube_api_key;
const client_id = config.client_id;
const twitchkey = config.twitch_api_key;
const twitchusername = config.twitchusername;
const serverport = config.server_port;
const rb = "```";
const Twitter = require('twitter');
const version = "Beta 3.1.1";
const website = "http://comixsyt.space";
const botTwitter = "https://twitter.com/M8_Bot";
const officialDiscord = "https://discord.gg/JBrAVYD";
const embedColor = 0x9900FF;
const fs = require("fs");
const request = require('request');
const cheerio = require('cheerio');
const express = require('express')
  , logger = require('morgan')
  , app = express()
const markdown = require( "markdown" ).markdown;
const startTime = Date.now();
const invite = "My OAuth URL: " + `https://discordapp.com/oauth2/authorize?permissions=1341643849&scope=bot&client_id=${config.client_id}`;
var l = require('stringformat');

function secondsToString(seconds) {
    try {
        var numyears = Math.floor(seconds / 31536000);
        var numdays = Math.floor((seconds % 31536000) / 86400);
        var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
        var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
        var numseconds = Math.round((((seconds % 31536000) % 86400) % 3600) % 60);

        var str = "";
        if (numyears > 0) {
            str += numyears + " year" + (numyears == 1 ? "" : "s") + " ";
        }
        if (numdays > 0) {
            str += numdays + " day" + (numdays == 1 ? "" : "s") + " ";
        }
        if (numhours > 0) {
            str += numhours + " hour" + (numhours == 1 ? "" : "s") + " ";
        }
        if (numminutes > 0) {
            str += numminutes + " minute" + (numminutes == 1 ? "" : "s") + " ";
        }
        if (numseconds > 0) {
            str += numseconds + " second" + (numseconds == 1 ? "" : "s") + " ";
        }
        return str;
    } catch (err) {
        console.log("Could not get time")
        return 'Could not get time';
    }
}

function isCommander(id) {
	if(id === config.owner_id) {
		return true;
	}
	for(var i = 0; i < admins.length; i++){
		if(admins[i] == id) {
			return true;
		}
	}
	return false;
}

var streamersRaw = fs.readFileSync("./streamers.txt", "utf-8");
var streamers = streamersRaw.split(", ");
var streamerCount = streamers.length;


for (i = 0; i < streamerCount; i++) { //Run for the # of streamers
    var halfHour = 1800000; //time in milis that is 30min
    var bootTime = (new Date).getTime(); //get the time the bot booted up
    var halfHourAgo = bootTime - 1800000; //get the time 30min before the boot
    fs.writeFile("./user_time/" + streamers[i] + "_time.txt", halfHourAgo); //write a file with
    request("https://beam.pro/api/v1/channels/" + streamers[i], function(error, response, body) { //ste info for the streamer in JSON
        if (!error && response.statusCode == 200) { //if there is no error checking
            var beamInfo = JSON.parse(body); //setting a var for the JSON info
            const beamID = beamInfo.id; //getting the ID of the streamer
            console.log("Now stalking " + beamInfo.token + " on beam!"); //logs that the bot is watching for the streamer to go live
            ca.subscribe(`channel:${beamID}:update`, data => { //subscribing to the streamer
                var beamStatus = data.online //checks if they are online (its a double check just incase the above line miss fires)
                if (beamStatus == true) { //if the bam info JSON says they are live
                    var liveTime = (new Date).getTime(); //time the bot sees they went live
                    var lastLiveTime = fs.readFileSync("./user_time/" + beamInfo.token + "_time.txt", "utf-8"); //checks the last live time
                    var timeDiff = liveTime - lastLiveTime; //gets the diff of urrent and last live times
                    //console.log(timeDiff);
                    if (timeDiff >= halfHour) { //if its been 30min or more
                        console.log(beamInfo.token + " went live, as its been more than 30min!"); //log that they went live
                        const hook = new Discord.WebhookClient(hookID[0], hookID[1]); //sets info about a webhook
                        hook.sendMessage("live " + beamInfo.token); //tells the webhook to send a message to a private channel that M8Bot is listening to
                    }
                    if (timeDiff < halfHour) { //if its been less than 30min
                        console.log(beamInfo.token + " attempted to go live, but its been under 30min!"); //log that its been under 30min
                    }
                    fs.writeFile("./user_time/" + beamInfo.token + "_time.txt", liveTime); //update last live time regardless if they went live or not
                }
            })
        }
    });
}

bot.on('ready', function() {
    try {
        config.client_id = client_id;
        var msg = `
------------------------------------------------------
> Do 'git pull' periodically to keep your bot updated!
> Logging in...
------------------------------------------------------
Logged in as ${bot.user.username} [ID ${bot.user.id}]
On ${bot.guilds.size} servers!
${bot.channels.size} channels and ${bot.users.size} users cached!
Bot is logged in and ready to play some tunes!
LET'S GO!
------------------------------------------------------`

        console.log(msg)
        var errsize = Number(fs.statSync("./data/errors.json")["size"])
        console.log("Current error log size is " + errsize + " Bytes")
        if (errsize > 5000) {
            errorlog = {}
            fs.writeFile("./data/errors.json", JSON.stringify(errorlog), function(err) {
                if (err) return console.log("Uh oh we couldn't wipe the error log");
                console.log("Just to say, we have wiped the error log on your system as its size was too large")
            })
        }
        console.log("------------------------------------------------------")
    } catch (err) {
        console.log("WELL LADS LOOKS LIKE SOMETHING WENT WRONG! Visit MusicBot server for support (https://discord.gg/EX642f8) and quote this error:\n\n\n" + err.stack)
        errorlog[String(Object.keys(errorlog).length)] = {
            "code": err.code,
            "error": err,
            "stack": err.stack
        }
        fs.writeFile("./data/errors.json", JSON.stringify(errorlog), function(err) {
            if (err) return console.log("Even worse we couldn't write to our error log file! Make sure data/errors.json still exists!");
        })

    }
})

bot.on("message", function(message) {
    try {
        if (message.author.bot) return
		if (message.channel.type === "dm") return;
        if (message.author === bot.user)
            if (message.guild === undefined) {
                message.channel.sendMessage("The bot only works in servers!")

                return;
            }
	if (message.content.startsWith(prefix + 'setstream')) {
            if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) != -1) {
					let suffix = message.content.split(" ").slice(1).join(" ");
					bot.user.setGame(suffix+ ' Is now LIVE! | Do '+prefix+'help for More!','https://twitch.tv/'+suffix)
					message.channel.sendMessage(":ok_hand:" +suffix+ " is now set as Streaming")
            } else {
                message.channel.sendMessage('Only Owners and admins can set Streaming!');
            }
        }
	if (message.content.startsWith(prefix + 'status')) {
            if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) != -1) {
					let suffix = message.content.split(" ").slice(1).join(" ")
					var user = message.author.username;
					bot.user.setGame(suffix ,'https://twitch.tv/'+twitchusername)
					message.channel.sendMessage(":ok_hand:" +suffix+ " is now set as Status")
            } else {
                message.channel.sendMessage('Only Owners and admins can set Status!');
            }
        }
        if (message.content.startsWith(prefix + "ping")) {
            var before = Date.now()
            message.channel.sendMessage("Pong!").then(function(msg) {
                var after = Date.now()
                msg.edit("Pong! **" + (after - before) + "**ms")

            })
        }
     if (message.content === prefix + 'help') {
    message.channel.sendMessage("", {embed: {
  color: 2590000,
  author: {
    name: bot.user.username,
    icon_url: bot.user.avatarURL
  },
  title: 'Commands',
  url: 'https://docs.google.com/spreadsheets/d/1FIdXM5jG7QauYyiS3y92a-UCRapRmq8yl1axNzQZyN4/edit#gid=0',
  description: 'Where all commands Kept at.',
  fields: [
    {
      name: 'Running on:',
      value: process.release.name + ' version ' + process.version.slice(1)
    },
    {
      name: ' Created in Discord.js',
	  value: ' Version: ' + Discord.version + ' [DiscordJS](https://github.com/hydrabolt/discord.js/).'
    }
    ],
      timestamp: new Date(),
  footer: {
    icon_url: bot.user.avatarURL,
    text: '© ' + bot.user.username
  }
}});
  }
        if (message.content.startsWith(prefix + 'servers')) {
			if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) != -1) {
				message.channel.sendMessage("I'm currently on **" + bot.guilds.size + "** server(s)");
			}
        }
        if (message.content === prefix + 'uptime') {
			if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) != -1) {
				message.channel.sendMessage("I have been up for `" + secondsToString(process.uptime()) + "` - My process was started at this time --> `" + started + "`");
			}
        }
        if (message.content.startsWith(prefix + 'sys')) {
            message.channel.sendMessage("```xl\nSystem info: " + process.platform + "-" + process.arch + " with " + process.release.name + " version " + process.version.slice(1) + "\nProcess info: PID " + process.pid + " at " + process.cwd() + "\nProcess memory usage: " + Math.ceil(process.memoryUsage().heapTotal / 1000000) + " MB\nSystem memory usage: " + Math.ceil((os.totalmem() - os.freemem()) / 1000000) + " of " + Math.ceil(os.totalmem() / 1000000) + " MB\nBot info: ID " + bot.user.id + " #" + bot.user.discriminator + "\n```");
        }
        if (message.content.startsWith(prefix + 'shutdown')) {
            if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) != -1) {
                message.channel.sendMessage("**Shutdown has been initiated**.\nShutting down...")
                setTimeout(function() {
                    bot.destroy()
                }, 1000)
                setTimeout(function() {
                    process.exit()
                }, 2000)
            }
        }
        if (message.content.startsWith(prefix + 'say')) {
            if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) != -1) {
                var say = message.content.split(" ").splice(1).join(" ")
                message.delete();
                message.channel.sendMessage(say)
            }
        }
        if (message.content.startsWith(prefix + 'eval')) {
            if (isCommander(message.author.id)) {
                try {
                    let code = message.content.split(" ").splice(1).join(" ")
                    let result = eval(code)
                    message.channel.sendMessage("```diff\n+ " + result + "```")
                } catch (err) {
                    message.channel.sendMessage("```diff\n- " + err + "```")
                }
            } else {
                message.channel.sendMessage("Sorry, you do not have permissisons to use this command, **" + message.author.username + "**.")
            }
        }
        if (message.content.startsWith(prefix + 'invite')) {
            message.channel.sendMessage("My OAuth URL: " + `http://discordapp.com/oauth2/authorize?client_id=${config.client_id}&scope=bot`)
        }
        if (message.content.startsWith(prefix + 'git')) {
            message.channel.sendMessage("GitHub URL: **https://github.com/ChisdealHD/TalentRecordzBot**")
        }
	if (message.content === ":kappa") {
        message.channel.sendFile("./images/emotes/kappa.png")
    }
	if (message.content === ":beam") {
        message.channel.sendFile("./images/emotes/beam.png")
    }
	if (message.content === ":cactus") {
        message.channel.sendFile("./images/emotes/cactus.png")
    }
	if (message.content === ":cat") {
        message.channel.sendFile("./images/emotes/cat.png")
    }
	if (message.content === ":chicken") {
        message.channel.sendFile("./images/emotes/chicken.png")
    }
	if (message.content === ":dog") {
        message.channel.sendFile("./images/emotes/dog.png")
    }
	if (message.content === ":facepalm") {
        message.channel.sendFile("./images/emotes/facepalm.png")
    }
	if (message.content === ":fish") {
        message.channel.sendFile("./images/emotes/fish.png")
    }
	if (message.content === ":mappa") {
        message.channel.sendFile("./images/emotes/mappa.png")
    }
	if (message.content === ":salute") {
       message.channel.sendFile("./images/emotes/salute.png")
    }
	if (message.content === ":sloth") {
        message.channel.sendFile("./images/emotes/sloth.png")
    }
	if (message.content === ":swag") {
        message.channel.sendFile("./images/emotes/swag.png")
    }
	if (message.content === ":termital") {
        message.channel.sendFile("./images/emotes/termital.png")
    }
	if (message.content === ":whoappa") {
        message.channel.sendFile("./images/emotes/whoappa.png")
    }
	if (message.content === ":yolo") {
        message.channel.sendFile("./images/emotes/yolo.png")
    }
	if (message.content === ":heyguys") {
        message.channel.sendFile("./images/emotes/heyguys.png")
    }
	if (message.content === ":doorstop") {
        message.channel.sendFile("./images/emotes/doorstop.png")
    }
	if (message.content === ":elegiggle") {
        message.channel.sendFile("./images/emotes/elegiggle.png")
    }
	if (message.content === ":failfish") {
        message.channel.sendFile("./images/emotes/failfish.png")
    }
	if (message.content === ":feelsbadman") {
        message.channel.sendFile("./images/emotes/feelsbadman.png")
    }
	if (message.content === ":kappaclaus") {
        message.channel.sendFile("./images/emotes/kappaclaus.png")
    }
	if (message.content === ":kappapride") {
        message.channel.sendFile("./images/emotes/kappapride.png")
    }
	if (message.content === ":kappaross") {
       message.channel.sendFile("./images/emotes/kappaross.png")
    }
	if (message.content === ":kappawealth") {
        message.channel.sendFile("./images/emotes/kappawealth.png")
    }
	if (message.content === ":minglee") {
        message.channel.sendFile("./images/emotes/minglee.png")
    }
	if (message.content === ":nootnoot") {
        message.channel.sendFile("./images/emotes/nootnoot.png")
    }
	if (message.content === ":seemsgood") {
        message.channel.sendFile("./images/emotes/seemsgood.png")
    }
	if (message.content === ":swiftrage") {
        message.channel.sendFile("./images/emotes/swiftrage.png")
    }
	if (message.content === ":wutface") {
        message.channel.sendFile("./images/emotes/wutface.png")
    }
	if (message.content === ":getgranted") {
        message.channel.sendFile("./images/emotes/getgranted.png")
    }
	if (message.content === ":adults") {
        message.channel.sendFile("./images/emotes/adults.png")
    }
	if (message.content === ":android") {
        message.channel.sendFile("./images/emotes/android.png")
    }
	if (message.content === ":anonymous") {
        message.channel.sendFile("./images/emotes/anonymous.png")
    }
	if (message.content === ":deathstar") {
        message.channel.sendFile("./images/emotes/deathstar.png")
    }
	if (message.content === ":feelsgoodman") {
        message.channel.sendFile("./images/emotes/feelsgoodman.png")
    }
        if (message.content === ":thecreedsclan") {
        message.channel.sendFile("./images/emotes/LOGO.png")
    }
        if (message.content === ":ampenergycherry") {
        message.channel.sendFile("./images/emotes/AMPEnergyCherry.png")
    }
    	if (message.content === ":argieb8") {
        message.channel.sendFile("./images/emotes/ArgieB8.png")
    }
    	if (message.content === ":biblethump") {
        message.channel.sendFile("./images/emotes/biblethump.png")
    }
    	if (message.content === ":biersderp") {
        message.channel.sendFile("./images/emotes/biersderp.png")
    }
    	if (message.content === ":kapow") {
        message.channel.sendFile("./images/emotes/kapow.png")
    }
    	if (message.content === ":lirik") {
        message.channel.sendFile("./images/emotes/lirik.png")
    }
    	if (message.content === ":mau5") {
        message.channel.sendFile("./images/emotes/Mau5.png")
    }
    	if (message.content === ":mcat") {
        message.channel.sendFile("./images/emotes/mcaT.png")
    }
    	if (message.content === ":pjsalt") {
        message.channel.sendFile("./images/emotes/PJSalt.png")
    }
    	if (message.content === ":pjsugar") {
        message.channel.sendFile("./images/emotes/PJSugar.png")
    }
    	if (message.content === ":twitchRaid") {
        message.channel.sendFile("./images/emotes/twitchraid.png")
    }
	if (message.content === ":gaben") {
        message.channel.sendFile("./images/emotes/gaben.png")
    }
	if (message.content === ":twitch") {
        message.channel.sendFile("./images/emotes/twitch.png")
    }
    	if (message.content === ":Illuminati") {
        message.channel.sendFile("./images/emotes/Illuminati.png")
    }
	if (message.content === ":dableft") {
        message.channel.sendFile("./images/emotes/dableft.png")
    }
	if (message.content === ":dabright") {
        message.channel.sendFile("./images/emotes/dabright.png")
    }
    	if (message.content === prefix + "donate"){
        message.channel.sendMessage("Donate  HERE! show some LOVE <3 https://streamjar.tv/tip/chisdealhd")
    }
	if (message.content.startsWith(prefix + 'MCserverchecker')) {
	  var suffix = message.content.split(" ").slice(1).join(" ");
	   if(suffix == "" || suffix == null) return message.channel.sendMessage("Do " + prefix + "MCserverchecker <IP:PORT> for Checking Server is Online for Minecraft!");
    request("https://eu.mc-api.net/v3/server/info/"+suffix+"/json",
    function(err,res,body){
              var data = JSON.parse(body);
              if(data.online){
                  message.channel.sendMessage(suffix
                      +" is Active "
                      +"\n ICON: "+data.favicon
                      +"\n Online Players: "+data.players.online
					  +"\n Max Players: "+data.players.max
					  +"\n Online: "+data.online
					  +"\n Version: "+data.version.name)
              }else{
                message.channel.sendMessage(suffix+" is offline")
            }
        });
    }
	if (message.content.startsWith(prefix + "dance")) {
        fs.readFile('./dance.txt', 'utf8', function(err, data) {
        var updates = data.toString().split('\n')
        message.channel.sendMessage(updates);
            console.log(updates)
            if (err) {
                message.channel.sendMessage("This Command Doesnt WORK!, Please try AGAIN!");
            }

        });
    }
	if (message.content.startsWith(prefix + "google")) {
    var searchQuery = encodeURI(message.content.substring(8))
    var url = "https://www.google.com/search?q=" + searchQuery;
    message.channel.sendMessage(url + "\n Here Is Your Search!");
    }
	if (message.content.startsWith(prefix + "beam me up")) {
		var mes = ["Aye, aye, Captain.", "Sorry, captain. i need more power!", "Right away, captain."];
		message.channel.sendMessage(mes[Math.floor(Math.random() * mes.length)])
	}
	if (message.content.startsWith(prefix + "whats my name")) {
		var user = message.author.username;
        message.channel.sendMessage("Your name is: " + user)
    }
	if (message.content.startsWith(prefix + "tell me a joke")) {
		var mes = ["What did the mother bee say to the little bee, ```You bee good and beehive yourself.```", "i used to have a fear of hurdles, ```but eventually i got over it```", "Police officer to a driver: “OK, driver’s license, vehicle license, first aid kit and warning triangle. ```Driver: Nah, I’ve already got all that. But how much for that funny Captain’s cap?```", "A German, an American and a Russian walk into a bar.```The bartender looks at them suspiciously and says, “Is this some kind of a joke?```"];
		message.channel.sendMessage(mes[Math.floor(Math.random() * mes.length)])
	}
	if(message.content.startsWith(prefix + "twitch")) {
      var suffix = message.content.split(" ").slice(1).join(" ");
      if(suffix == "" || suffix == null) return message.channel.sendMessage("Do " + prefix + "twitch <username?> for Online Status!");
      request("https://api.twitch.tv/kraken/streams/"+suffix+"?client_id="+twitchkey,
			function(err,res,body){
				if(err) {
					console.log('Error encounterd: '+err);
					message.channel.sendMessage("Horrible stuff happend D:. Try again later.");
					return;
        }
				var stream = JSON.parse(body);
				if(stream.stream){
					message.channel.sendMessage(suffix
					 +" is online, playing "
					 +stream.stream.game
					 +"\n"+stream.stream.channel.status
					 +"\n"+stream.stream.preview.large);
				} else {
					message.channel.sendMessage(suffix+" is offline");
				}
			});
    }
	if(message.content.startsWith(prefix + "sub")) {
        var id = message.content.split(" ").slice(1).join(" ");
        request("https://www.googleapis.com/youtube/v3/search?part=snippet&q="+id+"&key="+ytkey, function(err, resp, body) {
            try{
                var parsed = JSON.parse(body);
                if(parsed.pageInfo.resultsPerPage != 0){
                    for(var i = 0; i < parsed.items.length; i++){
                        if(parsed.items[i].id.channelId) {
                            request("https://www.googleapis.com/youtube/v3/channels?part=statistics&id="+parsed.items[i].id.channelId+"&key="+ytkey, function(err, resp, body) {
                                var sub = JSON.parse(body);
                                if(sub.pageInfo.resultsPerPage != 0){
                                    message.channel.sendMessage("YouTube SUBSCRIBERS: **" + sub.items[0].statistics.subscriberCount + "**");
                                }else message.channel.sendMessage("Nothing found");
                            })
                        break;
                        }
                    }
                }else message.channel.sendMessage("Nothing found");
            }catch(e){
                message.channel.sendMessage(e);
            }
        })
    }
		if (message.content === prefix + 'specs') {
    message.channel.sendMessage("", {embed: {
  color: 2590000,
  author: {
    name: bot.user.username,
    icon_url: bot.user.avatarURL
  },
  title: 'Server Infomation!',
  description: 'Where all Server Infomation.',
  fields: [
    {
      name: 'System info:',
      value: process.platform
    },
	{
      name: 'System Bytes:',
      value: process.arch
    },
	{
      name: 'Running on:',
      value: process.release.name + ' version ' + process.version.slice(1)
    },
	{
      name: 'Process memory usage:',
      value: Math.ceil(process.memoryUsage().heapTotal / 1000000) + ' MB'
    },
	{
      name: 'System memory usage:',
      value: Math.ceil((os.totalmem() - os.freemem()) / 1000000) + ' of ' + Math.ceil(os.totalmem() / 1000000) + ' MB'
    },
    {
      name: ' Created in Discord.js',
	  value: ' Version: ' + Discord.version + ' [DiscordJS](https://github.com/hydrabolt/discord.js/).'
    }
    ],
      timestamp: new Date(),
  footer: {
    icon_url: bot.user.avatarURL,
    text: '© ' + bot.user.username
  }
}});
  }
    if (message.content == prefix+"add-streamer") {
        message.delete(1000);
        message.channel.sendMessage("You need to specify a streamer's beam ID. For example '!add-streamer STREAMER_ID'.");
	}

 if (message.content.startsWith(prefix+"add-streamer")) { //if an owner adds a streamer
        message.delete(1000); //delete the message they sent
        let args = message.content.split(" ").slice(1); //divide the message into args
        let streamer = args[0]; //arg 0 is the streamer's name
        var chatID = message.channel.id; //gets the chat ID that they added the streamer to
        var owner = message.guild.ownerID; //gets the server owner's id
        if (owner == message.author.id || message.author.id == "145367010489008128" || message.author.guild.role.hasPermission("ADMINISTRATOR")) { //if the person who added the streamer is the owner or ComixsYT or an admin
            if (fs.existsSync("./users/" + streamer + ".txt")) { //if they are already in our database
                var currentServers = fs.readFileSync("./users/" + streamer + ".txt", "utf-8"); //get the current allowed servers from their file
                var registered = currentServers.includes(chatID); //checks if the server they are being added to already has them
                if (registered === true) { //if they are already registered on the server
                    message.reply("the streamer " + streamer + " is already registered!"); //tell the server owner they are alreayd on
                }
                if (registered === false && !currentServers.includes(chatID)) { //if they arent on the server alreayd
                    fs.writeFile("./users/" + streamer + ".txt", currentServers + ", " + chatID); //adds the new server ID to their list
                    message.reply("you have added the streamer " + streamer + " to your server!"); //tells the server owner that the streamer was added
                }
            }
            if (!fs.existsSync("./users/" + streamer + ".txt")) { //if they are not in our database yet
                fs.writeFile("./users/" + streamer + ".txt", "301435504761765889, " + chatID); //makes a new file with the chat ID
                var currentStreamers = fs.readFileSync("./streamers.txt", "utf-8"); //gets the current total streamer list
                fs.writeFile("./streamers.txt", currentStreamers + ", " + streamer); //updates the total list with the new streamer added
                var halfHour = 1800000; //time in milis that is 30min
                var addedTime = (new Date).getTime(); //get the time the bot added the streamer
                var halfHourAgo = addedTime - 1800000; //get the time 30min before they were added
                fs.writeFile("./user_time/" + streamer + "_time.txt", halfHourAgo); //write a file with
                var request = require("request"); //the var to request details on the streamer
                request("https://beam.pro/api/v1/channels/" + streamer, function(error, response, body) { //ste info for the streamer in JSON
                    if (!error && response.statusCode == 200) { //if there is no error checking
                        var beamInfo = JSON.parse(body); //setting a var for the JSON info
                        const beamID = beamInfo.id; //getting the ID of the streamer
                        console.log("Now stalking " + beamInfo.token + " on beam!"); //logs that the bot is watching for the streamer to go live
                        ca.subscribe(`channel:${beamID}:update`, data => { //subscribing to the streamer
                            var beamStatus = data.online //checks if they are online (its a double check just incase the above line miss fires)
                            if (beamStatus == true) { //if the bam info JSON says they are live
                                var liveTime = (new Date).getTime(); //time the bot sees they went live
                                var lastLiveTime = fs.readFileSync("./user_time/" + beamInfo.token + "_time.txt", "utf-8"); //checks the last live time
                                var timeDiff = liveTime - lastLiveTime; //gets the diff of urrent and last live times
                                //console.log(timeDiff);
                                if (timeDiff >= halfHour) { //if its been 30min or more
                                    console.log(beamInfo.token + " went live, as its been more than 30min!"); //log that they went live
                                    const hook = new Discord.WebhookClient(hookID[0], hookID[1]); //sets info about a webhook
                                    hook.sendMessage("live " + beamInfo.token); //tells the webhook to send a message to a private channel that M8Bot is listening to
                                }
                                if (timeDiff < halfHour) { //if its been less than 30min
                                    console.log(beamInfo.token + " attempted to go live, but its been under 30min!"); //log that its been under 30min
                                }
                                fs.writeFile("./user_time/" + beamInfo.token + "_time.txt", liveTime); //update last live time regardless if they went live or not
                            }
                        })
                    }
                });
            }

        } else { //if the person who added the streamer is not the server owner
            message.reply("You do not own this server; please do not try to add a streamer!"); //tell them they cant add a streamer
        }
    }

    if (message.content.startsWith(prefix+"remove-streamer") || message.content.startsWith(prefix+"del-streamer")) { //if an owner removes a streamer
        message.delete(1000); //delete the message they sent
        let args = message.content.split(" ").slice(1); //divide the message into args
        let streamer = args[0]; //arg 0 is the streamer's name
        var chatID = message.channel.id; //gets the chat ID that they added the streamer to
        var owner = message.guild.ownerID; //gets the server owner's id
        if (owner == message.author.id || message.author.id == "145367010489008128" || message.author.guild.role.hasPermission("ADMINISTRATOR")) { //if the person is the owner or ComixsYT or an admin
            if (!fs.existsSync("./users/" + streamer + ".txt")) { //if they are not in our database yet
                message.reply(streamer + " was not removed from your server, as you never added them!")
            }
            if (fs.existsSync("./users/" + streamer + ".txt")) { //if they are already in our database
                var currentServers = fs.readFileSync("./users/" + streamer + ".txt", "utf-8"); //get the current allowed servers from their file
                var registered = currentServers.includes(chatID); //checks if the server they are being added to already has them
                if (registered === true) { //if they are already registered on the server
                    if (currentServers == "301435504761765889, " + chatID) {
                        fs.unlinkSync("./users/" + streamer + ".txt");
                        var streamersRaw = fs.readFileSync("./streamers.txt", "utf-8");
                        var newStreamers = streamersRaw.replace(streamer, "");
                        message.reply("you have removed " + streamer + " from the server!")

                    } else {
                        // if (currentServers.includes(chatID + ", ") && !currentServers.includes(", " + chatID)){
                        //   var newChatList = currentServers.replace(chatID + ", ", "")
                        // }
                        if (currentServers.includes(", " + chatID)) {
                            var newChatList = currentServers.replace(", " + chatID, "")
                        }
                        fs.writeFile("./users/" + streamer + ".txt", newChatList)
                        message.reply("you have removed " + streamer + " from the server!")
                    }
                }
            }


        } else { //if the person who added the streamer is not the server owner
            message.reply("You do not own this server; please do not try to remove a streamer!"); //tell them they cant add a streamer
        }
    }
  
  if ((message.content.startsWith("live") && message.author.id == hookID[0]) || //if the bot sends the message
        (message.content.startsWith("live") && message.author.id == "145367010489008128" && message.channel.id == "278697660133801984")) { //if comixs sends the message (and in certian chat)
        let args = message.content.split(" ").slice(1); //seperare command into args
        let beam = args[0]; //beam name is arg 0
        if (fs.existsSync("./users/" + beam + ".txt")) { //varifies that the streamer is on record
            var request = require("request"); //sets a var to request info
            request("https://beam.pro/api/v1/channels/" + beam, function(error, response, body) { //request streamer's in in JSON form
                if (!error && response.statusCode == 200) { //if there is no error
                    var beamInfo = JSON.parse(body); //sets beamInfo to the JSON data
                    if (beamInfo.type == null) { //if there is no game set to the stream
                        var game = "[API ERROR]"; //set the game to the meme game
                    } else { //if there is a game set
                        var game = beamInfo.type.name; //set the game var to the streamer's game
                    }
                    const liveEmbed = new Discord.RichEmbed() //start the embed message template
                        .setTitle(beamInfo.token + "\'s Stream")
                        .setAuthor(beamInfo.name)
                        .setColor(embedColor)
                        .setDescription("Hey guys, " + beam + " is live right now! Click above to watch!")
                        .setFooter("Sent via M8 Bot", "https://cdn.discordapp.com/app-icons/278362996349075456/ce8868a4a1ccbe2f3f746d864f61a206.jpg")
                        .setThumbnail(beamInfo.user.avatarUrl)
                        .setTimestamp()
                        .setURL("http://beam.pro/" + beam)
                        .addField("Streaming", game, true)
                        .addField("Followers", beamInfo.numFollowers, true)
                        .addField("Beam Level", beamInfo.user.level, true)
                        .addField("Total Views", beamInfo.viewersTotal, true) //end the embed message template
                    var serversAllowedRaw = fs.readFileSync("./users/" + beam + ".txt", "utf-8"); //get the list of servers they are allowed to ne announced on
                    var serversAllowed = serversAllowedRaw.split(", "); //splits the servers into individual strings
                    for (i = 0; i < serversAllowed.length; i++) { //run for the total number of servers they are allowed on
                        client.channels.get(serversAllowed[i]).sendEmbed(liveEmbed, "@here, " + beam + " is live!"); //send the live message to servers
                    }

                    var shareMessage = beamInfo.preferences.sharetext.replace("%URL%", "http://beam.pro/" + beamInfo.token)
                    if (shareMessage.includes("%USER%")) {
                        tweetMessage = shareMessage.replace("%USER%", beamInfo.token)
                    }
                    if (!shareMessage.includes("%USER%")) {
                        tweetMessage = shareMessage;
                    }
                    tweetClient.post('statuses/update', {
                        status: tweetMessage
                    })
                }
            });
        }
}

if (message.content == prefix+"allstreamers") {
        message.delete(1000);
        var streamersRaw = fs.readFileSync("./streamers.txt", "utf-8");
        var streamers = streamersRaw.split(", ");
        var streamerCount = streamers.length;
        message.channel.sendMessage("**Current List of Our " + streamerCount + " Streamers**\n" + streamersRaw)
    }
    if (message.content.startsWith(prefix+"beam ")) {
        message.delete(1000)
        var beam = message.content.replace(prefix+"beam ", "")
        var request = require("request"); //the var to request details on the streamer
        request("https://beam.pro/api/v1/channels/" + beam, function(error, response, body) { //set info for the streamer in JSON
            if (!error && response.statusCode == 200) { //if there is no error checking
                var beamInfo = JSON.parse(body); //setting a var for the JSON info
                const beamStuff = new Discord.RichEmbed()
                    .setColor(embedColor)
                    .setTitle(beamInfo.token)
                    .setFooter(bot.user.avatarURL)
                    .setTimestamp()
                    .setThumbnail(beamInfo.user.avatarUrl)
                    .setURL("http://beam.pro/" + beam)
                    .addField("Online", beamInfo.online, true)
					.addField("Title", beamInfo.name, true)
                    .addField("Followers", beamInfo.numFollowers, true)
                    .addField("Beam Level", beamInfo.user.level, true)
					.addField("Watching", beamInfo.viewersCurrent, true)
                    .addField("Total Views", beamInfo.viewersTotal, true)
                    .addField("Joined Beam", beamInfo.createdAt, true)
                    .addField("Audience", beamInfo.audience, true)
                    .addField("Partnered", beamInfo.partnered, true)
					.addField("Player.me", beamInfo.user.social.player, true)
					.addField("Youtube", beamInfo.user.social.youtube, true)
					.addField("Twitter", beamInfo.user.social.twitter, true)
					.addField("Facebook", beamInfo.user.social.facebook, true)
					.addField("Instagram", beamInfo.user.social.instagram, true)
					.addField("Steam", beamInfo.user.social.steam, true)
					.addField("Discord", beamInfo.user.social.discord, true)
                message.channel.sendEmbed(beamStuff)
            }
            else{
                message.reply("error finding that streamer, are you sure that was the correct name?")
            }
        });
    }
    if (message.content == prefix+"mystreamers") {
        message.delete(1000)
        const streamerFolder = './users/';
        const fs = require('fs');
        var chatID = message.channel.id;
        fs.readdir(streamerFolder, (err, files) => {
            files.forEach(file => {
                var files = file
            });
            var fileCount = files.length
            var myStreamers = "Current Streamer List:\n"
            for (i = 0; i < fileCount; i++) {
                var serverList = fs.readFileSync("./users/" + files[i])
                if (serverList.includes(chatID)) {
                  var name = files[i].replace(".txt", "")
                  var myStreamers = myStreamers + name + "\n"
                }
            }
            message.channel.sendMessage(myStreamers)
        })
}
        if (message.content.startsWith(prefix + 'queue')) {
            let queue = getQueue(message.guild.id);
            if (queue.length == 0) return message.channel.sendMessage("No music in queue");
            let text = '';
            for (let i = 0; i < queue.length; i++) {
                text += `${(i + 1)}. ${queue[i].title} | requested by ${queue[i].requested}\n`
            };
            message.channel.sendMessage(`${rb}xl\n${text}${rb}`);
        }
    } catch (err) {
        console.log("WELL LADS LOOKS LIKE SOMETHING WENT WRONG! Visit MusicBot server for support (https://discord.gg/EX642f8) and quote this error:\n\n\n" + err.stack)
        errorlog[String(Object.keys(errorlog).length)] = {
            "code": err.code,
            "error": err,
            "stack": err.stack
        }
        fs.writeFile("./data/errors.json", JSON.stringify(errorlog), function(err) {
            if (err) return console.log("Even worse we couldn't write to our error log file! Make sure data/errors.json still exists!");
        })

    }
})

bot.on('ready', function() {
	setInterval(() => {
        fs.readFile('./status.txt', 'utf8', function(err, data) {
        var games = data.toString().split('\n')
        bot.user.setGame(games[Math.floor(Math.random()* games.length)]+ ' | Bot Prefix ' +prefix+' | '+bot.guilds.size+' Connected Servers','https://twitch.tv/'+twitchusername, function(err) {
        console.log(games)
            if (err) {
                message.channel.sendMessage("ERROR has be MADE!" + err);
            }
       });
    });
}, 120000)
});

//bot.on('ready', function() {
//    setInterval(() => {
//        request("https://api.twitch.tv/kraken/streams/"+suffix+"?client_id="+twitchkey,
//            function(err,res,body){
//                if(err) {
//                    console.log('Error encounterd: '+err);
//                    message.channel.sendMessage("Horrible stuff happend D:. Try again later.");
//                    return;
//        }
//        var stream = JSON.parse(body);
//                if(stream.stream){
//                    bot.user.setGame(twitchusername + 'IS NOW LIVE! come and check him out!','https://twitch.tv/'+twitchusername);
//                } else {
//      if(stream.stream == null){
//        fs.readFile('./status.txt', 'utf8', function(err, data) {
//        var games = data.toString().split('\n')
//        bot.user.setGame(games[Math.floor(Math.random()* games.length)]+ ' | Bot Prefix ' +prefix+' | '+bot.guilds.size+' Connected Servers','https://twitch.tv/'+twitchusername, function(err) {
//        console.log(games)
//            if (err) {
//                message.channel.sendMessage("ERROR has be MADE!" + err);
//            }
//	}
//       });
//    });
//}, 1000)
//});

bot.login("MjM5MzIzMjU1OTMwODgwMDAw.C9oUhQ.QINA_efuEMcSucgcjS3gsTwAsvY")

// START Roboto SETUP
app.get('/', function(req, res){ res.send(markdown.toHTML("Running DiscordBot\nNode version: " + process.version + "\nDiscord.js version: " + Discord.version)); });
app.get('/prefix', function(req, res){ res.send(markdown.toHTML("Bot Prefix "+prefix )); });
app.get('/invite', function(req, res){ res.send(markdown.toHTML("Bot Invite "+invite )); });
app.get('/stats', function(req, res){ res.send(markdown.toHTML(`is in ${bot.channels.size} channels on ${bot.guilds.size} servers, for a total of ${bot.users.size} users.` )); });
app.get('/guilds', function(req, res){ res.send("is in "+ bot.guilds.array().length +" Servers "); });
app.get('/date', function(req, res){ res.send("Date is "+ started +""); });
app.get('/uptime', function(req, res){ res.send("Has Been Up For "+ started +""); });
app.get('/specs', function(req, res){ res.send("xl\nSystem info: " + process.platform + "-" + process.arch + " with " + process.release.name + " version " + process.version.slice(1) + "\nProcess info: PID " + process.pid + " at " + process.cwd() + "\nProcess memory usage: " + Math.ceil(process.memoryUsage().heapTotal / 1000000) + " MB\nSystem memory usage: " + Math.ceil((os.totalmem() - os.freemem()) / 1000000) + " of " + Math.ceil(os.totalmem() / 1000000) + " MB\nBot info: ID " + bot.user.id + " #" + bot.user.discriminator + "\n") });

app.listen(process.env.PORT || + serverport);
// END Roboto SETUP

process.on("unhandledRejection", err => {
    console.error("Uncaught We had a promise error, if this keeps happening report to dev server (https://discord.gg/EX642f8): \n" + err.stack);
});
