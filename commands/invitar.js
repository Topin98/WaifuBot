exports.run = (client, message, args, sql) => {

    if (args.length == 1){

        message.guild.channels.get(message.channel.id).createInvite().then(invite =>
            client.users.get(args[0]).send(invite.url)
        );
        
    } else {
        message.channel.send("Formato no válido");
    }
}