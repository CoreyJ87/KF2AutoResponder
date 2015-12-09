/**
 * Created by synik on 12/7/2015.
 */

// ==UserScript==
// @name        KF2 Chat Script
// @namespace   https://github.com/wookiefriseur/KF2AutoAnnouncer
// @description KF2 webinterface chat Automation
// @include     */ServerAdmin/current/chat*
// @match       */ServerAdmin/current/chat*
// @version     0.9d
// @grant		none
// ==/UserScript==

// Vars to make your welcome message easier to edit, server_ip and server_port are used for url-comparison check
var server_name = 'Scrake and Bake';
var server_ip = '173.199.104.150';
var server_port = 23010;
var chatbot_user = '[ChatBot]'; // enter AutoChat nickname name so its messages can be ignored by the script (case sensitive)
// Default message. Can be changed in textarea on page, but is not saved because I'm dumb. Change it here to save it.
var auto_message = '[Welcome to ' + server_name + '], enter !help for a cmd list; Server Info on: gametracker.com/server_info/' + server_ip + ':' + server_port + '/';


// Vars that are used during init or some function calls, careful with changes (don't set times too low or delete vars)
var auto_interval = 600; // Repeat message every x seconds
var jan_delay = 3; // Cooldown inbetween the messages, if multiple entered (I had to use freeze/sleep to make it work, makes UI unresponsive while processing)
var autosend_state = 'checked=true'; // Automessage, default on (in case the browser gets reloaded while admin is afk) 
var autorespond_state = 'checked=true'; // Autoresponder, default on
// URL string that has to be matched for the script to activate changes. That's for preventing it from being active on incompatible subdirectories.
var target_url = 'http://' + server_ip + ':' + server_port + '/ServerAdmin/current/chat#chatlog';

// Chat response messages that can be called, when commands are detected, like !help
// List public commands with and without arguments.. can be just put into an array in the future
var mapvote_time = 60;
var cmd_help = [
    "[Cmds are case sensitive, try again if it doesn't work]",
    "!time, !status, !dice <sides>, !dostuff <target>",
    "SC, FP, !iz, !ip, !slap <target>"];
// List of admin cmds, a check needs to be implemented to test if the user is logged in as admin or the name is in the admin list
var cmd_adm_help = ["Admin Commands(!admin):", "!switchmap, !setmap KF-Map, !restartmap", "!setdiff,  !setmessage, !kick !setpw"];
var cmd_mapchange = "Majority of currently " + getGameDetails()[1] + " Players must type !mapchange to switch to a random map"; // mapchange info
var cmd_mapvote = ["Mapvoting initiated. Vote ends after " + mapvote_time + " seconds.", "Example: !mapvote kf-burningparis to vote"];
var cmd_insult_player = [
    "Nob off, you tosspot!",
    "My granny shoots better than you!",
    "Smeghead!",
    "At least look like you're trying.",
    "God almighty, you're a waste of space!",
    "Wayne Rooney's smarter than you!",
    "Don't be sodding stupid!",
    "What a plonker!",
    "You daft wanker!",
    "Oh, get on with it! Plod!",
    "Who do you think you are? Bleedin' action man?",
    "I've met smarter donkeys than you lot!",
    "Please! Join their side!",
    "You muppet!",
    "Bloody frog would be more use than you!"];
var cmd_insult_zed = [
    "Ha, call yourself a bloody zombie?",
    "Wankers!",
    "Reminds me of a bunch of pikies!",
    "You're pathetic, like a bunch of bloody Millwall fans!",
    "You're all fur-coat, no knickers, bitches!",
    "Soft as shite!",
    "It's like shooting fish in a barrel!",
    "Bloody hell! You stink!",
    "Try harder, ya smelly bastards!",
    "At least try, you mutant bastards!",
    "Oooh! Thats just nasty!",
    "You're too soft to be a zombie!",
    "I could kill you losers all night long!",
    "Come on! Ya' want some, ya' poncies?!",
    "It's like Croydon on a Friday night!",
    "Dickless zombie scum!",
    "You couldn't scare my mum!",
    "Die, you useless clot sucker!",
    "I've seen scarier schoolgirls than you lot!",
    "I've seen scarier five-year-olds! Ha ha ha ha!"];
var cmd_sc_spotted = [
    "Mind where you're waving that, pal!",
    "Please tell me that's not a chainsaw he's carrying.",
    "A chainsaw? You have got to be kidding me, pal.",
    "God, chainsaw massacre time!"];
var cmd_fp_spotted = [
    "Geez, that's a big one.",
    "Oh, crap. Don't let that big bugger near me!",
    "Bloody hell, what's he got on his arms?",
    "God, he's all lit up!"];
