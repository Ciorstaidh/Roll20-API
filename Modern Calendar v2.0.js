// Calendar and down day counter for modern settings
// Created by Kirsty (https://app.roll20.net/users/1165285/kirsty)

// API Commands:
// !cal - for the GM displays the menu in the chat window, for a player displays date and weather

// Red Colour: #7E2D40

var Calendar = Calendar || (function() {
    'use strict';
    
    var version = '1.0',
    
    setDefaults = function() {
        state.Calendar = {
            now: {
                ordinal: 1,
                year: 2017,
                weather: "It is a cool but sunny day."
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
        var divstyle = 'style="width: 189px; border: 1px solid black; background-color: #ffffff; padding: 5px;"'
        var astyle = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070;';
        var tablestyle = 'style="text-align:center;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        var nowdate = getdate(state.Calendar.now.ordinal).split(',');
        var month = nowdate[0];
        var day = nowdate[1];
        
        sendChat('Calendar', '/w gm <div ' + divstyle + '>' + //--
            '<div ' + headstyle + '>Calendar</div>' + //--
            '<div ' + substyle + '>Menu</div>' + //--
            '<div ' + arrowstyle + '></div>' + //--
            '<table>' + //--
            '<tr><td>Day: </td><td><a ' + astyle + '" href="!setday,?{Day?|1},' + month +'">' + day + '</a></td></tr>' + //--
            '<tr><td>Month: </td><td><a ' + astyle + '" href="!setmonth,' + day + ',?{Month|January|February|March|April|May|June|July|August|September|October|November|December}">' + month + '</a></td></tr>' + //--
            '<tr><td>Year: </td><td><a ' + astyle + '" href="!setyear,?{Year?|2017}">' + state.Calendar.now.year + '</a></td></tr>' + //--
            '<tr><td>Ordinal: </td><td><a ' + astyle + '" href="!setordinal,?{Ordinal?|1}">' + state.Calendar.now.ordinal + '</a></td></tr>' + //--
            '</table>' + //--
            '<br>Weather: ' + state.Calendar.now.weather + //--
            '<br><br><div style="text-align:center;"><a ' + astyle + '" href="!addday,?{Days to add?|1}">Advance the Date</a></div>' + //--
            '<div style="text-align:center;"><a ' + astyle + '" href="!weather">Roll Weather</a></div>' + //--
            '<div style="text-align:center;"><a ' + astyle + '" href="!playercal">Show to Players</a></div>' + //--
            '</div>'
        );
    },
    
    showcal = function(msg) {
        var nowdate = getdate(state.Calendar.now.ordinal).split(',');
        var month = nowdate[0];
        var day = nowdate[1];
        var suffix = getsuffix(day);
        var divstyle = 'style="width: 189px; border: 1px solid black; background-color: #ffffff; padding: 5px;"'
        var astyle = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070;';
        var tablestyle = 'style="text-align:center;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        
        sendChat(msg.who, '<div ' + divstyle + '>' + //--
            '<div ' + headstyle + '>Calendar</div>' + //--
            '<div ' + substyle + '>Player View</div>' + //--
            '<div ' + arrowstyle + '></div>' + //--
            day + suffix + ' ' + month + ', ' + state.Calendar.now.year + //--
            '<br><br>Today\'s weather:<br>' + state.Calendar.now.weather
        );
    },
    
    getdate = function(options){
        var day = Number(options);
        var date;
        var month;
        
        if(day>0 && day<=31){
            month="January"; 
            date=day;
        }else if(day>31 && day<=59){
            month="February"; 
            date=day-31;
        }else if(day>59 && day<=90){
            month="March"; 
            date=day-59;
        }else if(day>90 && day<=120){
            month="April";
            date=day-90;
        }else if(day>120 && day<=151){
            month="May";
            date=day-120;
        }else if(day>151 && day<=181){
            month="June";
            date=day-151;
        }else if(day>181 && day<=212){
            month="July";
            date=day-181;
        }else if(day>212 && day<=243){
            month="August";
            date=day-212;
        }else if(day>243 && day<=273){
            month="September";
            date=day-243;
        }else if(day>273 && day<=304){
            month="October";
            date=day-273;
        }else if(day>304 && day<=334){
            month="November"
            date=day-304;
        }else if(day>334 && day<=365){
            month="December";
            date=day-334;
        }else{
            month="January";
            date='1';
        }
    
        var array=month+','+String(date);
        return array;    
    },
    
    getordinal = function(options){
        var args = options.content.split(",");
        var date = Number(args[1]);
        var month = args[2];
        var ordinal = state.Calendar.now.ordinal;
        
        switch(month) {
            case 'January':
                ordinal = date;
                break;
            case 'February':
                ordinal = 31+date;
                break;
            case 'March':
                ordinal = 59+date;
                break;
            case 'April':
                ordinal = 90+date;
                break;
            case 'May':
                ordinal = 120+date;
                break;
            case 'June':
                ordinal = 151+date;
                break;
            case 'July':
                ordinal = 181+date;
                break;
            case 'August':
                ordinal = 212+date;
                break;
            case 'September':
                ordinal = 243+date;
                break;
            case 'October':
                ordinal = 273+date;
                break;
            case 'November':
                ordinal = 304+date;
                break;
            case 'December':
                ordinal = 365+date;
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

    addday = function(add) {
        var ordinal = Number(add)
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
        
        if(ordinal > 334 || ordinal <= 90){
            season = 'Winter'
        }else if(ordinal > 90 && ordinal <= 151 ){
            season = 'Spring'
        }else if(ordinal > 151 && ordinal <= 243 ){
            season = 'Summer'
        }else if(ordinal > 243 && ordinal <= 334 ){
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
