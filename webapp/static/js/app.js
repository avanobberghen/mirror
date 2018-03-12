/**
 * @Author: Alexandre Vanobberghen <avanobberghen>
 * @Date:   11-Mar-2018
 * @Last modified by:   avanobberghen
 * @Last modified time: 12-Mar-2018
 */


// Set language
var language;

$(document).ready(function(){
  // Toggle between forcasts div
  jQuery(function toggleForecast() {
    var $els = $('.toggle'),
    i = 0,
    len = $els.length;

    $els.slice(1).hide();
    setInterval(function () {
      $els.eq(i).fadeOut(function () {
        i = (i + 1) % len
        $els.eq(i).fadeIn();
      })
    }, 7000)
  });

  randLang();
  startTime();
  getCurrentWeather();
  t1=setTimeout('getDailyForecast()', 500); //timeout to work around the error: the server responded with a status of 429 (OK)
  t2=setTimeout('getHourlyForecast()', 1000);

});

/**
 * Randomise the display language every 5 minutes
 */
 function randLang() {
  //var langOptions = ['en', 'fr', 'sw'];
  language = langOptions[Math.floor(Math.random() * langOptions.length)];
  t=setTimeout('randLang()', 60000 * 5);
}

var today;

/**
 * Create a Moment.js object to display the current time
 * and date and update the display every half second
 */
 function startTime() {
  var currentDateTime = new moment();
  currentDateTime.locale(language);
  $("#time").text(currentDateTime.format('HH:mm:ss'));
  // update daily quote when date changes
  if(currentDateTime.format('DD') != today) {
    getRandQuote();
    today = currentDateTime.format('DD');
  }
  $("#date").text(currentDateTime.format('dddd')+" "+currentDateTime.format('DD')+" "+currentDateTime.format('MMMM'));
  t=setTimeout('startTime()',500);
}

// openWeatherMap ID
//var cityId=your city ID;
//var OWMAppId='your openWeatherMap ID';

/**
 * Call the openweathermap weather API every 5 minutes
 * and retrieve the current weather
 */
 function getCurrentWeather(){
  $.getJSON("http://api.openweathermap.org/data/2.5/weather?id="+cityId+"&APPID="+OWMAppId+"&units=metric&lang="+language,function(data){
    console.log(data);
    $('#current-temp').text(Math.round(data.main.temp));
    $('#weather-desc').text(data.weather[0].description);
    $('#wind-speed').text(Math.round(data.wind.speed));
    $('#current-weather-icon').addClass(getIcon(data.weather[0].id));
  });
  setTimeout(getCurrentWeather, 60000 * 5);
}

/**
 * Call the openweathermap forecast API every 5 minutes
 * and retrieve the daily weather forecast
 */
 function getDailyForecast(){
  // Set the locale
  moment.locale(language);
  $.getJSON("http://api.openweathermap.org/data/2.5/forecast/daily?id="+cityId+"&APPID="+OWMAppId+"&units=metric&lang="+language,function(data){
    console.log(data);
    $('#daily-forecast').empty();
    for (i = 1; i <= 5; i++) {
      var dayName = moment.unix(data.list[i].dt).format('dd');
      var maxTemp = Math.round(data.list[i].temp.max);
      var minTemp = Math.round(data.list[i].temp.min);
      var iconClassName = getIcon(data.list[i].weather[0].id);
      $('#daily-forecast').append('<tr><td class="day-name-short">'+dayName+'</td>'+
        '<td><div>max </div><div>min </div></td>'+
        '<td><div>'+maxTemp+'</div><div>'+minTemp+'</div></td>'+
        '<td>ºC</td>'+
        '<td class="forecast-icon '+iconClassName+'"></td>'+
        '</tr>');
    }
  });
  setTimeout(getDailyForecast, 60000 * 5);
}

