//evento que se lanza cuando un miembro se une al guild
exports.run = (client, member) => {
	try {
		//mandamos un mensaje por el canal general
		member.guild.channels.find("name", "general").send("Pero bueno " + member.user + " qué haces aquí compadre");
	} catch(err){
		console.log("No se ha podido mandar el mensaje. El canal \"general\" no existe");
	}
}