/*manda mensajes directos a un usuario*/

const plantilla = "Alguien ha querido mandarte un mensaje de forma anónima!:\n";
exports.run = (client, message, args, sql) => {

    //quita el primer elemento del array (a quien va dirigido el mensaje)
    var idDestino = args.shift();

    //montamos el mensaje
    var mensaje = args.join(" ");

    //el trim realmente esta por estar
    client.users.get(idDestino).send(plantilla + mensaje.trim());//("IDUsuario al que quieres mandar el mensaje")("Texto del mensaje")

    message.channel.send("Se ha mandado el mensaje a " + client.users.get(idDestino));

    //debug
    //aunque en verdad esto mejor asi para que la gente no se venga arriba mandando cosas que no deberia sinkin
    console.log(message.author.username + " (" + message.author.id + ") ha enviado a " + client.users.get(idDestino).username + " (" + idDestino + ") el mensaje:\n" + mensaje);
}