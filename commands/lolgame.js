const config = require("../config.json");
const RiotRequest = require('riot-lol-api');
const riotRequest = new RiotRequest(config.apilol);

exports.run = (client, message, args, sql) => {

    /*if (args.length != 0){

        var invocador = args.join(" ");

        //obtenemos invocador a partir de su nombre
        riotRequest.request('euw1', 'summoner', '/lol/summoner/v3/summoners/by-name/' + invocador, function(err, data) {

            //obtenemos los champs con los que juega a partir del id del invocador
            riotRequest.request('euw1', 'spectator', '/lol/spectator/v3/active-games/by-summoner/' + data.id, function(err, data) {
                console.log(data);
            });
        });

    } else {
        message.channel.send("Introduzca un invocador");
    }*/

    message.channel.send("Not yet implemented");
}