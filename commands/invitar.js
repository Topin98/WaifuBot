//invita a un usuario al guild (el bot manda por md la invitacion)
exports.run = (client, message, args, sql) => {

    //el unico argumento va a ser el ID del usuario al que se va a invitar
    if (args.length == 1){

        message.guild.channels.get(message.channel.id).createInvite().then(invite =>
            client.users.get(args[0]).send(invite.url)
        );
        
    } else {
        message.channel.send("Formato no válido");
    }
}