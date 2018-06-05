const Discord = require("discord.js");
const config = require("../config.json");
const https = require('https');

exports.run = (client, message, args, sql) => {

    var name = args.join(" ");

    //si se introdujo un nombre
    if (name != "") {

        var options = {
            host: 'api.fortnitetracker.com',
            path: '/v1/profile/pc/' + encodeURIComponent(name),
            method: 'GET',
            headers: { 'TRN-Api-Key': config.api49 }
        };

        var req = https.request(options, function(res){
            var body = "";

            res.on('data', function(data){
                body += data;
            });

            res.on('end', end => {
                body = JSON.parse(body);
    
                //si encuentra el jugador
                if(!body.error){
        
                    var embed = new Discord.RichEmbed()
                        .setAuthor(body["epicUserHandle"] + " (" + body["platformName"].toUpperCase() + ")")
                        .addField(body.lifeTimeStats[8]["key"], body.lifeTimeStats[8]["value"], true)
                        .addField(body.lifeTimeStats[7]["key"], body.lifeTimeStats[7]["value"], true)
                        .addField(body.lifeTimeStats[9]["key"], body.lifeTimeStats[9]["value"], true)
                        .addBlankField()
                        .addField(body.lifeTimeStats[6]["key"], body.lifeTimeStats[6]["value"], true)
                        .addField(body.lifeTimeStats[10]["key"], body.lifeTimeStats[10]["value"], true)
                        .addField(body.lifeTimeStats[11]["key"], body.lifeTimeStats[11]["value"], true)
                        .addBlankField()
                        .addField(body.lifeTimeStats[0]["key"], body.lifeTimeStats[0]["value"], true)
                        .addField(body.lifeTimeStats[1]["key"], body.lifeTimeStats[1]["value"], true)
                        .addField(body.lifeTimeStats[2]["key"], body.lifeTimeStats[2]["value"], true)
                        .addBlankField()
                        .addField(body.lifeTimeStats[3]["key"], body.lifeTimeStats[3]["value"], true)
                        .addField(body.lifeTimeStats[4]["key"], body.lifeTimeStats[4]["value"], true)
                        .addField(body.lifeTimeStats[5]["key"], body.lifeTimeStats[5]["value"], true)
                        .setColor(9955331)
        
                    message.channel.send(embed);

                    //si no encuentra el jugador
                } else {
                    message.channel.send("Jugador no encontrado");
                }
            });
        });
    
        req.end();

        //si no es que no se introdujo un nombre
    } else {
        message.channel.send("Introduzca un nombre");
    }
}