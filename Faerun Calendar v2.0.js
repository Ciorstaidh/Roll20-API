// Calendar and down day counter for Faerun
// Created by Kirsty (https://app.roll20.net/users/1165285/kirsty)

// API Commands:
// !cal - for the GM displays the menu in the chat window, for a player displays date, weather and down days

// Red Colour: #7E2D40

var Calendar = Calendar || (function() {
    'use strict';
    
    var version = '0.1.0',
    
    setDefaults = function() {
        state.Calendar = {
            now: {
                ordinal: 1,
                year: 1486,
                down: 0,
                divider: 1,
                weather: "It is a cool but sunny day"
            },
        };
    },
   
    handleInput = function(msg) {
        var args = msg.content.split(",");
        
        if (msg.type !== "api") {
			return;
		}
		
		if(playerIsGM(msg.playerid)){
		    switch(args[0]) {
		        case '!cal':
                    calmenu();
                    break;
                case '!setday':
                    getordinal(msg);
                    weather();
                    calmenu();
                    break;
                case '!setmonth':
                    getordinal(msg);
                    weather();
                    calmenu();
                    break;
                case '!setyear':
                    state.Calendar.now.year=args[1];
                    calmenu();
                    break;
                case '!setordinal':
                    state.Calendar.now.ordinal=args[1];
                    calmenu();
                    break;
                case '!setdown':
                    var down = Number(args[1]);
                    state.Calendar.now.down = down;
                    getdown(down);
                    calmenu();
                    break;
                case '!setdiv':
                    state.Calendar.now.div=Number(args[1]);
                    calmenu();
                    break;
                case '!addday':
                    addday(args[1]);
                    weather();
                    calmenu();
                    break;
                case '!weather':
                    weather();
                    calmenu();
                    break;
                case '!playercal':
                    showcal(msg);
                    break;
    	    }
		}else if(args[0]=='!cal'){
		    showcal(msg);
		}
    },
    
    calmenu = function() {
        var astyle = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40;border-radius: 4px;  box-shadow: 1px 1px 1px #707070;';
        var tablestyle = 'style="text-align:center;"';
        var down = state.Calendar.now.down;
        down = getdown(down);
        var nowdate = getdate(state.Calendar.now.ordinal).split(',');
        var month = nowdate[0];
        var day = nowdate[1];
        
        sendChat('Calendar', '/w gm &{template:npcaction} {{rname=Calendar}} {{name=Menu}} {{description=<table>' + //--
            '<tr><td>Day: </td><td><a ' + astyle + '" href="!setday,?{Day?|1},' + month +'">' + day + '</a></td></tr>' + //--
            '<tr><td>Month: </td><td><a ' + astyle + '" href="!setmonth,' + day + ',?{Month|Hammer|Midwinter|Alturiak|Ches|Tarsakh|Greengrass|Mirtul|Kythorn|Flamerule|Midsummer|Eleasias|Eleint|Highharvestide|Marpenoth|Uktar|Feast of the Moon|Nightal}">' + month + '</a></td></tr>' + //--
            '<tr><td>Year: </td><td><a ' + astyle + '" href="!setyear,?{Year?|1486}">' + state.Calendar.now.year + '</a></td></tr>' + //--
            '<tr><td>Ordinal: </td><td><a ' + astyle + '" href="!setordinal,?{Ordinal?|1}">' + state.Calendar.now.ordinal + '</a></td></tr>' + //--
            '<tr><td>Down Days: </td><td><a ' + astyle + '" href="!setdown,?{Down Days?|0}">' + down + '</a></td></tr>' + //--
            '<tr><td>Down Day<br>Divider: </td><td><a ' + astyle + '" href="!setdiv,?{Down Day Divider?|1}">' + state.Calendar.now.div + '</a></td></tr>' + //--
            '</table>' + //--
            '<br>Weather: ' + state.Calendar.now.weather + //--
            '<br><br><div style="text-align:center;"><a ' + astyle + '" href="!addday,?{Days to add?|1}">Advance the Date</a></div>' + //--
            '<div style="text-align:center;"><a ' + astyle + '" href="!weather">Roll Weather</a></div>' + //--
            '<div style="text-align:center;"><a ' + astyle + '" href="!playercal">Show to Players</a></div>' + //--
            '}}'
        );
    },
    
    showcal = function(msg) {
        var nowdate = getdate(state.Calendar.now.ordinal).split(',');
        var month = nowdate[0];
        var day = nowdate[1];
        var down = state.Calendar.now.down;
            down = getdown(down);
        var suffix = getsuffix(day);
        
        sendChat(msg.who, '&{template:npcaction} {{rname=Calendar}} {{name=Player View}} {{description=' + //--
            day + suffix + ' ' + month + ', ' + state.Calendar.now.year + //--
            '<br>Players have ' + down + ' down days.' + //--
            '<br><br>Today\'s weather:<br>' + state.Calendar.now.weather + //--
            '}}'
        );
    },
    
    getdate = function(options){
        var day = Number(options);
        var date;
        var month;
        
        if(day>0 && day<=30){
            month="Hammer"; 
            date=day;
        }else if(day==31){
            month="Midwinter"; 
            date='festival';
        }else if(day>31 && day<=61){
            month="Alturiak"; 
            date=day-31;
        }else if(day>61 && day<=91){
            month="Ches";
            date=day-61;
        }else if(day>91 && day<=121){
            month="Tarsakh";
            date=day-91;
        }else if(day==122){
            month="Greengrass";
            date='festival';
        }else if(day>122 && day<=152){
            month="Mirtul";
            date=day-122;
        }else if(day>152 && day<=182){
            month="Kythorn";
            date=day-152;
        }else if(day>182 && day<=212){
            month="Flamerule";
            date=day-182;
        }else if(day==213){
            month="Midsummer";
            date='festival';
        }else if(day>213 && day<=243){
            month="Eleasias"
            date=day-213;
        }else if(day>243 && day<=273){
            month="Eleint";
            date=day-243;
        }else if(day==274){
            month="Highharvestide";
            date='festival';
        }else if(day>274 && day<=304){
            month="Marpenoth";
            date=day-274;
        }else if(day>304 && day<=334){
            month="Uktar";
            date=day-304;
        }else if(day==335){
            month="Feast of the Moon";
            date='festival';
        }else if(day>335 && day<=365){
            month="Nightal";
            date=day-335;
        }else{
            month="Hammer";
            date='1';
        }
    
        var array=month+','+String(date);
        return array;    
    },
    
    getordinal = function(options){
        var args = options.content.split(",");
        var date = args[1];
        var month = args[2];
        var ordinal = state.Calendar.now.ordinal;
        
        if(date == 'festival'){
            date = 1;
        }else{
            date = Number(args[1]);
        }
        
        switch(month) {
            case 'Hammer':
                ordinal = date;
                break;
            case 'Midwinter':
                ordinal = 31;
                break;
            case 'Alturiak':
                ordinal = 31+date;
                break;
            case 'Ches':
                ordinal = 61+date;
                break;
            case 'Tarsakhs':
                ordinal = 91+date;
                break;
            case 'Greengrass':
                ordinal = 122;
                break;
            case 'Mirtul':
                ordinal = 122+date;
                break;
            case 'Kythorn':
                ordinal = 152+date;
                break;
            case 'Flamerule':
                ordinal = 182+date;
                break;
            case 'Midsummer':
                ordinal = 213;
                break;
            case 'Eleasias':
                ordinal = 213+date;
                break;
            case 'Eleint':
                ordinal = 243+date;
                break;
            case 'Highharvestide':
                ordinal = 274;
                break;
            case 'Marpenoth':
                ordinal = 274+date;
                break;
            case 'Uktar':
                ordinal = 304+date;
                break;
            case 'Feast of the Moon':
                ordinal = 334+date;
                break;
            case 'Nightal':
                ordinal = 335+date;
                break;
            }
        state.Calendar.now.ordinal = ordinal;
    },
    
    getsuffix = function(day) {
        
        var date = Number(day)
        var suffix
        
        if (date == 1 || date == 21 ){
            suffix = 'st';
        }else if (date == 2 || date == 22){
            suffix = 'nd';
        }else if (date == 3 || date == 23){
            suffix = 'rd';
        }else{
            suffix = 'th';
        }
        
        return suffix;
    },
    
    getdown = function(days) {
        var down = Number(days)
        down = Math.floor(down/state.Calendar.now.div);
        return down;
    },
    
    addday = function(add) {
        var ordinal = Number(add)
        state.Calendar.now.down = Number(state.Calendar.now.down)+ordinal
        ordinal = ordinal + Number(state.Calendar.now.ordinal);
        
        if(ordinal>365){
            ordinal=ordinal-365;
            state.Calendar.now.year = Number(state.Calendar.now.year)+1;
        }
        
        state.Calendar.now.ordinal = ordinal;
    },
    
    weather = function() {
        var roll;
        var temperature;
        var wind;
        var precipitation;
        var season;
        var ordinal = state.Calendar.now.ordinal;
        
        if(ordinal > 349 || ordinal <= 75){
            season = 'Winter'
        }else if(ordinal > 75 && ordinal <= 166){
            season = 'Spring'
        }else if(ordinal > 166 && ordinal <=257 ){
            season = 'Summer'
        }else if(ordinal > 257 && ordinal <=349 ){
            season = 'Fall'
        }
        
        roll = Math.floor(Math.random()*(20-1+1)+1);
        if(roll>=15 && roll<=17){
            switch(season) {
                case 'Winter':
                    temperature = 'It is a bitterly cold winter day. ';
                    break;
                case 'Spring':
                    temperature = 'It is a cold spring day. ';
                    break;
                case 'Summer':
                    temperature = 'It is a cool summer day. ';
                    break;
                case 'Fall':
                    temperature = 'It is a cold fall day. ';
                    break;
            }
        }else if(roll>=18 && roll<=20){
            switch(season) {
                case 'Winter':
                    temperature = 'It is a warm winter day. ';
                    break;
                case 'Spring':
                    temperature = 'It is a hot spring day. ';
                    break;
                case 'Summer':
                    temperature = 'It is a blisteringly hot summer day. ';
                    break;
                case 'Fall':
                    temperature = 'It is a hot fall day. ';
                    break;
            }
        }else{
            switch(season) {
                case 'Winter':
                    temperature = 'It is a cold winter day. ';
                    break;
                case 'Spring':
                    temperature = 'It is a mild spring day. ';
                    break;
                case 'Summer':
                    temperature = 'It is a hot summer day. ';
                    break;
                case 'Fall':
                    temperature = 'It is a mild fall day. ';
                    break;
            }
            
        }
        
        roll = Math.floor(Math.random()*(20-1+1)+1);
        if(roll>=15 && roll<=17){
            wind='There is a light breeze and ';
        }else if(roll>=18 && roll<=20){
            wind='There is a howling wind and ';
        }else{
            wind='The air is still and ';
        }
        
        roll = Math.floor(Math.random()*(20-1+1)+1);
        if(roll>=15 && roll<=17){
            precipitation="Light rain or snow.";
            if(season=='Winter'){
                precipitation = 'snow falls softly on the ground.';
            }else{
                precipitation = 'a light rain falls from the sky.';
            }
        }else if(roll>=18 && roll<=20){
            if(season=='Winter'){
                precipitation = 'snow falls thick and fast from the sky.';
            }else{
                precipitation = 'a torrential rain begins to fall.';
            }
        }else{
            roll = Math.floor(Math.random()*(2-1+1)+1);
            if(roll=1){
                precipitation = 'the sky is overcast.';
            }else{
                precipitation = 'the sky is clear.';
            }
        }
        
        var forecast=temperature+wind+precipitation;
        state.Calendar.now.weather = forecast;
    },
    
    checkInstall = function() {
        // Check if the Calendar property exists, creating it if it doesn't
        if( ! state.Calendar ) {
            setDefaults();
        }
    },
    
    registerEventHandlers = function() {
        on('chat:message', handleInput);
	};

	return {
	    CheckInstall: checkInstall,
		RegisterEventHandlers: registerEventHandlers
	};
	
}());

on("ready",function(){
	'use strict';
	Calendar.CheckInstall();
	Calendar.RegisterEventHandlers();
});