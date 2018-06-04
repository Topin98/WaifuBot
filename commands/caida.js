exports.run = (client, message, args, sql) => {

    const sitios = ["Picos picados", "Carretes comprometidos", "Zonas lúgubres", 
    "Charca chorreante", "Donde el meteorito",
    "Grieta del invocador", "Acres anárquicos", "Latifundio letal"];

    try {

        switch(String(args[0]).toLowerCase()){
            case "topin":
                message.channel.send("Estará jugando al lol dudo que esté en la partida");
                break;
            case "acebal": 
                message.channel.send("Da igual si se va a poner a bailar y a hacer dabs");
                break;
            case "armi":
                message.channel.send("Armando no puede estar en la partida su router murió hace años");
                break;
            case "mykyta":
                message.channel.send("Da igual mykyta te va a carrilear");
                break;
            case "tpm":
                message.channel.send("ltpqnl acebal puedes parar de decir eso en algún momento de tu vida");
                break;
            case "kosmos":
                message.channel.send("Ord... No se han encontrado registros de ese jugador");
                break;
            default: throw new Error();
        }

    } catch(err){
        message.channel.send(sitios[Math.floor(Math.random() * sitios.length)]); //Math.floor trunca el numero resultante
    }
}