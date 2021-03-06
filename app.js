//#################################################################################
//---------------------------------------------------------------------------------
//"I am not responsible of this code. They made me write it, against my will."
//
//
//    ROFL:ROFL:LOL:ROFL:ROFL
//        ______/|\____
//  L    /          [] \
// LOL===_      ROFL    \_
//  L     \_______________]
//            I      I
//       /---------------/
//---------------------------------------------------------------------------------
//#################################################################################

const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");

const sql = require("sqlite");
sql.open("./files/databases.sqlite");

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
	  
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];

	client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});

client.on("message", message => {

	//si es un bot no hacemos nada
	if (message.author.bot) return;

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

	//el bot siempre escucha lo que dices...
	comprobarMensaje(message);

	//si no empezo con el prefijo del bot no hacemos nada mas
	if (message.content.indexOf(config.prefix) !== 0) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	var ruta; //directorio donde se va a buscar el script del comando

	//si el mensaje esta en un guild
	if (message.channel.type === "text"){
		
		ruta = "commands";

		//si no es que lo mando por md
	} else {
		ruta = "privateCommands";
	}

	try {
		//ejecutamos el script de enviarMd
		let commandFile = require(`./${ruta}/${command}.js`);
		commandFile.run(client, message, args, sql);

	} catch (err) {
		console.info("Error controlado");
		console.error(err);
		message.reply("Qué dices tonto");
	}
});

function comprobarMensaje(message){
	switch(message.content.toLowerCase()){
		case "si": 
		case "no":
			message.reply(" frio");
			break;
	}
}

client.login(config.token);