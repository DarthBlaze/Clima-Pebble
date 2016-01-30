/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');

var ajax = require('ajax');
var ajax2 = require('ajax');

var main = new UI.Card({
    title: 'Clima',
    body: 'Obteniendo informacion...'
});

var splashWindow = new UI.Window();

// Text element to inform user
var text = new UI.Text({
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    text: 'Obteniendo informacion...',
    font: 'GOTHIC_28_BOLD',
    color: 'black',
    textOverflow: 'wrap',
    textAlign: 'center',
    backgroundColor: 'white'
});

//main.show();
// Add to splashWindow and show
splashWindow.add(text);
splashWindow.show();

//Ajax server request
var myAPIKey = 'f1ea1a7beaa7469e8cf59161d4716aed';

var cityName = 'Santo Domingo';

var URL = 'http://api.openweathermap.org/data/2.5/weather?q=' +
    cityName + '&appid=' + myAPIKey + '&lang=sp';



ajax({
        url: URL,
        type: 'json'
    },
    function(data) {
        // Success!
        console.log('Successfully fetched weather data!');

        var location = data.name;
        var temperature = Math.round(data.main.temp - 273.15) + ' °C';

        // Always upper-case first letter of description
        var description = data.weather[0].description;
        description = description.charAt(0).toUpperCase() + description.substring(1);

        //Show Data to User
        main.title(location);
        main.subtitle(temperature);
        main.body(description);
        main.show();
        splashWindow.hide();
    },
    function(error) {
        // Failure!
        console.log('Failed fetching weather data: ' + error);
    }
);

var URLforecast = 'http://api.openweathermap.org/data/2.5/forecast?q=' +
    cityName + '&appid=' + myAPIKey + '&lang=sp';

var resultsMenu;

ajax2({
        url: URLforecast,
        type: 'json'
    },
    function(data) {
        var parseFeed = function(data, quantity) {
            var items = [];
            for (var i = 0; i < quantity; i++) {
                // Always upper case the description string
                var title = data.list[i].weather[0].main;
                title = title.charAt(0).toUpperCase() + title.substring(1);

                // Get date/time substring
                var time = data.list[i].dt_txt;
                time = time.substring(time.indexOf('-') + 1, time.indexOf(':') + 3);

                // Add to menu items array
                items.push({
                    title: title,
                    subtitle: time
                });
            }

            // Finally return whole array
            return items;
        };

        // Create an array of Menu items
        var menuItems = parseFeed(data, 10);

        // Check the items are extracted OK
        for (var i = 0; i < menuItems.length; i++) {
            console.log(menuItems[i].title + ' | ' + menuItems[i].subtitle);
        }

        // Construct Menu to show to user
        resultsMenu = new UI.Menu({
            sections: [{
                title: 'Current Forecast',
                items: menuItems
            }]
        });				
        // Show the Menu, hide the splash

        splashWindow.hide();
    },
    function(error) {
        console.log('Download failed: ' + error);
    }
);


main.on('click', 'select', function(e) {
    resultsMenu.show();
});