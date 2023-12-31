// объединение объектов
Object.extend = function(destination, source) {
    for (var property in source) {
        if (source.hasOwnProperty(property)) {
            destination[property] = source[property];
        }
    }
    return destination;
};

var terminal_cmds = require('../talrasha_command/talrasha_main_command.js');
var house_cmds = require('../talrasha_command/talrasha_house_command.js');
var debug_cmds = require('../talrasha_command/talrasha_debug_command.js');
var biz_cmds = require('../talrasha_command/talrasha_business_command.js');
var inventory_cmds = require('../talrasha_command/talrasha_inventory_command.js');
var faction_cmds = require('../talrasha_command/talrasha_faction_command.js');
var clothes_cmds = require('../talrasha_command/talrasha_clothes_command.js');
var farms_cmds = require('../talrasha_command/talrasha_farm_command.js');
var cutscene_cmds = require('../talrasha_command/talrasha_cutscene_command.js');
var parking_cmds = require('../talrasha_command/talrasha_parking_command.js');
var promocode_cmds = require('../talrasha_command/talrasha_promocode_command.js');
global.cmds = Object.extend(terminal_cmds, house_cmds);

Object.extend(cmds, debug_cmds);
Object.extend(cmds, biz_cmds);
Object.extend(cmds, inventory_cmds);
Object.extend(cmds, faction_cmds);
Object.extend(cmds, clothes_cmds);
Object.extend(cmds, farms_cmds);
Object.extend(cmds, cutscene_cmds);
Object.extend(cmds, parking_cmds);
Object.extend(cmds, promocode_cmds);

DB.Handle.query(`SELECT * FROM talrasha_main_command`, (e, result) => {
    for (var i = 0; i < result.length; i++) {
        var cmd = cmds[result[i].cmd];
        if (!cmd) continue;
        delete cmds[result[i].cmd];
        cmd.description = result[i].description;
        cmd.minLevel = result[i].minLevel;
        cmds[result[i].name] = cmd;
    }

	console.log("\x1b[32m[DONE]\x1b[0m", `"Console command" package has been loaded: \x1b[33m${i}\x1b[0m/\x1b[33m${Object.keys(cmds).length}\x1b[0m.`);
});

module.exports = {
    "playerCommand": (player, message) => {
        if (!player.admin) return player.utils.error(`Вы не админ!`);
        var cmdArgs = message.split(" ");
        var cmdName = cmdArgs.shift();
        if (cmdName == "help") return helpCmdHandler(player, cmdArgs);
        var cmd = cmds[cmdName];
        if (!cmd) return terminal.error(`Команда "${cmdName}" не найдена. Введите "help" для просмотра всех команд.`, player);
        if (cmd.syntax.length > 0) {
            var syntax = cmd.syntax.split(" ");
            if (cmdArgs.length < syntax.length) return terminal.warning(`Неверное количество параметров.<br/>Используйте "${cmdName} ${cmd.syntax}"`, player);
            for (var i = 0; i < syntax.length; i++) {
                var argType = syntax[i].split(":")[1];
                if (!isValidArg(argType, cmdArgs[i])) return terminal.error(`Неверное значение "${cmdArgs[i]}" для параметра ${syntax[i]}!`, player);
                else cmdArgs[i] = toValidArg(argType, cmdArgs[i]);
            }
        }
        if (player.admin < cmd.minLevel) return terminal.warning(`Вам недоступна эта команда. Введите "help [name]" для ознакомления`, player);

        cmd.handler(player, cmdArgs);
    }
};

function helpCmdHandler(player, cmdArgs) {
    if (cmdArgs.length > 0) {
        if (parseInt(cmdArgs[0]) >= 0) {
            var level = parseInt(cmdArgs[0]);
            if (level > player.admin) return terminal.error(`Ваш уровень администратора мал!`, player);
            var text = `${level} уровень администратора:<br/>`;
            var count = 0;
            for (var name in cmds) {
                var cmd = cmds[name];
                if (cmd.minLevel != level) continue;
                count++;
                text += `<b>${name}</b> <i>${cmd.syntax}</i> - ${cmd.description}<br/>`;
            }
            text += `<br/>Всего команд: ${count} шт.<br/>Введите "help name" для ознакомления с командой.`;
            return terminal.log(text, player);
        }
        var cmdName = cmdArgs[0];
        var cmd = cmds[cmdName];
        if (!cmd) return terminal.error(`Команды "${cmdName}" не существует.`, player);
        var message = `${cmdName} ${cmd.syntax} - ${cmd.description}<br/>Мин. уровень: ${cmd.minLevel}`;
        terminal.log(message, player);
    } else {
        var text = "";
        for (var name in cmds) {
            var cmd = cmds[name];
            if (cmd.minLevel > player.admin) continue;
            text += `<b>${name}</b> ${cmd.syntax} (${cmd.minLevel} lvl.) - ${cmd.description}<br/>`;
        }
        var keys = Object.keys(cmds);
        text += `<br/>Всего команд: ${keys.length} шт.<br/>Введите "help name" для ознакомления с командой.`;
        terminal.log(text, player);
    }
}

function isValidArg(type, arg) {
    if (type == "n") return !isNaN(arg) && arg.length > 0;
    if (type == "s") return arg && arg.length > 0;
    return false;
}

function toValidArg(type, arg) {
    if (type == "n") return parseFloat(arg);
    return arg;
}
