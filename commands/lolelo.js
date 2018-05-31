const config = require("../config.json");
const RiotRequest = require('riot-lol-api');
const riotRequest = new RiotRequest(config.apilol);

const qSolo = "RANKED_SOLO_5x5";
const qFlex = "RANKED_FLEX_SR";
const q3v3 = "RANKED_FLEX_TT";
const queues = [qSolo, qFlex, q3v3];

exports.run = (client, message, args, sql) => {

    if (args.length != 0){

        //array que va a contener arrays ["nombre de la queue", "tier", "rank"]
        var info = [];

        //obtenemos el nombre de invocador
        var invocador = args.join(" ");

        //obtenemos invocador a partir de su nombre
        riotRequest.request('euw1', 'summoner', '/lol/summoner/v3/summoners/by-name/' + invocador, function(err, data) {

            //si se encontro el invocador
            if (data.id != null){

                //obtenemos el elo a partir del id del invocador
                riotRequest.request('euw1', 'league', '/lol/league/v3/positions/by-summoner/' + data.id, function(err, data) {

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

                            //array que se insertara al array padre
                            var aux = [queue, tier, rank];

                        } else {
                            //si no rankeo en la queue
                            var aux = [queue, null, null];
                        
                        }

                        info.push(aux);

                    });

                    message.channel.send(comprobarDatos(info));

                });

                //si no es que no se encontro el invocador
            } else {
                message.channel.send("No se ha podido encontrar el invocador");
            }
            
        });

    } else {
        message.channel.send("Introduzca un invocador");
    }
}

function comprobarDatos(info){

    var mensaje = "Solo queue: ";

    switch(info[0][1]){
        case null: mensaje += "No ha jugado, no se quiere tiltear";
            break;
        case "BRONZE":
            mensaje += "En el pozo pero no sube por los trolls y los afk. "
            switch(info[0][2]){
                case "V": mensaje += "Espérate que además es bronce 5 pero esti chaval no tiene ni manos";
                    break;
            }
            break;
            
        case "SILVER": 
            mensaje += "Low elo frustado por no poder subir a oro. ";
            switch(info[0][2]){
                case "V": mensaje += "Tiene una pinta de boosted...";
                    break;
                case "IV": mensaje += "Si estás en plata 4 va a ser un cani por naturaleza a mi no me jodas";
                    break;
                case "III":
                case "II":
                case "I": mensaje += "Al final de la season va a intentar subir pero no lo va a conseguir";
                    break;
            }
            break;
        
        case "GOLD": mensaje += "En la media de jugadores del lol no hay mucho que decir. ";
            switch(info[0][2]){
                case "V": mensaje += "Bueno es que es un oro 5 rancio a este le ha boosteado un amigo fijo";
                    break;
            }
            break;
        
        case "PLATINUM": mensaje += "Platino de elo, diamante de corazón";
            break;
        
        case "DIAMOND": mensaje += "Ya me daría vergüenza estar en la misma liga que el millor. ";
            switch(info[0][2]){
                case "V": mensaje += "Encima diamante 5, me gustaría saber cuanto le costó la cuenta";
                    break;
            }
            break;

        case "MASTER":
        case "CHALLENGER": mensaje += "Bueno igual más o menos tiene idea de jugar";
            break;
    }

    mensaje += "\nFlex: ";

    switch(info[1][1]){
        case null: mensaje += "No ha jugado, no tiene amigos";
            break;
        case "BRONZE":
            mensaje += "Mira que es complicado eh, pues este chaval lo ha conseguido";
            break;

        case "SILVER": 
            mensaje += "No me puedo creer que no tenga ningún amigo que le suba a oro";
            break;
        
        case "GOLD": mensaje += "En la media de jugadores del lol. Nada que añadir";
            break;
        
        case "PLATINUM": mensaje += "Está feliz porque rito no le deja jugar con los platitas";
            break;
        
        case "DIAMOND": mensaje += "Diamante aquí es como oro en soloq asi que ntr. ";
            switch(info[1][2]){
                case "V": mensaje += "Encima diamante 5, me gustaría saber cuanto le pagó a sus amigos";
                    break;
            }
            break;

        case "MASTER":
        case "CHALLENGER": mensaje += "Nos vemos en gamergy cracks";
            break;
    }

    mensaje += "\n3v3: ";

    switch(info[2][1]){
        case null: mensaje += "No ha jugado, cree que el mapa no es suficiente para demostrar su skill de plata";
            break;

        case "BRONZE":
            mensaje += "En serio cómo puede estar en bronce en esta cola?";
            break;

        case "SILVER": 
            mensaje += "Low elooooo";
            break;
        
        case "GOLD": mensaje += "Se nota que quiere la recompensa el chaval";
            break;
        
        case "PLATINUM": mensaje += "Elo genérico para esta cola lmao";
            break;
        
        case "DIAMOND": mensaje += "Si es diamante aquí es que tiene una vida muy triste. ";
            switch(info[2][2]){
                case "V": mensaje += "Bueno es diamante 5 igual es solo que compró la cuenta xD";
                    break;
            }
            break;

        case "MASTER":
        case "CHALLENGER": mensaje += "Si tan buenos creéis que sois tirar pa soloq noobitas";
            break;
    }

    return mensaje;
}