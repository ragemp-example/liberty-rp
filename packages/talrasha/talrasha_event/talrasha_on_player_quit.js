const {
    deleteVehicle
} = require("../talrasha_module/talrasha_ls_custom/talrasha_ls_custom");

const {lastDateLog} = require("../talrasha_module/talrasha_ipad/talrasha_ipad");
const {characterInitOnline} = require("../talrasha_module/talrasha_ipad/talrasha_ipad");

module.exports = {
    "playerQuit": (player, exitType, reason) => {
        mp.players.forEach((rec) => {
            if (rec.sqlId) rec.call("playersOnline.delete", [player.id]);
        });
		
        if (player.vehicle && player.vehicle.player == player) delete player.vehicle.player;
        if (player.bootVehicleId != null) {
            var veh = mp.vehicles.at(player.bootVehicleId);
            if (veh) delete veh.bootPlayerId;
        }
		
		//if (!player.vehicle) return;
		let vehicle = player.vehicle
		if(vehicle){
			if(vehicle.owner > 1001){
				if (!vehicle) return player.utils.error(`Авто не найдено!`);
				var dist = player.dist(vehicle.position);
				if (dist > Config.maxInteractionDist) return player.utils.error(`Авто далеко!`);

				var pos = vehicle.position;
				pos.h = vehicle.rotation.z;
				vehicle.dimension = player.dimension;
				vehicle.utils.setSpawnPos(pos);
			}
		}
	
		if (player.enterTestVehicleInterval) clearInterval(player.enterTestVehicleInterval);
		if (player.knockDownInterval) clearInterval(player.knockDownInterval)
        savePlayerDBParams(player);
        checkPlayerCuffs(player);
        checkDemorgan(player);
        checkMute(player);
		characterInitOnline(player, 0)
		lastDateLog(player)

        if (player.sqlId) {
            mp.logs.addLog(`${player.name}[${player.id}] покинул сервер. IP: ${player.ip}`, 'main', player.account.id, player.sqlId, { socialClub: player.socialClub, ip: player.ip });
        }

        if (player.satietyTimer) clearInterval(player.satietyTimer);
        destroyPlayerCars(player);
        mp.broadcastExitFactionPlayers(player);

        if (player.vehicle) mp.setVehSpawnTimer(player.vehicle);
        if (player.admin) mp.v2_reportsUtils.unattachReports(player.sqlId);
    }
}

/* Сохранение параметров игрока. */
global.savePlayerDBParams = (player) => {
    if (!player.authTime) player.authTime = new Date().getTime();
    var unix = Math.floor(new Date() / 1000);
    if (unix >= player.vipDate) {
        var minutes = parseInt((new Date().getTime() - player.authTime) / 1000 / 60);
    } else {
        var minutes = parseInt((new Date().getTime() - player.authTime) / 1000 / 60);
    }

    let pos;

    if (player.autoSaloon == true) {
        pos = player.cancelPos;
        player.autoSaloon = false;
    } else {
        pos = player.safeQuitPosition || player.position;
    }
	
	var brpRemove = player.brpTime != 0 ? minutes : 0
    DB.Handle.query("UPDATE talrasha_character SET minutes=minutes+?,brpTime=brpTime-?,armour=?,health=?,x=?,y=?,z=?,h=? WHERE id=?",
        [minutes * 2, brpRemove, player.armour, player.health, pos.x, pos.y, pos.z, player.heading, player.sqlId]);
	
	//DB.Handle.query("UPDATE talrasha_character SET online_wheel=? WHERE id=?", [user.get(player, 'online_wheel'), player.sqlId]);
}

/* Если игрок в наручниках, то сажаем его. Если игрок в КПЗ, то отнимаем оставшийся срок. */
function checkPlayerCuffs(player) {
    if (player.hasCuffs && player.wanted) {
        var rand = mp.randomInteger(0, 2);
        player.utils.doArrest(rand, (mp.economy["wanted_arrest_time"].value / 1000) * player.wanted);
        player.utils.setWanted(0);
    } else {
        if (player.arrestTime) {
            var now = new Date().getTime() / 1000;
            var diff = now - player.startArrest;
            player.utils.setArrestTime(player.arrestTime - diff);
        }
    }
}
/* Если игрок в наручниках, то сажаем его. Если игрок в КПЗ, то отнимаем оставшийся срок. */
function checkDemorgan(player) {
    if (player.demorgan > 0) {
        var now = parseInt(new Date().getTime() / 1000);
        var diff = player.startDemorgan - now;
        DB.Handle.query("UPDATE talrasha_character SET demorgan=? WHERE id=?", [(player.demorgan + Math.ceil(diff / 60)).toFixed(0), player.sqlId]);
    }
}

function checkMute(player) {
    if (player.mute > 0) {
        var now = parseInt(new Date().getTime() / 1000);
        var diff = player.startMute - now;
        DB.Handle.query("UPDATE talrasha_character SET mute=? WHERE id=?", [(player.mute + Math.ceil(diff / 60)).toFixed(0), player.sqlId]);
    }

    if (player.vmute > 0) {
        var now = parseInt(new Date().getTime() / 1000);
        var diff = player.startVoiceMute - now;
        DB.Handle.query("UPDATE talrasha_character SET vmute=? WHERE id=?", [(player.vmute + Math.ceil(diff / 60)).toFixed(0), player.sqlId]);
    }
}


/* Уничтожение личных авто игрока. */
function destroyPlayerCars(player) {
    if (!player.carIds) return;
    for (var i = 0; i < player.carIds.length; i++) {
        var veh = mp.vehicles.at(player.carIds[i]);
        deleteVehicle(veh);
        if (veh) veh.destroy();
    }
}