var cmd_objects = [
    "a chair", "a fish", "a dildo", "a Clot leg", "an old shoe", "used toilet paper",
    "a pan", "a bloat head", "a rubber chicken", "stinking socks", "a magic wand",
    "a rubber ducky", "a tooth brush", "clean underwear", "drum sticks", "chicken wings",
    "a Zweihander", "a Clot", "a Slasher", "a Cyst", "a Siren", "a Crawler", "a Gorefast",
    "a Stalker", "a Husk", "a Scrake", "a Bloat", "a Fleshpound", "Hans Volter", "a twig",
    "the Trader Pod", "Constable Briar", "Lt. Masterson", "Rev. Alberts", "Ana", "Donovan",
    "Tanaka", "Mr Foster", "Dj Scully", "Tom", "Anton", "the Zerker", "the Commando",
    "the Medic", "the Support", "the Firebug", "the Demo", "the Gunslinger", "the Sharpshooter",
    "the Martial Artist", "the S.W.A.T.", "a Krovel", "a Pulverizer", "a Nailgun",
    "an Eviscerator", "the holy hand grenade", "an AR", "a scalpel", "a pistol", "an SMG", "a shotgun",
    "a Boomstick", "a flamethrower", "a Katana", "a door", "some cake", "crayons", "a club",
    "a rotten egg", "a police car", "a volcano", "a kitten", "a rocket", "an RPG", "butter",
    "an elbow", "a cannon", "the Dude", "pubic hair", "a giant cactus", "a poisonous frog",
    "an evil donkey", "a CASIO fx-991ES calculator", "an office desk", "a vacuum cleaner salesman",
    "a Joint", "a confused snake", "a pool cue", "a rock", "a turkey", "a mean cat", "a dead parrot",
    "a nice boat", "a HORZINE employee", "the Patriarch", "furniture", "an owl", "Dosh", "loadsamoney",
    "Harry Enfield", "soap on a roap", "a beautiful Bloat", "a feisty Fleshpound", "a seductive Stalker",
    "a cocky clot", "a sad Scrake", "a happy Husk", "an albino Crawler", "a silent Siren", "a Cowboy hat",
    "the Spanish Inquisition", "a pair of pants", "a KEVLAR vest"
];
var cmd_actions = [
    "hugs", "pokes", "kicks", "hits", "nods at", "looks at", "laughs at", "waves at", "welds",
    "eats", "shouts at", "runs towards", "runs away from", "jumps on", "escapes from", "unwelds",
    "chases", "uses", "hangs", "yells at", "bangs", "scratches", "talks to", "whispers to",
    "visits", "questions", "accepts", "admires", "agrees with", "analyzes", "apologizes to",
    "applauds", "appreciates", "asks", "avoids", "dresses", "bans", "bathes", "washes", "battles",
    "fights", "becomes", "turns into", "cleans", "breaks", "blows", "brushes", "burns", "shoots",
    "wakes", "calls", "cares about", "carries", "catches", "charges at", "challenges", "cheers at",
    "checks out", "chokes on", "chews on", "threatens", "licks", "rages", "ignores", "cowers in fear from",
    "kites", "unrages", "annoys", "combs the hair of", "damages", "destroys", "blows up", "drags",
    "drowns", "points at", "knows", "does", "disarms", "discovers", "disagrees with", "cuts", "wins",
    "examines", "expects", "flees from", "buys", "faces", "forces", "grins at", "hides", "hides from",
    "greets", "hammers", "holds", "misses", "hunts", "hypnotizes", "hears", "harasses", "imagines", "injures",
    "wets", "interrupts", "invites", "jails", "joins", "jokes about", "juggles", "kills", "kisses", "knocks out",
    "lies to", "locks", "owns", "measures", "marries", "moans at", "motivates", "encourages", "mourns", "mugs",
    "robs", "murders", "nails", "needs", "wants", "obeys", "offends", "opens", "orders", "paints", "smokes",
    "sits on", "persuades", "peels", "photographs", "takes a picture of", "peeps at", "stalks", "pinches",
    "pleases", "pleasures", "plays with", "praises", "prefers", "protects", "punishes", "punches", "purchases",
    "pushes", "irradiates", "remembers", "repairs", "touches", "rubs", "rushes", "sleeps on", "screws", "sells",
    "scares", "saves", "scorches", "sees", "shaves", "sings about", "slays", "smiles at", "sneaks towards",
    "sneaks away from", "hides behind", "spots", "stares at", "stimulates", "strikes", "sucks", "swings at",
    "talks to", "teases", "tames", "targets", "taps", "tastes", "tempts", "terrifies", "thanks", "tickles",
    "tips", "trades with", "transforms into", "turns into", "tricks", "teleports into", "tries", "sniffs", "spares",
    "soothes", "squeezes", "brushes", "suspects", "is suspicious of", "understands", "undresses", "upgrades", "upsets",
    "visits", "vexes", "waits for", "warns", "watches", "wears", "wastes", "zooms in on", "whistles at", "flirts with",
    "wonders about", "works with", "writes a letter to", "does", "draws"
];

var cmd_adj = [
    "angrily", "carefully", "eagerly", "fast", "patiently", "quickly", "quietly", "downstairs", "upstairs", "dearly",
    "accidentally", "fataly", "intentionally", "purposely", "sometimes", "always", "... not!", "often", "rarely",
    "absentmindedly", "adventurously", "anxiously", "awkwardly", "badly", "bashfully", "beautifully", "blindly",
    "boldly", "busily", "bravely", "cheerfully", "curiously", "courageously", "cautiously", "defiantly", "deeply",
    "deliberately", "delightfully", "doubtfully", "elegantly", "easily", "excitedly", "enthusiastically", "energetically",
    "furiously", "gently", "innocently", "intensely", "instantly", "joyfully", "jovially", "keenly", "knowingly",
    "lovingly", "lazily", "mortally", "madly", "merrily", "monthly", "daily", "weekly", "majestically", "nervously",
    "overconfidently", "optimistically", "painfully", "politely", "rapidly", "rudely", "readily", "reluctantly", "inappropriately",
    "repeatedly", "sadly", "scarcely", "scarily", "sedately", "selfishly", "seriously", "sheepishly", "silently", "unseemingly",
    "tenderly", "terribly", "thoughtfully", "tightly", "triumphantly", "slowly", "sleepily", "stealthily", "sweetly",
    "unexpectedly", "unnecessarily", "upliftingly", "upside-down", "uselessly", "valiantly", "viciously", "violently",
    "victoriously", "voluntarily", "warmly", "weakly", "wildly", "worriedly", "wonderfully", "yawningly", "yearly", "youthfully",
    "like a true hero", "like a boss", "because why not", "once in a while", "like one of your French girls", "in an orderly manner"
];

