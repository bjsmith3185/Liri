

var request = require("request");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var moment = require("moment");
var fs = require("fs");
var cmd = require('node-cmd');
var chalk = require('chalk');
var operation = process.argv[2];
var userSearch = process.argv;
var searchString = "";

searchString = process.argv[3];

if (userSearch.length > 4) {
    for (i = 4; i < userSearch.length; i++) {
        searchString += ("+" + userSearch[i]);
    }
};

if (operation === "concert-this") {
    postSearchRequest();

    request("https://rest.bandsintown.com/artists/" + searchString + "/events?app_id=codingbootcamp", function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            //   console.log(JSON.stringify(response, null, 2));
            console.log(chalk.yellow("Artist(s): " + JSON.parse(body)[0].lineup));
            console.log("Venue: " + JSON.parse(body)[0].venue.name);
            console.log("Location: " + JSON.parse(body)[0].venue.city);
            console.log("Date: " + moment(JSON.parse(body)[0].datetime).format("MM/DD/YYYY"));

            //------ posting the search results to the log-----------
            fs.appendFile("log.txt", `Artist(s): ${JSON.parse(body)[0].lineup}
            "Venue: ${JSON.parse(body)[0].venue.name}
            Location: ${JSON.parse(body)[0].venue.city}
            Date: ${moment(JSON.parse(body)[0].datetime).format("MM/DD/YYYY")}
            `, function (err) {

                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log("Content Added!");
                    }
                });

        };

    });



} else if (operation === "movie-this") {
    postSearchRequest();
    // Then run a request to the OMDB API with the movie specified
    request("http://www.omdbapi.com/?t=" + searchString + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            console.log(chalk.red("The movie's title is: " + JSON.parse(body).Title));
            console.log("The movie was made in " + JSON.parse(body).Year);
            console.log("The movie's imbd rating is " + JSON.parse(body).imdbRating);
            console.log("The movie's rotten Tomatoes rating is: " + JSON.parse(body).Ratings[1].Value);
            console.log("The movie was made in: " + JSON.parse(body).Country);
            console.log("The movie's language is: " + JSON.parse(body).Language);
            console.log("The movie's main actors: " + JSON.parse(body).Actors);
            console.log(chalk.blue("The movie's plot: " + JSON.parse(body).Plot));
            
            //------ posting the search results to the log-----------
            fs.appendFile("log.txt", `The movie's title is: ${JSON.parse(body).Title}
            The movie was made in ${JSON.parse(body).Year}
            The movie's imbd rating is ${JSON.parse(body).imdbRating}
            The movie's rotten Tomatoes rating is: ${JSON.parse(body).Ratings[1].Value}
            The movie was made in: ${JSON.parse(body).Country}
            The movie's language is: ${JSON.parse(body).Language}
            The movie's plot: ${JSON.parse(body).Plot}
            The movie's main actors: ${JSON.parse(body).Actors}
            `, function (err) {

                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log("Content Added!");
                    }
                });
        }
    });

} else if (operation === "spotify-this-song") {
    postSearchRequest();
    if (!searchString) {
        console.log(chalk.red("you didnt enter a song, so you get...."));
        // load "ace of base" ------
        var spotify = new Spotify(keys.spotify);
        spotify.search({ type: 'track', query: `"The Sign" Ace of Base`, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            var song = data.tracks.items[0];
            console.log(`
            Artist: ${song.album.artists[0].name}
            Song: ${song.name}
            Preview: ${song.preview_url}
            Album: ${song.album.name}`);
            //------ posting the search results to the log-----------
            fs.appendFile("log.txt", `
            Artist: ${song.album.artists[0].name}
            Song: ${song.name}
            Album: ${song.album.name}
            Preview: ${song.preview_url}
            `, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        // console.log("Content Added to ace of base!");
                    }
                });
        });

    } else {
        var spotify = new Spotify(keys.spotify);
       
        spotify.search({ type: 'track', query: searchString, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            var song = data.tracks.items[0];
            console.log(`
            Artist: ${song.album.artists[0].name}
            Song: ${song.name}
            Preview: ${song.preview_url}
            Album: ${song.album.name}`);
            //------ posting the search results to the log-----------
            fs.appendFile("log.txt", `
            Artist: ${song.album.artists[0].name}
            Song: ${song.name}
            Album: ${song.album.name}
            Preview: ${song.preview_url}
            `, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        // console.log("Content Added to spotify your search!");
                    }
                });
        });
    }






} else if (operation === "do-what-it-says") {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        operation = dataArr[0];
        searchString = dataArr[1];
  
        cmd.get(
            `node liri.js ${operation} ${searchString}`,
            function (err, data, stderr) {
            }
        );
    });
};



function postSearchRequest() {
    fs.appendFile("log.txt", `

    Operation: ${operation}
    Search keyword: ${searchString}
        Results:
        `, function (err) {

            if (err) {
                console.log(err);
            }

            else {
                // console.log("Content Added during search post!");
            }
        });
};



















