exports = (menu) => {

    mp.events.add("chat.push", (playerId, text, tag, talrasha_faction, talrasha_rank) => {
        var player = mp.players.atRemoteId(playerId);
        var localId = mp.players.local.remoteId;
        if (!player && playerId !==-1) return;
        //addPlayerText3d(playerId, text);
        addPlayerChatBubble(playerId, text);
        var name = (player.isFamiliar || playerId == localId || tag == "[рация]")? player.name : "Незнакомец";
        menu.execute(`chatAPI.push('${name}', '${playerId}', '${text}', '${tag}', '${talrasha_faction}', '${talrasha_rank}')`);

        // playChatAnim(player, tag);
        //playChatSound(player, tag);
    });
    // уведомляет о поставках
    /*mp.events.add("chat.mafia.push", (text, tag) => {
        menu.execute(`chatAPI.push('Информатор', '★', '${text}', 'Рация')`);
    });*/

    mp.events.add("chat.custom.push", (text) => {
        menu.execute(`chatAPI.custom_push('${text}')`);
    });

    mp.events.add("chat.enable", (enable) => {
        menu.execute(`chatAPI.enable(${enable})`);
    });

    mp.events.add("chat.clear", (playerId) => {
        var player = mp.players.atRemoteId(playerId);
        menu.execute(`chatAPI.clear('${player.name}')`);
    });

    mp.events.add("setChatActive", (enable) => {
        mp.chatActive = enable;
    });
}

/*function playChatAnim(player, tag) {
    if (tag != "[сказать]" && tag != "[рация]") return;
    if (vdist(player.position, mp.players.local.position) > 50) return;
    if (player.vehicle) return;
    player.clearTasksImmediately();
    var anim = getAnimByChatTag(tag);
    mp.game.streaming.requestAnimDict(anim[0]);
    while (!mp.game.streaming.hasAnimDictLoaded(anim[0])) {
        mp.game.wait(0);
    }
    player.taskPlayAnim(anim[0], anim[1], 8, 0, -1, 49, 0, false, false, false);
    var playerId = player.remoteId;
    setTimeout(() => {
        try{
            var rec = mp.players.atRemoteId(playerId);
            if (rec) rec.clearTasksImmediately();
        }
        catch(e){
          //mp.trigger('events.callRemote', "testlogs", `\sCLIERR : ${JSON.stringify(e)}\n`)
        }
        
    }, 3000);
}

function getAnimByChatTag(tag) {
    var anim = ["special_ped@baygor@monologue_3@monologue_3f", "trees_can_talk_5"];
    if (tag == "[рация]") anim = ["random@arrests", "generic_radio_chatter"];
    return anim;
}

function playChatSound(player, tag) {
    if (tag != "[рация]") return;
    if (vdist(player.position, mp.players.local.position) > 20) mp.game.audio.playSoundFrontend(-1, "Off_High", "MP_RADIO_SFX", true);
}

mp.events.add("chat.playRadio", (playerId) => {
    var player = mp.players.atRemoteId(playerId);
    if (!player) return;
    if (vdist(player.position, mp.players.local.position) > 20) return;
    mp.game.audio.playSoundFromEntity(1488, "End_Squelch", player.handle, "CB_RADIO_SFX", false, 0);
    playChatAnim(player, "[рация]");
});*/
