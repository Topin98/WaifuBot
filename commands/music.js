//-------------------------------------------------------------------------------------------------
//        .==.        .==.          
//       //`^\\      //^`\\         
//      // ^ ^\(\__/)/^ ^^\\        
//     //^ ^^ ^/6  6\ ^^ ^ \\       
//    //^ ^^ ^/( .. )\^ ^ ^ \\      
//   // ^^ ^/\| v""v |/\^ ^ ^\\     
//  // ^^/\/ /  `~~`  \ \/\^ ^\\    
//  -----------------------------
/// ###HERE BE DRAGONS###
//  -----------------------------
//TODO: IMPORTANTE: Se requiere usar el comando "music" antes de empezar a usar el resto de comandos
//para que las tabla music y musica se creen
//-------------------------------------------------------------------------------------------------

const Discord = require("discord.js");
const config = require("../config.json");
const yt = require('ytdl-core');
var Song = require("../entities/Song.js");
const admins = ["285046427237744642", "446968489778085889"];
const errorPermisos = "No tiene permisos para realizar esta acción";

exports.run = (client, message, args, sql) => {

        //como no se puede comparar directamente con case null, lo pasamos a String para que coja el valor "undefined"
        switch(String(args[0])){
            case "add": 
                if (isRoot(message.author.id)) anyadirCancion(message, args, sql);
                else message.channel.send(errorPermisos);
                break;
            case "delete": 
                if (isRoot(message.author.id)) eliminarCancion(message, args, sql);
                else message.channel.send(errorPermisos);
                break;
            case "new":  proponerCancion(message, args, sql);
                break;
            case "search": buscarCanciones(message, args, sql);
                break;
            case "undefined": obtenerCanciones(message, args, sql);
                break;
            case "play": reproducirCanciones(message, args, sql);
                break;
            case "stop": //estos dos aqui no hacen nada, los almacena el collector
            case "skip": //(estan aqui para que no se muestre el mensaje de que el comando no existe)
                break;
            default: message.channel.send("Ese comando no existe");
                break;
        }
}

function isRoot(id){
    //si esta devuelve true, si no devuelve false
    return admins.indexOf(id) != -1;
}

function anyadirCancion(message, args, sql){

    //length de 4 (add, link, titulo, autor)
    if (args.length == 4){

        yt.getInfo(args[1], (err, info) => {
            //si el link es valido
            if(!err) {

                //insertamos la cancion
                sql.run("INSERT INTO music (link, titulo, autor) VALUES (?, ?, ?)", [args[1],  generarTitulo(args[2]),  generarAutor(args[3])]).then(() => {

                    message.channel.send("Se ha insertado la canción");
                
                }).catch(error => {
                    message.channel.send("Esa canción ya se encuentra en la base de datos");
                });
        
            } else {
                message.channel.send("El link no es válido, no se ha insertado la canción");
            }
		});
        //si no es que el formato no es correcto
    } else {
        message.channel.send("El formato no es correcto, no se ha insertado la canción");
    }
}

