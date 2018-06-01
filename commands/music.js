//-------------------------------------------------------------------------------------------------
//TODO: IMPORTANTE: Se requiere usar el comando "music" antes de empezar a usar la base de datos
//para que la tabla music se cree
//-------------------------------------------------------------------------------------------------

const Discord = require("discord.js");

exports.run = (client, message, args, sql) => {

    //como no se puede comparar directamente con case null, lo pasamos a String para que coja el valor "undefined"
    switch(String(args[0])){
        case "add": anyadirCancion(message, args, sql);
            break;
        case "delete": eliminarCancion(message, args, sql);
            break;
        case "undefined": obtenerCanciones(message, args, sql);
            break;
        default: message.channel.send("Ese comando no existe");
            break;
    }
    
}

function anyadirCancion(message, args, sql){

    //length de 4 (add, link, titulo, autor)
    if (args.length == 4){

        sql.run("INSERT INTO music (link, titulo, autor) VALUES (?, ?, ?)", [args[1],  generarTitulo(args[2]),  generarAutor(args[3])]).then(() => {

            message.channel.send("Se ha insertado la canción");
            
        }).catch(error => {
            message.channel.send("Esa canción ya se encuentra en la base de datos");
        });

        //si no es que el formato no es correcto
    } else {
        message.channel.send("El formato no es correcto, no se ha insertado la canción");
    }
}

function generarTitulo(cadena){

    var titulo = "";

    for (var i = 0; i < cadena.length; i++) {
        //si la letra es mayuscula añadimos un espacio
        if (isUpper(cadena.charAt(i))) titulo += " "
        
        //añadimos la letra
        titulo += cadena.charAt(i);
    }

    //quitmaos el espacio en blanco del principio
    return titulo.substring(1);

}

function generarAutor(cadena){

    var autor = "";

    for (var i = 0; i < cadena.length; i++) {
        //si la letra es mayuscula añadimos un espacio
        if (isUpper(cadena.charAt(i))) autor += " "
        
        //añadimos la letra
        autor += cadena.charAt(i);
    }

    //quitmaos el espacio en blanco del principio
    return autor.substring(1);
}

function isUpper(letra) {
    return (letra === letra.toUpperCase()) && (letra !== letra.toLowerCase());
}

function eliminarCancion(message, args, sql){

    //length de 2 (delete, link)
    if (args.length == 2){

        sql.run("DELETE FROM music WHERE link = (?)", [args[1]]).then((data) => {

            //data.changes devuelve el numero de filas eliminadas
            if (data.changes == 1){
                message.channel.send("Se ha eliminado la canción");
            } else {
                message.channel.send("Esa canción no se encuentra en la base de datos");
            }
            
        });

        //si no es que el formato no es correcto
    } else {
        message.channel.send("El formato no es correcto, no se ha eliminado la canción");
    }
}

function obtenerCanciones(message, args, sql){

    //leemos de la base de datos la info del usuario que mando el mensaje
    sql.all("SELECT link, titulo, autor FROM music").then(function(rows){

        if (rows.length != 0) mostrarCanciones(message, rows);
        else message.channel.send("No se han encontrado canciones en la base de datos");

    }).catch(function(err){

        //si no hay base de datos la creamos y mostramos mensaje de que esta vacia
        sql.run("CREATE TABLE IF NOT EXISTS music (link TEXT PRIMARY KEY, titulo TEXT, autor TEXT)");

        message.channel.send("La tabla se acaba de crear por lo que no contiene ninguna canción");
    });
}

function mostrarCanciones(message, rows){

    var embed = new Discord.RichEmbed();

    rows.forEach(function (row) {
        embed.addField(row.titulo + " (" + row.autor + ")", row.link);
    });

    message.channel.send({embed});
}