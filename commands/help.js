const Discord = require("discord.js");
const separacion = "----------------------------------------------------------------------"; //70 (sry)

exports.run = (client, message, args, sql) => {

    var embed = new Discord.RichEmbed()
        .addField(separacion, "**lol** *summoner_name* (Muestra la información de un invocador)")
        .addField(separacion, "**lolelo** *summoner_name* (Muestra los elos de un invocador)")
        .addField(separacion, "**lolchamp** *summoner_name* (Muestra el main de un invocador)")
        .addField(separacion, "**points** (Muestra los puntos y tu nivel actual)")
        .addField(separacion, "**caida** [*compadre*] (Indica dónde tienes que caer)")
        .addField(separacion, "**dab** *numero* (Escribe un determinado número de dabs)")
        .addField(separacion, "**tamanio** (Hace spam de la aplicación de mierda de <@368721145806979072>)");

    var mensaje = "**music** \n\t" +
    "[] (Muestra todas las canciones o inicializa las tablas si aun no existen)" +
    "\n\t[*new link*] (Añade una canción)" +
    "\n\t[*search filtro*] (Busca canciones que su titulo o autor contengan el texto introducido)" +
    "\n\t[*join*] (El bot se conecta al canal de voz en el que estés)" + 
    "\n\t[*leave*] (El bot se desconecta del canal de voz (es necesario que estes conectando al canal))" +
    "\n\t[*play*] (El bot se conecta al canal de voz en el que estés y reproduce las canciones guardadas previamente)" +
    "\n\t[*play link*] (El bot se conecta al canal de voz en el que estés y reproduce el link)";
    
    embed.addField(separacion, mensaje);
    embed.addField(separacion, "GL descubriendo los easter eggs");

    message.channel.send({embed});
}