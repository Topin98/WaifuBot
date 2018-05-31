const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");

const sql = require("sqlite");
sql.open("./score.sqlite");

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
	  
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];

	client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});

client.on("message", message => {

	//si es un bot o es un mensaje que no esta en un guild no hacemos nada
	if (message.author.bot || message.channel.type !== "text") return;

	//leemos de la base de datos la info del usuario que mando el mensaje
	sql.get(`SELECT userId, points, level FROM scores WHERE userId = "${message.author.id}"`).then(row => {

		//si hay base de datos pero no esta el usuario en ella
		if (!row) {
			//lo insertamos 
			sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);

			//si el usuario si esta en la base de datos
		} else {

			//obtenemos el nivel en el que deberia estar
			let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));

			//si el nivel en que deberia estar es mayor que el nivel que tiene
			if (curLevel > row.level) {

				//le sumamos uno a su nivel
				row.level = curLevel;
				sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
				message.reply(`Level up!. Has alcanzado el nivel **${curLevel}**!`);
			}

			//sumamos 1 a sus puntos
			sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
		}
	
	}).catch(() => {
	
		//si no hay base de datos la creamos e insertamos al usuario
		sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)").then(() => {
			sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
		});
	});

	//si no empezo con el prefijo del bot no hacemos nada mas
	if (message.content.indexOf(config.prefix) !== 0) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	try {
		let commandFile = require(`./commands/${command}.js`);
		commandFile.run(client, message, args, sql);
	} catch (err) {
		console.info("Error controlado");
		console.error(err);
		message.reply("Qué dices tonto");
	}
});

//evento que se lanza cuando se une un miembro al guild
client.on("guildMemberAdd", (member) => {
	try {
		//mandamos un mensaje por el canal general
		member.guild.channels.find("name", "general").send("Pero bueno " + member.user + " qué haces aquí compadre");
	} catch(err){
		console.log("No se ha podido mandar el mensaje. El canal \"general\" no existe");
	}
});

//evento que se lanza cuando un miembro abandona el guild
client.on("guildMemberRemove", (member) => {
	try {
		//mandamos un mensaje por el canal general
		member.guild.channels.find("name", "general").send("Rip " + member.user);
	} catch(err){
		console.log("No se ha podido mandar el mensaje. El canal \"general\" no existe");
	}
});


client.login(config.token);