/**
 * Call the openweathermap forecast API every 5 minutes
 * and retrieve the hourly weather forecast
 */
 function getHourlyForecast(){
  $.getJSON("http://api.openweathermap.org/data/2.5/forecast?id="+cityId+"&APPID="+OWMAppId+"&units=metric&lang="+language,function(data){
    console.log(data);
    $('#hourly-forecast').empty();
    for (i = 1; i <= 5; i++) {
      var hour = moment(data.list[i].dt_txt).format('HH');
      var hourTemp = Math.round(data.list[i].main.temp);
      var iconClassName = getIcon(data.list[i].weather[0].id);
      $('#hourly-forecast').append('<tr><td class="next-3h">'+hour+'h</td>'+
       '<td><span class="next-3h-temp">'+hourTemp+'</span>ºC</td>'+
       '<td class="forecast-icon '+iconClassName+'"></td>'+
       '</tr>');
    }
  });
  setTimeout(getHourlyForecast, 60000 * 5);
}

/**
 * Take the openweathermap weather id as an argument
 * and map it to the matching icon listed in var weatherIcons
 */
 function getIcon(id) {
  var prefix = 'wi wi-';
  var icon = weatherIcons[id].icon;

  // If we are not in the ranges, add a day/night prefix.
  if (!(id > 699 && id < 800) && !(id > 899 && id < 1000)) {
    icon = 'day-' + icon;
  }

  // Finally tack on the prefix.
  icon = prefix + icon;
  return icon;
}

/* code from http://cs.wellesley.edu/~mashups/pages/am4calendar.html */

// Global variables, the values come from the Developer Console
// Put your OWN clientID and apiKey
//var clientId = 'your client ID';
//var apiKey = 'your API ID';
var scopes = 'https://www.googleapis.com/auth/calendar.readonly';


/* Function invoked when the client javascript library is loaded */
function handleClientLoad() {
  console.log("Inside handleClientLoad ...");
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth,100);
}

/* API function to check whether the app is authorized. */
function checkAuth() {
  console.log("Inside checkAuth ...");
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true},
    handleAuthResult);
}

/* Invoked by different functions to handle the result of authentication checks.*/
function handleAuthResult(authResult) {
  console.log("Inside handleAuthResult ...");
  var authorizeButton = document.getElementById('authorize-button');
  if (authResult && !authResult.error) {
    authorizeButton.style.visibility = 'hidden';
          //load the calendar client library
          gapi.client.load('calendar', 'v3', listUpcomingEvents);
        } else {
          authorizeButton.style.visibility = '';
          authorizeButton.onclick = handleAuthClick;
        }
      }

      /* Event handler that deals with clicking on the Authorize button.*/
      function handleAuthClick(event) {
        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false},
          handleAuthResult);
        return false;
      }

      /* End of code from http://cs.wellesley.edu/~mashups/pages/am4calendar.html */


/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
 function listUpcomingEvents() {
  var request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  });
  request.execute(function(resp) {
    $('#events').empty();
    var events = resp.items;
    if (events.length > 0) {
      for (i = 0, j = 1; i < events.length; i++, j++) {
        var event = events[i];
        var time = '('+moment(event.start.dateTime).format('HH:mm')+')';
        var date = event.start.dateTime;
        if (!date) {
          date = event.start.date;
          time ='';
        }
        $('#events').append('<tr><td>'+moment(date).format('dd')+
          '</td><td class="event-desc"><span>'+moment(date).format('DD')+'/'+moment(date).format('MM')+
          '</td><td class="event-desc"><span>'+event.summary+'</span><span> '+time+'</span></td></tr>');
      }
    }
  });
}

function getRandQuote() {
  // $.getJSON("http://quotes.rest/qod.json", function(data) {
    $.getJSON("https://www.reddit.com/r/Showerthoughts/top/.json?sort=top&t=day", function(data) {
      console.log(data);
      $("#quote").empty();
    // $("#quote").append(data.contents.quotes[0].quote + "<p>&mdash; " + data.contents.quotes[0].author + "</p>");
    $("#quote").append("Shower thought: " + data.data.children[0].data.title);
  });
  }
