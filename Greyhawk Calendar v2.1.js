// Calendar and down day counter for Greyhawk
// Created by Kirsty (https://app.roll20.net/users/1165285/kirsty)
// Greyhawk and moon additions by Brusana (https://app.roll20.net/users/273644/brusana)

// API Commands:
// !cal - for the GM displays the menu in the chat window, for a player displays date, weather and down days

// Red Colour: #7E2D40

var Calendar = Calendar || (function() {
    'use strict';
    
    var version = '2.0',
    
    setDefaults = function() {
        state.Calendar = {
            now: {
                ordinal: 1,
                year: 595,
                down: 0,
                divider: 1,
                weather: "It is a cool but sunny day",
				luna: 'is waning',
				celene: 'is waxing'
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
					getmoons();
                    calmenu();
                    break;
                case '!setmonth':
                    getordinal(msg);
                    weather();
					getmoons();
                    calmenu();
                    break;
                case '!setyear':
                    state.Calendar.now.year=args[1];
                    calmenu();
                    break;
                case '!setordinal':
                    state.Calendar.now.ordinal=args[1];
					getmoons();
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
					getmoons();
                    calmenu();
                    break;
                case '!weather':
                    state.Calendar.now.weather=args[1];
					getmoons();                    
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
        var down = state.Calendar.now.down;
        down = getdown(down);
        var nowdate = getdate(state.Calendar.now.ordinal).split(',');
        var month = nowdate[0];
        var day = nowdate[1];
        var dofw = nowdate[2];
		var grammar = nowdate[3];
		
        sendChat('Calendar', '/w gm <div ' + divstyle + '>' + //--
            '<div ' + headstyle + '>Calendar</div>' + //--
            '<div ' + substyle + '>Menu</div>' + //--
            '<div ' + arrowstyle + '></div>' + //--
            '<table>' + //--
            '<tr><td>Day: </td><td><a ' + astyle + '" href="!setday,?{Day?|1},' + month +'">' + day + '</a></td></tr>' + //--
            '<tr><td>Month: </td><td><a ' + astyle + '" href="!setmonth,' + day + ',?{Month|Needfest|Fire Seek|Readying|Coldeven|Growfest|Planting|Flocktime|Wealsun|Richfest|Reaping|Goodmonth|Harvester|Brewfest|Patchwall|Readyreat|Sunsebb}">' + month + '</a></td></tr>' + //--
			// '<tr><td>Weekday: </td><td>'+dofw+'</td></tr>'+ //-- In case we want the weekday up here
            '<tr><td>Year: </td><td><a ' + astyle + '" href="!setyear,?{Year?|595}">' + state.Calendar.now.year +' CY</a></td></tr>' + //--
            '<tr><td>Ordinal: </td><td><a ' + astyle + '" href="!setordinal,?{Ordinal?|1}">' + state.Calendar.now.ordinal + '</a></td></tr>' + //--
            '<tr><td>Weather: </td><td><a ' + astyle + '" href="!weather,?{Weather?| }">Set Weather</a></td></tr>' + //--
           // '<tr><td>Down Days: </td><td><a ' + astyle + '" href="!setdown,?{Down Days?|0}">' + down + '</a></td></tr>' + //--
           // '<tr><td>Down Day<br>Divider: </td><td><a ' + astyle + '" href="!setdiv,?{Down Day Divider?|1}">' + state.Calendar.now.div + '</a></td></tr>' + //--
            '</table>' + //--
			'<br>Weekday: '+dofw+ //--
			'<br>Luna ' + state.Calendar.now.luna + //--
            '<br>Celene ' + state.Calendar.now.celene + //--
			'<br><br>Weather: ' + state.Calendar.now.weather + //--
            '<br><br><div style="text-align:center;"><a ' + astyle + '" href="!addday,?{Days to add?|1}">Advance the Date</a></div>' + //--
          //  '<div style="text-align:center;"><a ' + astyle + '" href="!weather">Roll Weather</a></div>' + //--
            '<div style="text-align:center;"><a ' + astyle + '" href="!playercal">Show to Players</a></div>' + //--
            '</div>'
        );
    },
    
    showcal = function(msg) {
        var nowdate = getdate(state.Calendar.now.ordinal).split(',');
        var month = nowdate[0];
        var day = nowdate[1];
        var dofw = nowdate[2];
		var grammar = nowdate[3];
        var down = state.Calendar.now.down;
            down = getdown(down);
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
            day + suffix + ' of ' + month +', '+grammar+' '+dofw+', ' + state.Calendar.now.year+' CY' + //--
			'<br><br>' + //--
            'Luna ' + state.Calendar.now.luna + //--
			'<br>' + //--
            'Celene ' + state.Calendar.now.celene + //--
           // '<br>Players have ' + down + ' down days.' + //--
            '<br><br>Today\'s weather:<br>' + state.Calendar.now.weather //--
        );
    },
    
    getdate = function(options){
        var day = Number(options);
        var date;
        var month;
        var dofw
		var grammar
		
        if(day>0 && day<=7){
            month="Needfest"; 
            date=day;
        }else if(day>7 && day<=35){
            month="Fire Seek"; 
            date=day-7;
        }else if(day>35 && day<=63){
            month="Readying"; 
            date=day-35;
        }else if(day>63 && day<=91){
            month="Coldeven";
            date=day-63;
        }else if(day>91 && day<=98){
            month="Growfest";
            date=day-91;
        }else if(day>98 && day<=126){
            month="Planting";
            date=day-98;
        }else if(day>126 && day<=154){
            month="Flocktime";
            date=day-126;
        }else if(day>154 && day<=182){
            month="Wealsun";
            date=day-154;
        }else if(day>182 && day<=189){
            month="Richfest";
            date=day-182;
        }else if(day>189 && day<=217){
            month="Reaping";
            date=day-189;
        }else if(day>217 && day<=245){
            month="Goodmonth"
            date=day-217;
        }else if(day>245 && day<=273){
            month="Harvester";
            date=day-245;
        }else if(day>273 && day<=280){
            month="Brewfest";
            date=day-273;
        }else if(day>280 && day<=308){
            month="Patchwall";
            date=day-280;
        }else if(day>308 && day<=336){
            month="Readyreat";
            date=day-308;
        }else if(day>336 && day<=364){
            month="Sunsebb";
            date=day-336;
        }else{
            month="Needfest";
            date='1';
        }
		
		if(date == 1 || date == 8 || date == 15 || date == 22){  //--Determine the title of the day of the week
			grammar = 'a';
			dofw = 'Starday';
		}else if(date == 2 || date == 9 || date == 16 || date == 23){
			grammar = 'a';
			dofw = 'Sunday';
		}else if(date == 3 || date == 10 || date == 17 || date == 24){
			grammar = 'a';
			dofw = 'Moonday';
		}else if(date == 4 || date == 11 || date == 18 || date == 25){
			grammar = 'a';
			dofw = 'Godsday';
		}else if(date == 5 || date == 12 || date == 19 || date == 26){
			grammar = 'a';
			dofw = 'Waterday';
		}else if(date == 6 || date == 13 || date == 20 || date == 27){
			grammar = 'an';
			dofw = 'Earthday';
		}else if(date == 7 || date == 14 || date == 21 || date == 28){
			grammar = 'a';
			dofw = 'Freeday';
		}else{
			grammar = 'an';
			dofw = 'Unknown';
		}
		
        var array=month+','+String(date)+','+dofw+','+grammar;
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
            case 'Needfest':
                ordinal = date;
                break;
            case 'Fire Seek':
                ordinal = 7+date;
                break;
            case 'Readying':
                ordinal = 35+date;
                break;
            case 'Coldeven':
                ordinal = 63+date;
                break;
            case 'Growfest':
                ordinal = 91+date;
                break;
            case 'Planting':
                ordinal = 98+date;
                break;
            case 'Flocktime':
                ordinal = 126+date;
                break;
            case 'Wealsun':
                ordinal = 154+date;
                break;
            case 'Richfest': 
                ordinal = 182+date;
                break;
            case 'Reaping':
                ordinal = 189+date;
                break;
            case 'Goodmonth':
                ordinal = 217+date;
                break;
            case 'Harvester':
                ordinal = 245+date;
                break;
            case 'Brewfest':
                ordinal = 273+date;
                break;
            case 'Patchwall':
                ordinal = 280+date;
                break;
            case 'Readyreat':
                ordinal = 308+date;
                break;
            case 'Sunsebb':
                ordinal = 336+date;
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
        
        if(ordinal>364){
            ordinal=ordinal-364;
            state.Calendar.now.year = Number(state.Calendar.now.year)+1;
        }
        
        state.Calendar.now.ordinal = ordinal;
    },
    
    weather = function() {   //--Weather generator function is enabled again, and you can still set the weather
        var roll;
        var temperature;
        var wind;
        var precipitation;
        var season;
        var ordinal = state.Calendar.now.ordinal;
        
        if(ordinal > 336 || ordinal <= 35){
            season = 'Winter'
        }else if(ordinal > 35 && ordinal <= 98){
            season = 'Spring'
        }else if(ordinal > 98 && ordinal <=273 ){
            season = 'Summer'
        }else if(ordinal > 273 && ordinal <=336 ){
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
        
        var forecast=temperature+wind+precipitation;;
        state.Calendar.now.weather = forecast;
    },
	getmoons = function(){
		var celene_phase;
		var luna_phase;
		var ordinal = state.Calendar.now.ordinal;
		
		//-- Calcualte Luna's Phase //-- 
		if(ordinal>=4 && ordinal <11)
		{
			luna_phase = 'is new';
		}
		else if(ordinal>=32 && ordinal<39)
		{
			luna_phase = 'is new';
		}
		else if(ordinal>=60 && ordinal<67)
		{
			luna_phase = 'is new';		
		}
		else if(ordinal>=88 && ordinal<96)
		{
			luna_phase = 'is new';		
		}
		else if(ordinal>=116 && ordinal<123)
		{
			luna_phase = 'is new';		
		}
		else if(ordinal>=144 && ordinal<151)
		{
			luna_phase = 'is new';		
		}
		else if(ordinal>=172 && ordinal<179)
		{
			luna_phase = 'is new';		
		}
		else if(ordinal>=200 && ordinal<207)
		{
			luna_phase = 'is new';		
		}
		else if(ordinal>=228 && ordinal<238)
		{
			luna_phase = 'is new';		
		}
		else if(ordinal>=256 && ordinal<263)
		{
			luna_phase = 'is new';		
		}
		else if(ordinal>=284 && ordinal<291)
		{
			luna_phase = 'is new';		
		}
		else if(ordinal>=312 && ordinal<319)
		{
			luna_phase = 'is new';		
		}
		else if(ordinal>=340 && ordinal<347)
		{
			luna_phase = 'is new';		
		}
		else if(ordinal>=11 && ordinal<18)
		{ 
			luna_phase = 'is waxing';
		}
		else if(ordinal>=39  && ordinal<46)
		{ 
			luna_phase = 'is waxing';
		}
		else if(ordinal>=67  && ordinal<74)
		{ 
			luna_phase = 'is waxing';
		}
		else if(ordinal>=95  && ordinal<102)
		{ 
			luna_phase = 'is waxing';
		}
		else if(ordinal>=123  && ordinal<130)
		{ 
			luna_phase = 'is waxing';
		}
		else if(ordinal>=151  && ordinal<158)
		{ 
			luna_phase = 'is waxing';
		}
		else if(ordinal>=179  && ordinal<186)
		{ 
			luna_phase = 'is waxing';
		}
		else if(ordinal>=207  && ordinal<214)
		{ 
			luna_phase = 'is waxing';
		}
		else if(ordinal>=235  && ordinal<242)
		{ 
			luna_phase = 'is waxing';
		}
		else if(ordinal>=263  && ordinal<270)
		{ 
			luna_phase = 'is waxing';
		}
		else if(ordinal>=291  && ordinal<298)
		{ 
			luna_phase = 'is waxing';
		}
		else if(ordinal>=319  && ordinal<326)
		{ 
			luna_phase = 'is waxing';
		}
		else if(ordinal>=347 && ordinal<354)
		{ 
			luna_phase = 'is waxing';
		}
		else if(ordinal>=18 && ordinal<25)
		{ 
			luna_phase = 'is full';
		}
		else if(ordinal>=46 && ordinal<53)
		{ 
			luna_phase = 'is full';
		}
		else if(ordinal>=74 && ordinal<81)
		{ 
			luna_phase = 'is full';
		}
		else if(ordinal>=102 && ordinal<109)
		{ 
			luna_phase = 'is full';
		}
		else if(ordinal>=130 && ordinal<137)
		{ 
			luna_phase = 'is full';
		}
		else if(ordinal>=158 && ordinal<165)
		{ 
			luna_phase = 'is full';
		}
		else if(ordinal>=186 && ordinal<193)
		{		
			luna_phase = 'is full';
		}
		else if(ordinal>=214 && ordinal<221)
		{
			luna_phase = 'is full';
		}
		else if(ordinal>=242 && ordinal<249)
		{
			luna_phase = 'is full';
		}
		else if(ordinal>=270 && ordinal<277)
		{
			luna_phase = 'is full';
		}
		else if(ordinal>=298 && ordinal<305)
		{
			luna_phase = 'is full';
		}
		else if(ordinal>=326 && ordinal<333)
		{
			luna_phase = 'is full';
		}
		else if(ordinal>=354 && ordinal<361)
		{
			luna_phase = 'is full'; 
		}
		else if(ordinal>=1 && ordinal<4)
		{
			luna_phase = 'is waning';
		}
		else if(ordinal>=25 && ordinal<32)
		{
			luna_phase = 'is waning';
		}
		else if(ordinal>=53 && ordinal<60)
		{
			luna_phase = 'is waning';
		}
		else if(ordinal>=81 && ordinal<89)
		{
			luna_phase = 'is waning';
		}
		else if(ordinal>=109 && ordinal<116)
		{
			luna_phase = 'is waning';
		}
		else if(ordinal>=137 && ordinal<144)
		{
			luna_phase = 'is waning';
		}
		else if(ordinal>=165 && ordinal<172)
		{
			luna_phase = 'is waning';
		}
		else if(ordinal>=193 && ordinal<200)
		{
			luna_phase = 'is waning';
		}
		else if(ordinal>=221 && ordinal<228)
		{
			luna_phase = 'is waning';
		}
		else if(ordinal>=249 && ordinal<256)
		{
			luna_phase = 'is waning';
		}
		else if(ordinal>=277 && ordinal<284)
		{
			luna_phase = 'is waning';
		}
		else if(ordinal>=305 && ordinal<312)
		{
			luna_phase = 'is waning';
		}
		else if(ordinal>=333 && ordinal<340)
		{
			luna_phase = 'is waning';
		}
		else if(ordinal>=361 && ordinal<364)
		{
			luna_phase = 'is waning';
		}
		else
		{
			luna_phase = 'is missing from the night sky';
        }
		//-- Calcualte Celene's Phase //--  && 141<=ordinal<164 && 232<=ordinal<255 && 323<=ordinal<346)
		if(ordinal>=4 && ordinal<27)
		{
			celene_phase = 'is full';
		}
		else if(ordinal>=95 && ordinal<118)
		{
			celene_phase = 'is full';
		}
		else if(ordinal>=186 && ordinal<209)
		{
			celene_phase = 'is full';
		}
		else if(ordinal>=277 && ordinal<300)
		{
			celene_phase = 'is full';
		}
		else if(ordinal>=27 && ordinal<50)
		{
			celene_phase = 'is waning';
		}
		else if(ordinal>=118 && ordinal<141)
		{
			celene_phase = 'is waning';
		}
		else if(ordinal>=209 && ordinal<232)
		{
			celene_phase = 'is waning';
		}
		else if(ordinal>=300 && ordinal<323)
		{
			celene_phase = 'is waning';
		}
		else if(ordinal>=1 && ordinal < 4)
		{
			celene_phase = 'is waxing';
		}
		else if(ordinal>=73 && ordinal < 96)
		{
			celene_phase = 'is waxing';
		}
		else if(ordinal>=164 && ordinal < 187)
		{
			celene_phase = 'is waxing';
		}
		else if(ordinal>=255 && ordinal < 278)
		{
			celene_phase = 'is waxing';
		}
		else if( ordinal>=346 && ordinal < 364)
		{
			celene_phase = 'is waxing';
		}
		else if(ordinal>=50 && ordinal < 73)
		{
			celene_phase = 'is new';
		}
		else if(ordinal>=141 && ordinal<164)
		{
			celene_phase = 'is new';
		}
		else if(ordinal>=232 && ordinal<255)
		{
			celene_phase = 'is new';
		}
		else if(ordinal>=323 && ordinal<346)
		{
			celene_phase = 'is new';
		}
		else
		{
			celene_phase = 'is missing from the night sky';
		}
		state.Calendar.now.luna = luna_phase;
		state.Calendar.now.celene = celene_phase;
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
