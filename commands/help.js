const Discord = require("discord.js");
const separacion = "--------------------------------------------------"; //50 (sry)

exports.run = (client, message, args, sql) => {

    var embed = new Discord.RichEmbed()
        .addField(separacion, "**lol** *summoner_name* (Muestra la información de un invocador)")
        .addField(separacion, "**lolelo** *summoner_name* (Muestra los elos de un invocador)")
        .addField(separacion, "**lolchamp** *summoner_name* (Muestra el main de un invocador)")
        .addField(separacion, "**points** (Muestra los puntos y tu nivel actual)")
        .addField(separacion, "**caida** [*compadre*] (Indica dónde tienes que caer)")
        .addField(separacion, "**dab** *numero* (Escribe un determinado número de dabs)")
        .addField(separacion, "**tamanio** (Hace spam de la aplicación de mierda de <@368721145806979072>)")
        .addField(separacion, "GL descubriendo los easter eggs");

    message.channel.send({embed});

}