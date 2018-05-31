exports.run = (client, message, args, sql) => {

        message.channel.send({files: [
            "./prueba.txt"
        ]}).catch(function(){
            console.log("ERROR: El archivo especificado no existe");
        });
}