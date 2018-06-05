//evento que se lanza se actualiza el estado de un canal de voz
//el evento se produce al meterse/salirse alguien o mutearse/desmutearse
exports.run = (client, oldMember, newMember) => {

    let newUserChannel = newMember.voiceChannel;
    let oldUserChannel = oldMember.voiceChannel;

    try {

        //si alguien se mete en el canal de voz
        if(oldUserChannel === undefined && newUserChannel !== undefined) {
            //mandamos un mensaje por el canal general
            newMember.guild.channels.find("name", "general").send(newMember.user + " di argooo");
            
            //si alguien abandona el canal de voz
        } else if(newUserChannel === undefined){
            //mandamos un mensaje por el canal general
            newMember.guild.channels.find("name", "general").send(newMember.user + " se fue uwu");

            //si alguien se mutea
        } else if (oldMember.selfMute === false && newMember.selfMute === true) {
            //mandamos un mensaje por el canal general
            newMember.guild.channels.find("name", "general").send(newMember.user + " se fue a cagar");

            //si alguien se desmutea
        } else if (oldMember.selfMute === true && newMember.selfMute === false) {
            //mandamos un mensaje por el canal general
            newMember.guild.channels.find("name", "general").send(newMember.user + " volvió yayyy");
        }

    } catch (err){
        console.log("No se ha podido mandar el mensaje. El canal \"general\" no existe (voiceStateUpdate)");
    }
}