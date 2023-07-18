const controlsIds = {
    F5: 327,
    W: 32, // 232
    S: 33, // 31, 219, 233, 268, 269
    A: 34, // 234
    D: 35, // 30, 218, 235, 266, 267
    Space: 51,
    LCtrl: 44,
};

global.fly = {
    flying: false, f: 2.0, w: 2.0, h: 2.0, point_distance: 1000,
};
global.gameplayCam = mp.cameras.new('gameplay');

let direction = null;
let coords = null;

const defaultMultiplier = 1.0 //Множитель который /0.5 при замедлении и *1.5 при ускорении


var multiplier = defaultMultiplier

function pointingAt(distance) {
    const farAway = new mp.Vector3((direction.x * distance) + (coords.x), (direction.y * distance) + (coords.y), (direction.z * distance) + (coords.z));

    const result = mp.raycasting.testPointToPoint(coords, farAway, [1, 16]);
    if (result === undefined) {
        return 'undefined';
    }
    return result;
}

mp.events.add('render', () => {
    /*mp.game.graphics.drawText(`Координаты: ${JSON.stringify(coords)}`, [0.5, 0.005], {
        font: 0,
        color: [255, 255, 255, 185],
        scale: [0.3, 0.3],
        outline: true,
    });
    mp.game.graphics.drawText(`pointAtCoord: ${JSON.stringify(pointingAt(fly.point_distance).position)}`, [0.5, 0.025], {
        font: 0,
        color: [255, 255, 255, 185],
        scale: [0.3, 0.3],
        outline: true,
    });*/
    if (mp.clientStorage["admin"] > 0) {
      const controls = mp.game.controls;
      const fly = global.fly;
      direction = global.gameplayCam.getDirection();
      coords = global.gameplayCam.getCoord();

      if (controls.isControlJustPressed(0, controlsIds.F5)) {
          fly.flying = !fly.flying;

          const player = mp.players.local;

          player.setInvincible(fly.flying);
          player.freezePosition(fly.flying);
          player.setAlpha(fly.flying ? 0 : 255);

          if (!fly.flying && !controls.isControlPressed(0, controlsIds.Space)) {
              const position = mp.players.local.position;
              position.z = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, 0.0, false);
              mp.players.local.setCoordsNoOffset(position.x, position.y, position.z, false, false, false);
          }

          mp.game.graphics.notify(fly.flying ? 'Fly: ~g~Включен' : 'Fly: ~r~Выключен');
      } else if (fly.flying) {
          let updated = false;
          const position = mp.players.local.position;
			if (controls.isControlPressed(0, 21)) {
				multiplier = defaultMultiplier * 2.0
			}
			else if (controls.isControlPressed(0, 36)) {
				multiplier = defaultMultiplier * 0.5
			}
			else {
				multiplier = defaultMultiplier
			}


          if (controls.isControlPressed(0, controlsIds.W)) {
              //if (fly.f < 8.0) { fly.f *= 1.025; }

              position.x += direction.x * (fly.f * multiplier);
              position.y += direction.y * (fly.f * multiplier);
              position.z += direction.z * (fly.f * multiplier);
              updated = true;
          } else if (controls.isControlPressed(0, controlsIds.S)) {
              //if (fly.f < 8.0) { fly.f *= 1.025; }

              position.x -= direction.x * (fly.f * multiplier);
              position.y -= direction.y * (fly.f * multiplier);
              position.z -= direction.z * (fly.f * multiplier);
              updated = true;
          } else {
              fly.f = 2.0;
          }

          if (controls.isControlPressed(0, controlsIds.A)) {
             // if (fly.l < 8.0) { fly.l *= 1.025; }

              position.x += (-direction.y) * (fly.l * multiplier);
              position.y += direction.x * (fly.l * multiplier);
              updated = true;
          } else if (controls.isControlPressed(0, controlsIds.D)) {
             // if (fly.l < 8.0) { fly.l *= 1.05; }

              position.x -= (-direction.y) * (fly.l * multiplier);
              position.y -= direction.x * (fly.l * multiplier);
              updated = true;
          } else {
              fly.l = 2.0;
          }

          if (controls.isControlPressed(0, controlsIds.Space)) {
             // if (fly.h < 8.0) { fly.h *= 1.025; }

              position.z += fly.h;
              updated = true;
          } else if (controls.isControlPressed(0, controlsIds.LCtrl)) {
            //  if (fly.h < 8.0) { fly.h *= 1.05; }

              position.z -= fly.h;
              updated = true;
          } else {
              fly.h = 2.0;
          }

          if (updated) {
              mp.players.local.setCoordsNoOffset(position.x, position.y, position.z, false, false, false);
          }
      }
    }
});

/*mp.events.add('getCamCoords', (name) => {
    mp.events.callRemote('saveCamCoords', JSON.stringify(coords), JSON.stringify(pointingAt(fly.point_distance)), name);
});
*/