// and so on...

// Images for message status indicators (15x15)
var img_checked = 'data:image/gif;base64,R0lGODlhDwAPAIABADP/MwAAACH5BAEKAAEALAAAAAAPAA8AQAIejI9pAMsKD2voxVsTdZtPDIai1EFftZ1ooypTOSYFADs=';
var img_tocheck = 'data:image/gif;base64,R0lGODlhDwAPALMCAISEhP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgACACwAAAAADwAPAAAEMFDISSsFWIRtBc4bd3kgB0wfqQXk2bpo+lYf3HU1LefXnv0nmadFtM14umDmxhREAAAh+QQFCgACACwIAAEABgAGAAAEDxBIQeUUVgQMdNjeR31fBAAh+QQFCgACACwKAAMABAAJAAAEDxAIOYG9WGgRuu9cJwVCBAAh+QQFCgACACwIAAgABgAGAAAEEFAIQIGsIIRJ9bbeJniSEAEAIfkEBQoAAgAsAwAKAAkABAAABA4QiBAEkJLWm7XlE/VJEQAh+QQFCgACACwBAAgABgAGAAAEDzDIIMSkVgoA7OYVB4ZcBAAh+QQFCgACACwBAAMABAAJAAAEDlAEAYKVNl/Bgf8g0FERACH5BAUKAAIALAEAAQAGAAYAAAQPUMhAJw0CiAv6Dp2XhVIEADs=';
var img_ignored = 'data:image/gif;base64,R0lGODlhDwAPAIABAOMmJv///yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAEALAAAAAAPAA8AAAIjjI9poMcLXoqSzngrVta2QG0fKH6hxGFe5pQk+rYwVI3zaBQAOw==';
var img_executed = 'data:image/gif;base64,R0lGODlhDwAPAIABAP//AAAAACH5BAEKAAEALAAAAAAPAA8AQAIljI8ZANjH4FsysYsV3m7SakQhqJQlp4nSpH7h03pia7H0dWZIAQA7';

/* -------------------|
 ----- Functions ------|
 ---------------------*/

/*
 ----- GET, COMPARE STUFF, AND OTHER HELPERS -----
 */

// Helper to check if a variable is empty or undefined
// Obj => Bool
function isDefined(object) {
    return (typeof object !== 'undefined' && object !== null && object !== '');
}

// Compare two URL Strings that aren't empty, split them at anchor / div marker '#' by default
// String x String => Boolean
// TODO: Replace by jQuery.. or dont
function cmpUrl(haystack, needle) {
    needle = needle.split('#');
    //    if (typeof haystack == 'undefined' || typeof needle == 'undefined' || haystack.includes(needle[0]) === false	|| haystack === ''	|| needle === '') {
    if (!isDefined(haystack) || !isDefined(needle[0]) || !(haystack.includes(needle[0]))) {
        return false;
    } else {
        return true;
    }
}

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

// Help function to construct jQuery element searches
// String x String => Obj
function getNodeObj(type_name, object_name) {
    var obj_array = [];
    if (!isDefined(type_name) || !isDefined(object_name)) {
        return false;
    } else {
        return $('[' + type_name + '="' + object_name + '"]');
    }
}


// Calls url-compare function to check if the directory is supported by the script
// You can remove the check, but remember to call the html constructors (addAutoChatDiv, shoveOffYouTosser, addInfoDiv)
// In Firefox the alert appears as a popup message even though the site has an interface for it,  remove if it gets too annoying.
// NULL => Proc
function checkUrl() {
    if (cmpUrl(target_url, location.pathname)) {
        addAutoChatDiv();
        getMapList();
        Array.prototype.clean = function (deleteValue) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == deleteValue) {
                    this.splice(i, 1);
                    i--;
                }
            }
            return this;
        };
        setTimeout(shoveOffYouTosser(), 500);
        setTimeout(addInfoDiv(), 500);
        setTimeout(addStatusDiv(), 500);
    } else {
        self.alert("Target subdirectory:\n" + target_url + "\n\nAutoChat will be inactive until you enter the target dir.");
    }
}

// Sleep function, in case a timeout is not the right tool
// But don't use it in loops that you want to complete, because the break leaves not just this one but any loop it is executed it
// Int => SLEEP
function breakLoop(seconds) {
    biggestnumberintheworld = 999999999;
    var timestamp = new Date().getTime();
    for (i = 0; i <= biggestnumberintheworld; i++) {
        if ((new Date().getTime() - timestamp) > seconds * 1000) {
            break;
        }
    }
}

