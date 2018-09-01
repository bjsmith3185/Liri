
// ---- bands in town ----

var request = require("request");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var moment = require("moment");
var fs = require("fs");

var cmd = require('node-cmd');

// first user input -----
var operation = process.argv[2];
console.log("process.argv [2]" + operation);
// second user input  -----
var userSearch = process.argv;
var searchString = "";

if (userSearch.length === 4) {
    searchString = process.argv[3];

} else if (userSearch.length > 4) {

    for (var i = 3; i < userSearch.length; i++) {
        searchString = searchString + " " + userSearch[i];
    }
    console.log("search-string" + searchString);

}

if (operation === "concert-this") {

    // console.log("https://rest.bandsintown.com/artists/" + searchString + "/events?app_id=codingbootcamp")
    // https://rest.bandsintown.com/artists/drake/events?app_id=codingbootcamp

    request("https://rest.bandsintown.com/artists/" + searchString + "/events?app_id=codingbootcamp", function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            //   console.log(JSON.stringify(response, null, 2));
            console.log("Artist(s): " + JSON.parse(body)[0].lineup);
            console.log("Venue: " + JSON.parse(body)[0].venue.name);
            console.log("Location: " + JSON.parse(body)[0].venue.city);
            console.log("Date: " + moment(JSON.parse(body)[0].datetime).format("MM/DD/YYYY"));
        };

    });



} else if (operation === "movie-this") {
    // Then run a request to the OMDB API with the movie specified
    request("http://www.omdbapi.com/?t=" + searchString + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            //   console.log(JSON.stringify(response, null, 2));

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            // console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
        }
        //   console.log(JSON.parse(body));

        console.log("The movie's title is: " + JSON.parse(body).Title);
        console.log("The movie was made in " + JSON.parse(body).Year);
        console.log("The movie's imbd rating is " + JSON.parse(body).imdbRating);
        console.log("The movie's rotten Tomatoes rating is: " + JSON.parse(body).Ratings[1].Value);
        console.log("The movie was made in: " + JSON.parse(body).Country);
        console.log("The movie's language is: " + JSON.parse(body).Language);
        console.log("The movie's plot: " + JSON.parse(body).Plot);
        console.log("The movie's main actors: " + JSON.parse(body).Actors);
    });

} else if (operation === "spotify-this-song") {

    if(!searchString) {
        console.log("you didnt enter a song, so you get....");
        // load "ace of base" ------
        var spotify = new Spotify(keys.spotify);
        spotify.search({ type: 'track', query: "the sign", limit: 20 }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
            var songData = data.tracks.items;
        // console.log(songData);
        for (var i = 0; i < songData.length; i++) {
            // console.log(songData[i].artists[0].name);
            if ((songData[i].artists[0].name) === "Ace of Base") {
                console.log("it matches");
                console.log(`
                Artist: ${songData[i].artists[0].name}
                Song: ${song[0].name}
                Album: ${songData[i].album.name}
                Preview: ${songData[i].preview_url}`);
                return;
            }
        }
          });

    } else {
        var spotify = new Spotify(keys.spotify);
        // var spotify = new Spotify({
        //     id: "d1dd394176784365a4b2991023279225",
        //     secret: "b67b278082324aa8929cd6cacf246d72"
        // });
    
        spotify.search({ type: 'track', query: searchString, limit: 1 }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
           
        //   console.log(data); 
            //   console.log(JSON.stringify(data, null, 2));
    
              var song = data.tracks.items;
            //   console.log(song);
    
            console.log(`
            Artist: ${song[0].artists[0].name}
            Song: ${song[0].name}
            Preview: ${song[0].preview_url}
            Album: ${song[0].album.name}`);
          });

    }

    

    


} else if (operation === "do-what-it-says") {

    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }
        var dataArr = data.split(",");

        // console.log(dataArr[0]);
        // console.log(dataArr[1]);

        cmd.get(
            `node liri.js ${dataArr[0]} ${dataArr[1]}`,
            function(err, data, stderr){
                console.log(data)
            }
      );

    });
};

















// require("dotenv").config();



// ---- spotify and spotify keys.js -----
// var keys = require("./keys.js");

// console.log(keys)

// var spotify = new Spotify(keys.spotify);
//---------------------------------------