function proponerCancion(message, args, sql){

    //length de 2 (new, link)
    if (args.length == 2){

        yt.getInfo(args[1], (err, info) => {
            //si el link es valido
            if(!err) {

                //insertamos la cancion
                sql.run("INSERT INTO musica (link) VALUES (?)", [args[1]]).then(() => {

                    message.channel.send("Se ha insertado la canción");
                
                }).catch(error => {
                    message.channel.send("Esa canción ya se encuentra en la base de datos");
                });
        
            } else {
                message.channel.send("El link no es válido, no se ha insertado la canción");
            }
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

    //quitamos el espacio en blanco del principio
    return autor.substring(1);
}

function isUpper(letra) {
    return (letra === letra.toUpperCase()) && (letra !== letra.toLowerCase());
}

function eliminarCancion(message, args, sql){

    //length de 2 (delete, link)
    if (args.length == 2){

        sql.run("DELETE FROM music WHERE link = (?)", [args[1]]).then((data) => {

            sql.run("DELETE FROM musica WHERE link = (?)", [args[1]]).then((data2) => {
            
                //data.changes devuelve el numero de filas eliminadas
                if (data.changes == 1 || data2.changes == 1){
                    message.channel.send("Se ha eliminado la canción");
                } else {
                    message.channel.send("Esa canción no se encuentra en la base de datos");
                }
                
            });
            
        });

        //si no es que el formato no es correcto
    } else {
        message.channel.send("El formato no es correcto, no se ha eliminado la canción");
    }
}

function buscarCanciones(message, args, sql){

    //borramos desde la posicion 0 un elemento (se borraria la palabra search)
    //args.splice(0,1);

    //quita el primer elemento del array (mejor usar esta forma)
    args.shift();

    var filtro = "%" + args.join(" ") + "%";
    sql.all("SELECT link, titulo, autor FROM music WHERE titulo LIKE ? OR autor LIKE ?", [filtro, filtro]).then(function(rows){

        if (rows.length != 0) mostrarCanciones(message, rows, null);
        else message.channel.send("No se han encontrado canciones en la base de datos");

    }).catch(function(err){
        message.channel.send("Se ha producido un error cargando las canciones");
    });
}

function obtenerCanciones(message, args, sql){

    sql.all("SELECT link, titulo, autor FROM music").then(function(rows){

        sql.all("SELECT link FROM musica").then(function(rows2){

            if (rows.length == 0 && rows2.length == 0) message.channel.send("No se han encontrado canciones en la base de datos");
            else mostrarCanciones(message, rows, rows2);
        });
    
    }).catch(function(err){

        //si no hay base de datos la creamos y mostramos mensaje de que esta vacia
        sql.run("CREATE TABLE IF NOT EXISTS music (link TEXT PRIMARY KEY, titulo TEXT, autor TEXT)");
        sql.run("CREATE TABLE IF NOT EXISTS musica (link TEXT PRIMARY KEY)");

        message.channel.send("Las tablas se acaban de crear por lo que no contienen ninguna canción");
    });
}

function mostrarCanciones(message, rows, rows2){

    var embed = new Discord.RichEmbed();

    rows.forEach(function (row) {
        embed.addField(row.titulo + " (" + row.autor + ")", row.link);
    });

    //si hay canciones propuestas
    if (rows2 != null && rows2.length != 0){

        embed.addBlankField();

        var mensaje = "";
        rows2.forEach(function (row) {
            mensaje += row.link + "\n";
        });

        embed.addField("Otras canciones", mensaje);
    }

    message.channel.send({embed});
}

function meterseCanal(message){
    return new Promise((resolve, reject) => {
        const voiceChannel = message.member.voiceChannel;

        if (!voiceChannel || voiceChannel.type !== 'voice'){ 
            message.channel.send("No me he podido conectar al chat de voz");
        } else {
            voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
        }
    });
}

function salirseCanal(message){
    const voiceChannel = message.member.voiceChannel;

    if (!voiceChannel || voiceChannel.type !== 'voice'){ 
        message.channel.send("No me he podido salir del chat de voz");
    } else {
        message.member.voiceChannel.leave();   
    }
}

function reproducirCanciones(message, args, sql){

    //si el bot no esta metido en el canal se mete en el que esta el usuario que manda el mensaje
    //(se vuelve a llamar a la funcion reproducirCanciones pero ya no entraria por este if)
    if (!message.guild.voiceConnection) {
        meterseCanal(message, args, sql).then(() => reproducirCanciones(message, args, sql));

    } else {
        //si la cancion es null es que hizo ";music play" por lo que recuperamos las canciones de la base de datos
        if (args[1] == null) {

            sql.all("SELECT link, titulo, autor FROM music").then(function(rows){

                sql.all("SELECT link FROM musica").then(function(rows2){

                    //la comprobacion de si tiene canciones la hacemos en la funcion play
                    play(message, rows.concat(rows2));
            
                }).catch(function(err){
                    message.channel.send("No se han podido cargar las canciones (2)");
                });
        
            }).catch(function(err){
                message.channel.send("No se han podido cargar las canciones");
            });

        } else {
            
            yt.getInfo(args[1], (err, info) => {

                //si el link es valido
                if(!err) {
    
                    //simula un array de tamaño 1 para reproducir la cancion
                    play(message, simularArray(args[1]));
            
                } else {
                    message.channel.send("El link no es válido, no se puede reproducir");
                    salirseCanal(message);
                }
            });
        }
    }
}

function play(message, songs) {

    if (songs.length > 0){

        message.channel.send("Reproduciendo: " + songs[0].link);

        //reproduce la cancion
        let dispatcher = message.guild.voiceConnection.playStream(yt(songs[0].link, {audioonly: true}));

        let collector = message.channel.createCollector(m => m);

        collector.on('collect', m => {

            if (m.content == config.prefix + "music skip"){
               dispatcher.end();
            } else if (m.content == config.prefix + "music stop"){
                //vaciamos el array para que acabe
                songs.length = 0;

                dispatcher.end();
            }
        });

        dispatcher.on('end', () => {
            collector.stop();
            
            //quitamos la cancion que se reprodujo
            songs.shift();

            //seguimos reproduciendo la lista
            play(message, songs);
        });

        dispatcher.on('error', (err) => {
            message.channel.send("Error: " + err).then(() => {
                collector.stop();

                //quitamos la cancion que se intento reproducir
                songs.shift();

                //seguimos reproduciendo la lista
                play(message, songs);
            });
        });

    } else {
        message.channel.send("No hay más canciones que reproducir");
        salirseCanal(message);
    }
}

function simularArray(link){

    //objeto donde se va a guardar el link de la cancion
    var song = new Song();

    //guardamos el link
    song.link = link;

    //retornamos la cancion insertandola en un array
    return [song];

}