// Help function to recursively add delay to each to be looped element
// Int x Int x Int x Proc => Proc
function waitForIt(index, n_times, delay, cmd) {
    // Break condition
    if (index >= n_times) {
        return;
    } else {
        // Execute and increment
        cmd(index);
        index++;
    }
    // Steps taken, next run
    breakLoop(delay);
    waitForIt(index, n_times, delay, cmd);
}

// Picks a random key from an array and returns its value
// Array => Witchcraft => String
function getRandomItem(array) {
    if (!isDefined(array) || typeof array !== 'object') {
        return false;
    }
    var ary_size = array.length;
    var ary_index = Math.floor(Math.random() * ary_size);

    return array[ary_index];
}

// Rolls an n sided dice and returns the result
// Num => Num
function rollDice(sides) {
    (!isDefined(sides) || typeof sides !== 'number' || sides <= 0) ? (sides = 6) : (false);
    sides = Math.round(sides);
    return Math.floor(Math.random() * sides) + 1;
}


/*
 ----- READ, POST MESSAGES AND EXECUTE COMMANDS -----
 */

function adminCommand(username, command, parameter) {
    $.ajax({
        type: "GET",
        url: '/ServerAdmin/current/players',
        success: function (page) {
            username = escapeRegExp(username);
            var startInt = page.search(username);
            var endInt = startInt + 230;
            var pageString = "<td>" + page.slice(startInt, endInt);
            var userArray = [];
            var startArray = [];
            var endArray = [];
            var everyother = true;
            for (var index = pageString.indexOf(">"); index >= 0; index = pageString.indexOf(">", index + 1)) {
                if (everyother)
                    startArray.push(index + 1);
                everyother = !everyother;
            }
            everyother = false;
            for (var index2 = pageString.indexOf("<"); index >= 0; index = pageString.indexOf("<", index + 1)) {
                if (everyother)
                    endArray.push(index2);
                everyother = !everyother;
            }
            for (var x = 0; x < startArray.length; x++)
                userArray.push(pageString.substring(startArray[x], endArray[x]));
            userArray.pop();
            var adminIndex = userArray.length - 2;

            console.log(userArray);
            console.log(userArray[adminIndex]);
            if (userArray[adminIndex] == "Yes") { //Functions for admins
                if (command == "!amiadmin")
                    isAdmin(true, username);
                else if (command == "!changemap")
                    changeMap(parameter);
                else if (command == "!listmaps")
                    listMaps();
                else if(command == "!difficulty")
                    changeDifficulty();
            }
            else if (userArray[adminIndex] == "No") { //Responses for non-admins
                if (command == "!amiadmin")
                    isAdmin(false, username);
            }
        },
        error: ajaxError
    });
}

function isAdmin(isAdmin, username) {
    if (isAdmin == true)
        postResponseMessage("Yes you are " + username);
    else
        postResponseMessage("No you are not " + username);
}

function changeMap(themap) {
    var validMap = false;
    $('select#map option').each(function () {
        if ($(this).attr('class') == "M" + themap) {
            validMap = true;
        }
    });
    if (validMap) {
        var ajaxData = {
            gametype: "KFGameContent.KFGameInfo_Survival",
            urlextra: "?maxplayers=6",
            mutatorGroupCount: "0",
            action: "change",
            map: $(".M" + themap).val()
        };
        postResponseMessage("Changing map to " + $(".M" + themap).val());
        $.ajax({
            type: 'POST',
            url: "/ServerAdmin/current/change",
            data: ajaxData,
            success: function () {
                console.log("Changing map to " + $(".M" + themap).val());
            },
            error: gameSummaryAjaxError
        });
    }
    else {
        postResponseMessage(themap + " is not a valid map number!")
    }
}

function changeDifficulty(difficulty) {
    var difficultyInt = parseInt(difficulty);
    if (difficulty <= 3 && difficulty >= 0) {
        var ajaxData = {
            action: "save",
            liveAdjust: "1",
            settings_GameDifficulty_raw: difficulty
        };
        var difficultyName;
        var difficultyObj = {
            Normal: {value: 0, name: "Normal"},
            Hard: {value: 1, name: "Hard"},
            Suicidal: {value: 2, name: "Suicidal"},
            HellOnEarth: {value: 3, name: "Hell on Earth"}
        };
        for (var singleDiff in difficultyObj) {
            var diff = difficultyObj[singleDiff];
            if (diff.value == difficultyInt) {
                difficultyName = diff.name;
            }
        }
        postResponseMessage("Changing difficulty to " + difficultyName);
        $.ajax({
            type: 'POST',
            url: "/ServerAdmin/settings/general",
            data: ajaxData,
            success: function () {
                console.log("Changing difficulty to " + difficultyName);
            },
            error: gameSummaryAjaxError
        });
    }
    else {
        postResponseMessage(difficulty + " is not a valid difficulty setting!")
    }
}

function listMaps() {
    var mapArray = []
    var number = 0;
    $('#map option').each(function () {
        mapArray.push(number + "-" + $(this).val());
        number++;
    });
    for (var x = 0; x < mapArray.length;) {
        setTimeout(postResponseMessage(mapArray[x] + ", " + mapArray[x + 1] + ", " + mapArray[x + 2] + ", " + mapArray[x + 3] + ", " + mapArray[x + 4]), 1000);
        x + 5;
    }
}


