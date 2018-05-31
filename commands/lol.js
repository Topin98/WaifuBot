const Discord = require("discord.js");
const config = require("../config.json");
const RiotRequest = require('riot-lol-api');
const riotRequest = new RiotRequest(config.apilol);
var Summoner = require("../entities/Summoner.js");

const qSolo = "RANKED_SOLO_5x5";
const qFlex = "RANKED_FLEX_SR";
const q3v3 = "RANKED_FLEX_TT";
const queues = [qSolo, qFlex, q3v3];

//objeto donde se van ir guardando todos los valores del invocador
var summoner = new Summoner();

exports.run = (client, message, args, sql) => {

    if (args.length != 0){

        var invocador = args.join(" ");

        try
        {
            //obtenemos invocador a partir de su nombre
            riotRequest.request('euw1', 'summoner', '/lol/summoner/v3/summoners/by-name/' + invocador, function(err, data) {

                //si se encontro el invocador
                if (data.id != null){

                    summoner.id = data.id;
                    summoner.name = data.name;
                    summoner.iconId = data.profileIconId;
                    summoner.level = data.summonerLevel;

                    //obtenemos el elo a partir del id del invocador
                    riotRequest.request('euw1', 'league', '/lol/league/v3/positions/by-summoner/' + data.id, function(err, data) {

                        //array que va a contener arrays ["nombre de la queue", "tier", "rank"]
                        var info = [];

                        //recorremos las tres queus
                        queues.forEach(function(queue){

                            //obtenemos la queue
                            var cola = data.find(x => x.queueType == queue);

                            //si no es null es que esta rankeada
                            if (cola != null){
                                
                                //bronce, plata, oro...
                                var tier = cola.tier;

                                //V, IV, III...
                                var rank = cola.rank;

                                //lps
                                var lps = cola.leaguePoints;

                                //array que se insertara al array padre
                                var aux = [queue, tier, rank, lps];

                            } else {
                                //si no rankeo en la queue (una posicion sin - para que quede mejor el embed)
                                var aux = [queue, "-", "", "-"];
                            
                            }

                            info.push(aux);
                        });

                        //pasamos los datos al objeto ya formateados
                        summoner.soloq = info[0][1] + " " + info[0][2] + " (" + info[0][3] + ")";
                        summoner.flex = info[1][1] + " " + info[1][2] + " (" + info[1][3] + ")";
                        summoner.q3v3 = info[2][1] + " " + info[2][2] + " (" + info[2][3] + ")";

                        //obtenemos los champs con los que juega a partir del id del invocador
                        riotRequest.request('euw1', 'champion-mastery', '/lol/champion-mastery/v3/champion-masteries/by-summoner/' + summoner.id, function(err, data) {

                            //puntos con el champ
                            summoner.champPoints = data[0].championPoints;

                            //obtenemos la informacion del champ con el que mas puntos tiene a partir del id del champ
                            riotRequest.request('euw1', 'lol-static-data', '/lol/static-data/v3/champions/' + data[0].championId, function(err, data){

                                //nombre del campeon (luego se comprobara si se pudo o no cargar)
                                summoner.champ = data.name;
                            });

                            //al segundo y medio se muestra el mensaje
                            setTimeout(mostrarInformacion, 1500, message);
                        });
                    });

                    //si no es que no se encontro el invocador
                } else {
                    message.channel.send("No se ha podido encontrar el invocador");
                }
            });

        } catch (err){
            message.channel.send("No se ha podido obtener la información del invocador");
        }

    } else {
        message.channel.send("Introduzca un invocador");
    }
}

function mostrarInformacion(message){

    var embed = new Discord.RichEmbed()
        .setAuthor(summoner.name, "http://ddragon.leagueoflegends.com/cdn/8.11.1/img/profileicon/" + summoner.iconId + ".png")
        .addField("Nivel", summoner.level, true)
        .addField("Main", (summoner.champ != null ? summoner.champ : "Error") + " (" + summoner.champPoints + ")", true)
        .addBlankField()
        .addField("Soloq", summoner.soloq, true)
        .addField("Flex", summoner.flex, true)
        .addField("3v3", summoner.q3v3, true);

    message.reply({embed});
}