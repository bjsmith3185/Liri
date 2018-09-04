
// ---- liri using inquirer -----

var request = require("request");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var moment = require("moment");
var fs = require("fs");
var cmd = require('node-cmd');
var inquirer = require("inquirer");
var chalk = require('chalk');

var operation = "";
var searchString = "";

//------------------------------------------
inquirer
    .prompt([
        {
            type: "input",
            name: "name",
            message: "Enter your name."
        },

        {
            type: "list",
            name: "operationType",
            message: "What type of search would you like?",
            choices: ["Concert Details", "Movie Information", "Spotify Search", "Random Command"]
        },

    ])
    .then(function (inquirerResponse) {
        // if (inquirerResponse.choices) {
        // console.log(inquirerResponse.operationType);

        if (inquirerResponse.operationType === "Concert Details") {
            // console.log("Concert Details");
            operation = "concert-this";
            //-----------------------------------------------------------------------
            inquirer
                .prompt([

                    {
                        type: "input",
                        name: "searchString",
                        message: "Enter Artist Name."
                    },

                ])
                .then(function (inquirerResponse) {

                    // console.log("this is inside concert search");
                    // console.log(inquirerResponse.searchString);
                    searchString = inquirerResponse.searchString;
                    // storeSearches();

                    request("https://rest.bandsintown.com/artists/" + searchString + "/events?app_id=codingbootcamp", function (error, response, body) {

                        // If the request is successful (i.e. if the response status code is 200)
                        if (!error && response.statusCode === 200) {
                            //   console.log(JSON.stringify(response, null, 2));
                            console.log(chalk.blue("Artist(s): " + JSON.parse(body)[0].lineup));
                            console.log(chalk.blue("Venue: " + JSON.parse(body)[0].venue.name));
                            console.log(chalk.blue("Location: " + JSON.parse(body)[0].venue.city));
                            console.log(chalk.blue(chalk.blue("Date: " + moment(JSON.parse(body)[0].datetime).format("MM/DD/YYYY"))));
                        };
                    });
                });
            //-------------------------------------------------------------------------------------------


        } else if (inquirerResponse.operationType === "Movie Information") {
            // console.log(" this is movie information");
            operation = "movie-this";

            inquirer
                .prompt([

                    {
                        type: "input",
                        name: "searchString",
                        message: "Enter Movie Name."
                    },

                ])
                .then(function (inquirerResponse) {

                    // console.log("this is inside movie search");
                    // console.log(inquirerResponse.searchString);
                    searchString = inquirerResponse.searchString;
                    // storeSearches();

                    request("http://www.omdbapi.com/?t=" + searchString + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

                        if (!error && response.statusCode === 200) {
                            console.log(chalk.blue("The movie's title is: " + JSON.parse(body).Title));
                            console.log(chalk.blue("The movie was made in " + JSON.parse(body).Year));
                            console.log(chalk.blue("The movie's imbd rating is " + JSON.parse(body).imdbRating));
                            console.log(chalk.blue("The movie's rotten Tomatoes rating is: " + JSON.parse(body).Ratings[1].Value));
                            console.log(chalk.blue("The movie was made in: " + JSON.parse(body).Country));
                            console.log(chalk.blue("The movie's language is: " + JSON.parse(body).Language));
                            console.log(chalk.blue("The movie's plot: " + JSON.parse(body).Plot));
                            console.log(chalk.blue("The movie's main actors: " + JSON.parse(body).Actors));
                        }

                    });
                });

        } else if (inquirerResponse.operationType === "Spotify Search") {
            // console.log(" this is spotify");
            operation = "spotify-this-song";

            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "searchString",
                        message: "Enter a Song Name."
                    },
                ])
                .then(function (inquirerResponse) {

                    // console.log("this is inside spotify");
                    // console.log(inquirerResponse.searchString);
                    searchString = inquirerResponse.searchString;
                    // storeSearches();

                    if (!searchString) {
                        console.log("you didnt enter a song, so you get....");
                        var spotify = new Spotify(keys.spotify);
                        spotify.search({ type: 'track', query: `"The Sign" Ace of Base`, limit: 1 }, function (err, data) {
                            if (err) {
                                return console.log('Error occurred: ' + err);
                            }
                            var song = data.tracks.items[0];
                            console.log(chalk.red(`
                            Artist: ${song.album.artists[0].name}
                            Song: ${song.name}
                            Preview: ${song.preview_url}
                            Album: ${song.album.name}`));
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
                            console.log(chalk.blue(`
                            Artist: ${song.album.artists[0].name}
                            Song: ${song.name}
                            Preview: ${song.preview_url}
                            Album: ${song.album.name}`));
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
                });

        } else if (inquirerResponse.operationType === "Random Command") {
            // console.log("inside do what it says")
            // operation = "do-what-it-says";
            // storeSearches();

            fs.readFile("random.txt", "utf8", function (error, data) {
                if (error) {
                    return console.log(error);
                }
                var dataArr = data.split(",");

                // console.log(dataArr[0]);
                // console.log(dataArr[1]);
                operation = dataArr[0];
                searchString = dataArr[1];

                var spotify = new Spotify(keys.spotify);

                spotify.search({ type: 'track', query: searchString, limit: 1 }, function (err, data) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    }

                    var song = data.tracks.items[0];
                    console.log(chalk.blue(`
                    Artist: ${song.album.artists[0].name}
                    Song: ${song.name}
                    Preview: ${song.preview_url}
                    Album: ${song.album.name}`));
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

            });
        };



    }

    );
//----------------------------------------------------------------------------  
























// storing all searches to file log.txt -------

// function storeSearches() {
//     var obj = JSON.stringify({
//         [operation] : searchString,
//     });
//     console.log(obj);

//     fs.appendFile("log.txt", obj , function(err) {

//       // If an error was experienced we say it.
//       if (err) {
//         console.log(err);
//       }

//       // If no error is experienced, we'll log the phrase "Content Added" to our node console.
//       else {
//         console.log("Content Added!");
//       }

//     });

// }

