function getMapList() {
    var requestData = {ajax: 1, gametype: "KFGameContent.KFGameInfo_Survival"};
    requestData.mutatorGroupCount = 0;
    $.ajax({
        type: "POST",
        url: '/ServerAdmin/current/change+data',
        data: requestData,
        success: function (data) {
            $('body').append("<div id='listofmaps' style='display:none;'>" + data + "</div>");
            var numbers = 0;
            $('#map option').each(function () {
                $(this).addClass("M" + numbers);
                numbers++;
            });
        },
        error: ajaxError
    });
}


// Post message to chat console, splits string at semicolon + space and posts it after n seconds
// String => Array => String => AJAX
function postAutoMessage(auto_message) {
    var auto_message_ary = auto_message.split("; ");
    i = 0; // index start

    if ($('#autochat_delay').val() >= 0) {
        jan_delay = $('#autochat_delay').val();
    } else {
        jan_delay = 2;
    }

    waitForIt(i, auto_message_ary.length, jan_delay, function (i) {
        $.ajax({
            type: 'POST',
            url: pageUri + '+data',
            data: {
                ajax: 1,
                message: auto_message_ary[i],
                teamsay: -1
            },
            success: chatMessage,
            error: ajaxError
        });
    });
}

// Quickpost a message, can be used by autoresponder functions, no delay, no separators
// Str => Proc
function postResponseMessage(message) {
    $.ajax({
        type: 'POST',
        url: pageUri + '+data',
        data: {
            ajax: 1,
            message: message,
            teamsay: -1
        },
        success: chatMessage,
        error: ajaxError
    });
}


function refreshGameSummary() {
    $.ajax({
        type: 'POST',
        url: webadminPath + '/current+gamesummary',
        data: {
            ajax: 1
        },
        success: newGameSummary,
        error: gameSummaryAjaxError
    });
}


// Read message and output action / answer according to it
// Str x Int => Func
function parseMessage(input, index) {
    setTimeout(getDown('content'), 2000);
    var teamcolor = getNodeObj('class', 'teamcolor')[index].innerHTML;
    var player = getPlayerName(index);
    var img = img_executed;
    var stats = getWaveStatus();

    if ((!isDefined(input) || !$('#autorespond_chckbox')[0].checked) || (teamcolor.includes('base64') && !teamcolor.includes(img_tocheck))) {
        console.log("Already parsed, no message or autoresponder not active");
        return false;
    }
    //Admin Commands
    if (input == "!amiadmin") {
        adminCommand(player, "!amiadmin", null);
    } else if (input.split(' ')[0] == "!changemap") {
        adminCommand(player, "!changemap", input.split(' ')[1]);
    } else if (input == "!listmaps") {
        adminCommand(player, "!listmaps");
    }
    else if (input.split(' ')[0] == "!difficulty") {
        adminCommand(player, "!difficulty", input.split(' ')[1])
    } // End Admin Commands
    else if (input == "!time") {
        getNodeObj('class', 'teamcolor')[index].innerHTML = '<img src="' + img + '" />';
        var answer_date = Date().split(' ');
        var answer_time = "[" + chatbot_user + " time] " + answer_date[4] + " " + answer_date[5];
        postResponseMessage(answer_time);

    } else if (input == "hey " + chatbot_user) {
        postResponseMessage("leave me alone, " + player);
    } else if (input.split(' ')[0] == "!dice") {
        getNodeObj('class', 'teamcolor')[index].innerHTML = '<img src="' + img + '" />';
        (!isDefined(input.split('!dice ')[1])) ? (sides = 6) : (sides = input.split('!dice ')[1]);
        result = rollDice(parseInt(sides));
        (result == sides && parseInt(sides) >= 6) ? (crit = ". Lucky bastard!") : (crit = "");
        postResponseMessage(player + " rolls a " + result + crit);
    } else if (input == "!help") {
        getNodeObj('class', 'teamcolor')[index].innerHTML = '<img src="' + img + '" />';
        for (i = 0, max = cmd_help.length; i < max; i++) {
            setTimeout(postResponseMessage(cmd_help[i]), 1000 * i);
        }
    }
    else if (input == "!motd") {
        var tmp = ($('#autochat_txtbox').val()).split("; ");
        getNodeObj('class', 'teamcolor')[index].innerHTML = '<img src="' + img + '" />';
        for (i = 0, max = tmp.length; i < max; i++) {
            setTimeout(postResponseMessage(tmp[i]), 1000 * i);
        }
    } else if (input == "!status") {
        getNodeObj('class', 'teamcolor')[index].innerHTML = '<img src="' + img + '" />';
        postResponseMessage("[Wave " + stats[0] + "] [" + stats[3] + "/" + stats[4] + " Players] [" + stats[1] + "/" + stats[2] + " Zeds]");
    } else if (input == "SC") {
        getNodeObj('class', 'teamcolor')[index].innerHTML = '<img src="' + img + '" />';
        postResponseMessage(player + ": " + getRandomItem(cmd_sc_spotted));
    } else if (input == "FP") {
        getNodeObj('class', 'teamcolor')[index].innerHTML = '<img src="' + img + '" />';
        postResponseMessage(player + ": " + getRandomItem(cmd_fp_spotted));
    } else if (input == "!ip") {
        getNodeObj('class', 'teamcolor')[index].innerHTML = '<img src="' + img + '" />';
        postResponseMessage(player + ": " + getRandomItem(cmd_insult_player));
    } else if (input == "!iz") {
        getNodeObj('class', 'teamcolor')[index].innerHTML = '<img src="' + img + '" />';
        postResponseMessage(player + ": " + getRandomItem(cmd_insult_zed));
    } else if (input.split(' ')[0] == "!slap") {
        getNodeObj('class', 'teamcolor')[index].innerHTML = '<img src="' + img + '" />';
        (!isDefined(input.split('!slap ')[1])) ? (target = "everybody") : (target = input.split('!slap ')[1]);
        postResponseMessage(player + " slaps " + target + " with " + getRandomItem(cmd_objects));
    } else if (input.split(' ')[0] == "!dostuff") {
        getNodeObj('class', 'teamcolor')[index].innerHTML = '<img src="' + img + '" />';
        (!isDefined(input.split('!dostuff ')[1])) ? (target = getRandomItem(cmd_objects)) : (target = input.split('!dostuff ')[1]);
        postResponseMessage(player + " " + getRandomItem(cmd_actions) + " " + target + ", " + getRandomItem(cmd_adj) + ".");

    } else {
        console.log("Msg detected, not a command: " + input);
        img = img_checked;
    }

    getNodeObj('class', 'teamcolor')[index].innerHTML = '<img src="' + img + '" />';
}


