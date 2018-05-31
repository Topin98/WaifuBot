const Discord = require("discord.js");

exports.run = (client, message, args, sql) => {

    sql.get(`SELECT points, level FROM scores WHERE userId ="${message.author.id}"`).then(row => {

        var embed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)

        if (row) {
            embed.addField("Nivel", "Tu nivel actual es " + row.level, true)
            .addField("Puntos", "Actualmente tienes " + row.points + " puntos", true);
        } else {
            embed.addField("Nivel", "Tu nivel actual es 0", true)
            .addField("Puntos", "Actualmente tienes 0 puntos", true);
        }

        message.reply({embed});
        
    }).catch(() => {
	});
}