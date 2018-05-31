exports.run = (client, message, args, sql) => {

    if (args.length != 0 && parseInt(args[0])){
        message.channel.send("<@284757403994554369> ha quitado " + args[0] + "€ a <@310347864398233601>");
    }
}