/*
 ----- OTHER FUNCTIONS / NOT YET USED OR NO CATEGORY ------
 */

// List all messages currently visible in the chat log window
// NULL => Array
// ToDo: Timestamps, ids and stuff (only temp timestamps and ids possible without api access)
function getAllMessages() {
    var cm_ary_ind = [];
    var messages_ary = [];

    cm_ary_ind[0] = getNodeObj("class", "chatmessage").length - 1;
    cm_ary_ind[1] = getNodeObj("class", "chatmessage")[0].children.length - 1;
    for (var row_i = 0; row_i <= cm_ary_ind[0]; row_i++) {
        messages_ary[row_i] = [];
        for (var col_i = 0; col_i <= cm_ary_ind[1]; col_i++) {
            if (col_i === 0) {
                // ID as Placeholder
                messages_ary[row_i][col_i] = 'msg_[' + row_i + col_i + ']';
            } else if (col_i == 1) {
                // Player Name
                messages_ary[row_i][col_i] = jackTheStripper(getPlayerName(row_i));
            } else if (col_i == 2) {
                // Message text
                messages_ary[row_i][col_i] = jackTheStripper(getPlayerMessage(row_i));
            } else {
                // Default for who knows what situation
                messages_ary[row_i][col_i] = '---';
            }
        }
    }
    return messages_ary;
}


// Get user name belonging to chatmessage index
// Int -> String
function getPlayerName(index) {
    return getNodeObj('class', 'chatmessage')[index].children[1].innerHTML;
}

// Get message text belonging to chatmessage index
// Int => String
function getPlayerMessage(index) {
    return getNodeObj('class', 'chatmessage')[index].children[2].innerHTML;
}

// Get number of players from game status info as [Current, Max]
// NULL => Array(Int,Int)
function getNumPlayers() {
    var inner_html = getNodeObj('class', 'gs_players')[1].innerHTML;
    var output = inner_html.split('/');
    return output;
}

// Get wave and number of zeds from game status info as [Current, Max]
// NULL => Array(Int,Int,Int,Int,Int)
function getWaveStatus() {
    var output = [];
    output[0] = ((getNodeObj('class', 'gs_wave')[0].innerHTML).split(' '))[1]; //wave
    tmp_wave = (getNodeObj('class', 'gs_wave')[1].innerHTML).split('/');
    tmp_players = (getNodeObj('class', 'gs_players')[1].innerHTML.split('/'));
    output[1] = tmp_wave[0]; // zeds killed
    output[2] = tmp_wave[1]; // zeds total
    output[3] = tmp_players[0]; // players
    output[4] = tmp_players[1]; //player max (6)
    return output;
}

// Alternative approach for getting game details
function getGameDetails() {
    var output = [
        $('#gamesummary-details')[0].getElementsByTagName('dd')[0].innerHTML, // Map
        $('#gamesummary-details')[0].getElementsByTagName('dd')[1].innerHTML,  // x/n players
        $('#gamesummary-details')[0].getElementsByTagName('dd')[2].innerHTML  // x/n zeds
    ];
    return output;
}


