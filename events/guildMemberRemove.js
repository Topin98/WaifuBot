//evento que se lanza cuando un miembro abandona el guild
exports.run = (client, member) => {
	try {
		//mandamos un mensaje por el canal general
		member.guild.channels.find("name", "general").send("Rip " + member.user);
	} catch(err){
		console.log("No se ha podido mandar el mensaje. El canal \"general\" no existe");
    }
}