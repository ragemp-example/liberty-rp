window.clientStorage = {};
window.globalConstants = {
    houseClasses: ["-", "A", "B", "C", "D", "E", "F"],
    garageClasses: ["-", "A", "B", "C"],
    garageMaxCars: [0, 2, 6, 10],
    doors: ["Открыта", "Закрыта"],
    bizesInfo: [{
            name: "Закусочная",
            blip: 106
        },
        {
            name: "Бар",
            blip: 93
        },
        {
            name: "Магазин одежды",
            blip: 73
        },
        {
            name: "Барбершоп",
            blip: 71
        },
        {
            name: "АЗС",
            blip: 361
        },
        {
            name: "24/7",
            blip: 52
        },
        {
            name: "Тату салон",
            blip: 75
        },
        {
            name: "Оружейный магазин",
            blip: 110
        },
        {
            name: "Автосалон",
            blip: 524
        },
        {
            name: "LS Customs",
            blip: 72
        },
        {
            name: "СТО",
            blip: 446
        },
		{
			name: "Люкс автосалон",
			blip: 524,
			color: 5
		},
		{
			name: "Магазин масок",
			blip: 671,
			color: 60
		},
		{
			name: "Мотосалон",
			blip: 226
		},
		{
			name: "Mersedes автосалон",
			blip: 524,
			color: 3
		},
		{
			name: "Автосалон ком.транспорта",
			blip: 67
		},
		{
			name: "Автосалон премиум",
			blip: 524,
			color: 5
		},
		{
			name: "Ювелирный магазин",
			blip: 617, 
			color: 60
		},
    ],
    bizStatus: ["Закрыт", "Открыт"],

};
var mp;
if (mp != null) {
    mp.eventCallRemote = (name, values) => {
        mp.trigger(`events.callRemote`, name, JSON.stringify(values));
    };
}

function getNameByFactionId(id) {
    var names = ["Мэрия", "LSPD", "LSSD", "FIB", "EMC", "Fort Zancudo", "USN", "Weazel News", "The families",
        "The Ballas Gang", "Los Santos Vagos", "Marabunta Grande", "Русская Мафия", "Итальянская мафия",
        "Японская мафия", "Мексиканская мафия", "Biker Brotherhood", "Biker The Lost MC", "Armenian Mafia", "Чеченская Мафия", "Bloods"
    ];
    id = Math.clamp(id, 1, names.length - 1);
    return names[id - 1];
}

function setLocalVar(key, value) {
    window.clientStorage[key] = JSON.parse(value);
	if (key == 'donate') playerMenu.changeOptions('donate');
}

window.bindlocker = (selectMenuAPI, consoleAPI) => {
	if ((selectMenuAPI ? window.currentMenu === false : window.currentMenu) || window.action_npc.active() || window.ipad.active() || window.shop.active() || window.gun_shop.active() || window.inventoryAPI.active() || window.playerMenu.active() || window.telephone.active() || window.houseMenuTalRasha.active() || (consoleAPI ? false :  window.consoleAPI.active()) || window.modalAPI.active() || window.chatAPI.active() || window.tradeAPI.active() || window.documentsAPI.active()) {return true} else {return false};
}

function debug(text) {
    consoleAPI.debug(text);
}

function setCursor(enable) {
    mp.invoke('focus', enable);
}

function setOnlyInt(textField) {
    $(textField).keypress(function(e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
}

function showBagHead(show) {
    if (show) $("#bag-head").css("display", "flex");
    else $("#bag-head").css("display", "none");
}


function clearOnlyInt(textField) {
    $(textField).off("keypress");
}

function isFlood() {
    return false;
    if (window.antiFlood) {
        mp.trigger(`nError`, 'Anti-FLOOD!');
        return true;
    }
    window.antiFlood = true;
    setTimeout(() => {
        window.antiFlood = false;
    }, 1000);

    return false;
}

function enableSoundStart(soundName, volume){
	var sound = new Howl({
      src: [`talrasha_sound/${soundName}`],
      volume: volume || 1
  });
  sound.play(); 
}

function nSuccess(text) {
    mp.trigger(`nSuccess`, text);
}

function nError(text) {
    console.error(text);
    if (mp) mp.trigger(`nError`, text);
}

function nInfo(text) {
    mp.trigger(`nInfo`, text);
}

// выделить текстовое поле
var lightTextFieldTimer;

function lightTextField(textField, color) {
    if (lightTextFieldTimer) return;
    $(textField).focus();
    var oldColor = $(textField).css("border-color");
    $(textField).css("border-color", color);
    lightTextFieldTimer = setTimeout(() => {
        $(textField).css("border-color", oldColor);
        lightTextFieldTimer = null;
    }, 1000);
}

function lightTextFieldError(textField, text) {
    lightTextField(textField, "#b44");
    nError(text);
}

/*function authCharacterSuccess() {
    $(document).bind('keydown', (e) => {
        if (e.keyCode === 114) { // F3
            playersOnlineAPI.show(!playersOnlineAPI.active());
        }
    });
}*/

function convertMillsToDate(mills) {
    var date = new Date(mills);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var hours = date.getHours();
    var minutes = date.getMinutes();
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    return day + "." + month + "." + date.getFullYear() + " " + hours + ":" + minutes;
}

function convertMinutesToLevelRest(minutes) {
    var exp = parseInt(minutes / 60);
    if (exp < 8) return {
        level: 1,
        rest: exp
    };
    var i = 2;
    var add = 16;
    var temp = 24;
    while (i < 200) {
        if (exp < temp) {
            /*console.log(`exp: ${exp}`);
            console.log(`temp: ${temp}`);
            console.log(`add: ${add}`);*/
            return {
                level: i,
                rest: exp - (temp - add)
            };
        }
        i++;
        add += 8;
        temp += add;
    }
    return -1;
}

function convertLevelToMaxExp(level) {
    return 8 + (level - 1) * 8;
}

Math.clamp = function(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

Math.randomInteger = (min, max) => {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

function getPaddingNumber(str, max = 5) {
    const string = str.toString();
    return string.length < max ? getPaddingNumber(`0${string}`, max) : string;
}

String.prototype.escape = function() {
    return this.replace(/[&"'\\]/g, "");
};
