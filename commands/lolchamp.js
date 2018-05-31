const config = require("../config.json");
const RiotRequest = require('riot-lol-api');
const riotRequest = new RiotRequest(config.apilol);

//se define aqui porque si se declara en el exports.run y se pasa como parametro siempre va a mostrar el mensaje de error
var error = true;

exports.run = (client, message, args, sql) => {

    if (args.length != 0){

        var invocador = args.join(" ");

        //obtenemos invocador a partir de su nombre
        riotRequest.request('euw1', 'summoner', '/lol/summoner/v3/summoners/by-name/' + invocador, function(err, data) {

            //si se encontro el invocador
            if (data.id != null){

                //obtenemos los champs con los que juega a partir del id del invocador
                riotRequest.request('euw1', 'champion-mastery', '/lol/champion-mastery/v3/champion-masteries/by-summoner/' + data.id, function(err, data) {

                    //obtenemos la informacion del champ con el que mas puntos tiene a partir del id del champ
                    riotRequest.request('euw1', 'lol-static-data', '/lol/static-data/v3/champions/' + data[0].championId, function(err, data){

                        //indicamos que todo fue bien
                        error = false;

                        comprobarChamp(message, data.name);
                    });

                    //si en 3 segundos no se recibio respuesta mostramos mensaje de error
                    setTimeout(mensajeError, 1500, message, "Se ha superado el número máximo de consultas. Inténtelo de nuevo más tarde.");

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

function comprobarChamp(message, champ){

    switch(champ){
        case "Vayne": enviarMensaje(message, "\"Gosu mechonix\" (Vayne)");
            break;
        case "Thresh": enviarMensaje(message, "\"Roses are red, violets are blue, la moneda es una mierda comprar el puto targon\" (Thresh)");
            break;
        case "Yasuo": enviarMensaje(message, "\"Ya me mainea no os cebeis con él que ya tiene bastante con ser subnormal\" (Yasuo)");
            break;
        case "Zed": enviarMensaje(message, "\"Cabezazo al teclado v1\" (Zed)");
            break;
        case "Rengar": enviarMensaje(message, "\"Cabezazo al teclado v2\" (Zed)");
            break;
        case "Katarina": enviarMensaje(message, "\"Cabezazo al teclado v3\" (Katarina)");
            break;
        case "Ivern": enviarMensaje(message, "\"Soy una planta churcia\" (Ivern)");
            break;
        case "Maokai": enviarMensaje(message, "\"Soy un árbol churcio\" (Lmaokai)");
            break;
        case "Corki": enviarMensaje(message, "\"El cheto oculto #1\" (Corki)");
            break;
        case "Shyvana": enviarMensaje(message, "\"El cheto oculto #2\" (Shyvana)");
            break;
        case "Darius": enviarMensaje(message, "\"Mira mamá sin manos #1\" (Darius)");
            break;
        case "Garen": enviarMensaje(message, "\"Mira mamá sin manos #2\" (Garen)");
            break;
        case "Dr. Mundo": enviarMensaje(message, "\"Mira mamá sin manos #3\" (Dr. Mundo)");
            break; 
        case "Nasus": enviarMensaje(message, "\"Mira mamá sin manos #4\" (Nasus)");
            break;
        case "Cho'Gath": enviarMensaje(message, "\"Mira mamá sin manos #5\" (Cho'Gath)");
            break;
        case "Master Yi": enviarMensaje(message, "\"Mira mamá sin manos #6 *Pentakill*\" (Master Yi)");
            break; 
        case "Malphite": enviarMensaje(message, "\"Soy una roca churcia\" (Malphite)");
            break;
        case "Nunu": enviarMensaje(message, "\"No, en serio, para cuando un rework?\" (Nunu)");
            break;
        case "Gnar": enviarMensaje(message, "\"Pickearme que así no prdeis jaja #chistaco\" (Gnar)");
            break;
        case "Kalista": enviarMensaje(message, "\"Kalista en 2k18 lmao\" (Kalista)");
            break;
        case "Twisted Fate": enviarMensaje(message, "\"Se cree bueno por mainearme\" (Twisted Fate)");
            break;
        case "Udyr": enviarMensaje(message, "\"LATA BITCH\" (Udyr)");
            break;
        case "Singed": enviarMensaje(message, "\"AUTISMOOOOO\" (Singed)");
            break;
        case "Blitzcrank": enviarMensaje(message, "\"Thresh versión useless\" (Blitzcrank)");
            break;
        case "Gragas": enviarMensaje(message, "\"Gurdooooo\" (Gragas)");
            break;
        case "Vi": enviarMensaje(message, "\"6\" (Vi)");
            break;
        default: enviarMensaje(message, "\"Ese champ no lo juega ni dios compadre\" (wtf pusiste tio)");
            break;
    }
}

function enviarMensaje(message, mensaje){
    message.channel.send(mensaje)
}

function mensajeError(message, mensaje){
    //si hubo un error mostramos mensaje
    if (error) message.channel.send(mensaje);
}