// Strips user chat entries from possible  script breaking characters, if not already filtered by server
// TODO: test Security or replace by jQuery, or just dont
function jackTheStripper(input_str) {
    return input_str.replace(/\\<>\'\"\{\}/g, '');
}

/*
 ----- LAYOUT FUNCTIONS -----
 */

// Add controls for auto messages, +work arounds chat display
// NULL => HTML
// TODO: Transform all into node create / transform commands instead of string concatenation
function addAutoChatDiv() {
    var original_div_obj = $('#content');
    var autochat_div_top = '<div id="autochatdiv" style="position: absolute; top: 120px; width: 100%;">';
    var autochat_checkbox = '<input id="autochat_chckbox" type="checkbox" onclick="if (!self.checked) { self.checked = true; self.value = \'on\'} else { self.checked = false; self.value = \'off\'};"' + autosend_state + '></input><label for="autochat_chckbox">Auto send messages every &nbsp;</label>';
    var autorespond_checkbox = '<input id="autorespond_chckbox" type="checkbox" onclick="if (!self.checked) { self.checked = true; self.value = \'on\'} else { self.checked = false; self.value = \'off\'};"' + autorespond_state + '></input><label for="autorespond_chckbox">Autoresponder</label>';
    var autochat_interval = '<input id="autochat_interval" type="number" step="30" max="54000" min="10" maxlength="5" style="width: 75px; color: blue;" value="' + auto_interval + '"></input><label for="autochat_interval">&nbsp; sec</label><br />';
    var autochat_delay = 'Delay each msg for <input id="autochat_delay" type="number" max="10" min="0" maxlength="2" style="width: 30px; color: red;" value="' + jan_delay + '"></input><label for="autochat_delay">s (freezes UI+Script)</label>';
    var autochat_txtbox = '<textarea id="autochat_txtbox" style="width: 90%; height: 80px; color: yellow;">' + auto_message + '</textarea>';
    var original_div = original_div_obj[0].innerHTML;
    var autochat_div = autochat_div_top + '<div id="autochat_left" style="width: 50%; position: absolute; left: 1px;">'
        + autochat_checkbox + autochat_interval + autochat_delay + "<br />" + autorespond_checkbox + '</div>'
        + '<div id="autochat_right" style="width: 50%; position: absolute; left: 325px; top: 0px;">' + autochat_txtbox + '</div></div>';
    var new_div = original_div + autochat_div;

    replaceMe(original_div_obj[0], new_div);
    $('#content')[0].style.height = "65%";
    $('#content')[0].style.overflowY = "scroll";
}

// Replaces menu with info box
// NULL => HTML
// TODO: Transform all into node create / transform commands instead of string concatenation
function addInfoDiv() {
    var original_div_obj = getNodeObj('id', 'menu', '');
    var currinfo_li = '<li class="no-submenu"><a href="/ServerAdmin/current/info" title="The current game status."><span>Server Info</span></a></li>';
    var currgame_li = '<li class="no-submenu"><a href="/ServerAdmin/current" title="The current game status."><span>Current Game</span></a>';
    var chattab_li = '<li class="no-submenu"><a href="/ServerAdmin/current/chat" title="Chat Tab"><span>Chat Tab</span></a></li>';
    var changemap_li = '<li class="no-submenu"><a href="/ServerAdmin/current/change" title="Change the current map or game type."><span>Change Map</span></a></li>';
    var players_li = '<li class="no-submenu"><a href="/ServerAdmin/current/players" title="Manage the players currently on the server."><span>Players</span></a></li>';
    var logout_li = '<li class="no-submenu"><a href="/ServerAdmin/logout" title="Log out"><span>Log out</span></a></li>';
    var infobox_div = '<h2 id="autochat_infobox">InfoBox</h2><ul class="navigation">'
        + currgame_li
        + currinfo_li
        + chattab_li
        + players_li
        + changemap_li
        + logout_li + '</ul>';
    replaceMe(original_div_obj, infobox_div);
}


// Tries to arrange divs
// yeah, ok mate
function shoveOffYouTosser() {
    var messages_div_obj = $('#messages');
    var chat_console_h2_obj = $('#content');
    if (!chat_console_h2_obj) {
        alert("Error in " + arguments.callee.toString().match(/function ([^\(]+)/)[1]);
        return false;
    } else {
        chat_console_h2_obj = chat_console_h2_obj[0].getElementsByTagName('h2')[0];
    }
    var footer_obj = $('#footer');
    var autoupd_div_obj = $('#autoupdatechatdiv');
    var autochat_txtbox_obj = $('#autochat_txtbox');
    var chat_div_obj = $('#chat');

    // Top space for autochat components
    messages_div_obj[0].style.height = "80px";
    messages_div_obj[0].style.width = "90%";

    // Move copyright, chat input and autoupdate checkbox to bottom
    footer_obj[0].style.position = 'absolute';
    footer_obj[0].style.bottom = '5px';
    footer_obj[0].style.width = '70%';
    autoupd_div_obj[0].style.position = 'absolute';
    autoupd_div_obj[0].style.bottom = '40px';
    chat_div_obj[0].style.position = 'absolute';
    chat_div_obj[0].style.bottom = '55px';

    // Position Textarea for auto messages
    autochat_txtbox_obj[0].style.position = "absolute";
    autochat_txtbox_obj[0].style.top = "0px";

    // Delete Chatlog header
    if (chat_console_h2_obj) {
        chat_console_h2_obj.parentNode.removeChild(chat_console_h2_obj);
    }

    setTimeout(getDown('content'), 2000);


}

// Creates status div near Logo that shows status of announcements
// NULL => HTML
function addStatusDiv(iterations) {
    if (!isDefined($('#infobox')[0])) {
        var infotext = document.createElement("p");
        var infoParent = document.getElementById("header");
        infoParent.appendChild(infotext);
        infotext.id = "infobox";
        infotext.style.top = "20px";
        infotext.style.left = "400px";
        infotext.style.position = "absolute";
    } else {

        if (!$('#autochat_chckbox')[0].checked || getNumPlayers()[0] == 0) {
            (getNumPlayers()[0] == 0) ? (message = "(Pause) No Players detected") : (message = "Auto Announcement Deactivated");
            $('#infobox')[0].innerHTML = "<span style='color: grey;'>" + message + "<br />"
                + "MotD: " + $('#autochat_chckbox')[0].checked + "&nbsp;&nbsp;Autorespond: " + $('#autorespond_chckbox')[0].checked + "<br />Message parts: " + ($('#autochat_txtbox').val()).split('; ').length + "</span>";

        } else {
            $('#infobox')[0].innerHTML = "<span style='color: limegreen;'>Next announcement: ~" + ($('#autochat_interval').val() - (iterations % $('#autochat_interval').val()) ).toFixed() + "s @" + $('#autochat_delay').val() + "s Delay<br />"
                + "MotD: " + $('#autochat_chckbox')[0].checked + "&nbsp;&nbsp;Autorespond: " + $('#autorespond_chckbox')[0].checked + "<br />Message parts: " + ($('#autochat_txtbox').val()).split('; ').length + "</span>";
        }
    }
}

// Function to scroll down
function getDown(targetid) {
    getNodeObj('id', targetid)[0].scrollTop = getNodeObj('id', targetid)[0].scrollHeight;
}

// Helper for easier use of delays when replacing
function replaceMe(old_obj, new_obj) {
    old_obj.innerHTML = new_obj;
    return new_obj;
}

/*
 ----- CALLING AND POLLING -----
 */

// This function is called every 1000ms, avoid using another interval within this function
// You can use conditions and breakLoop(seconds) inbetween for a sleep phase
// Checkbox "Auto send messages" enables auto announcing, Checkbox "Autoresponder" enables auto answering
var iterations = 0;
function checkTheStuff() {
    iterations++;

    addStatusDiv(iterations);
    var datum = new Date();
    var zeit = datum.getTime() / 1000;

    var last_message_id = getAllMessages().length - 1;
    var last_message = getPlayerMessage(last_message_id);
    var last_teamcolor = getNodeObj('class', 'teamcolor')[last_message_id].innerHTML;
    var last_player = getPlayerName(last_message_id);
    //    console.log("Chat messages loaded: " + (last_message_id +1));

    if (getNumPlayers()[0] > 0 && (!isDefined(autoMsgSent) || autoMsgSent == "0") && iterations % $('#autochat_interval').val() === 0 && $('#autochat_chckbox')[0].checked) {
        // breakLoop(7); // 7 sec sleep (freezes UI)
        var autoMsgSent = "1";
        setTimeout(postAutoMessage($('#autochat_txtbox').val()), 500);
        setTimeout(getDown('content'), (lat_message_id + 1) * jan_delay);
    } else {
        var autoMsgSent = "0";
    }

    if (getNumPlayers()[0] > 0 && Math.round(zeit) % 17 == 0) {
        console.log('Players detected, increased GameSummary refresh rate');
        refreshGameSummary();
    }

    var currWave = getWaveStatus()[0];
    var restZeds = getWaveStatus()[2] - getWaveStatus()[1];
    if (restZeds < 20 && restZeds > 10 && currWave > 3 && !last_teamcolor.includes(img_ignored) && iterations % 10 == 0) {
        postResponseMessage("---ZEDS WILL RAGE SOON---");
        refreshGameSummary();
    }


    // Check for double posts by same person (maybe useful later)
    //    var msg_prev = [getPlayerName(last_message-1),getPlayerMessage(last_message-1)];
    //    var msg_new = [getPlayerName(last_message),getPlayerMessage(last_message)];
    //    console.log("Old msg: " + msg_prev + "\nNew msg: " + msg_new);
    //    if (msg_new != msg_prev) {
    //        var msg_chng = msg_new;
    //    } else {
    //        var msg_chng = [0,0];
    //    }


    // The following routines could be extended to check the whole message array (or last 5 entries or so) and add status icons
    // to each message parsed / ignored. While that would allow for a check of all messages, it could cause problems
    // when refreshing the page. Some kind of function for an internal todo-Queue would be better but feels unneccessary complicated
    // Right now only the last message is parsed. When too many people chat it just gets ignored.. could be used to troll mapvotes
    // if the troll knows the internal cooldown and keeps spamming to make the others not being parsed.. ..though that could be prevented
    // by either ignoring certain messages or ignoring certain commands.. or reiterating the all_messages array just for voting
    var latest_msg_parsed = "NEGATIVE";
    if (last_teamcolor.includes('base64') && !last_teamcolor.includes(img_tocheck)) {
        latest_msg_parsed = 'AFFIRMATIVE';
    } else if (last_player == chatbot_user || !$('#autorespond_chckbox')[0].checked) {
        latest_msg_parsed = 'ignored';
        getNodeObj('class', 'teamcolor')[last_message_id].innerHTML = '<img src="' + img_ignored + '" />';

        // For later use, in case parsing for all messages instead of just last one is active
        //    } else if (last_teamcolor.includes(img_tocheck)) {
        //
        //        latest_msg_parsed = 'PENDING';
        //    } else {
        //        getNodeObj('class', 'teamcolor')[last_message_id].innerHTML = '<img src="'+img_tocheck+'" />';
    }
    // console.log("Latest msg parsed? " + latest_msg_parsed);


    if (isDefined(last_message) && (!last_teamcolor.includes('base64') || (last_teamcolor.includes('base64') && last_teamcolor.includes(img_tocheck))) && last_player != chatbot_user && $('#autorespond_chckbox')[0].checked) {
        console.log("New msg for testing: " + last_player + ": " + last_message);
        parseMessage(last_message, last_message_id);
        setTimeout(getDown('content'), 5000);
    }
}


/*
 ----- ENTRY POINT -----
 */

// Check and modify current page
checkUrl();
// Call check script once a second
setTimeout(setInterval(checkTheStuff, 1000), 5000);