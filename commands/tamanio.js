exports.run = (client, message, args, sql) => {

        message.channel.send({files: [
            "./files/tamanio.exe"
        ]}).catch(function(){
            console.log("ERROR: El archivo especificado no existe");
        });
}