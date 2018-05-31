exports.run = (client, message, args, sql) => {

    var mensaje = "";

    //el parse int es por si pone ";dab texto" no sale error en app.js
    if (args.length != 0 && parseInt(args[0])){

        if (args[0] <= 500){
            for (var i = 0; i < args[0]; i++){
                mensaje += "/O/ ";
            }

            message.channel.send(mensaje);

        } else {

            message.channel.send("Demasiado dab man");

        }
    }
}