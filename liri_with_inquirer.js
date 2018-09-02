
// ---- liri using inquirer -----

var request = require("request");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var moment = require("moment");
var fs = require("fs");
var cmd = require('node-cmd');
var inquirer = require("inquirer");

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
        console.log(inquirerResponse.operationType);

        if (inquirerResponse.operationType === "Concert Details") {
            console.log("Concert Details");
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

                    console.log("this is inside concert search");
                    console.log(inquirerResponse.searchString);
                    searchString = inquirerResponse.searchString;
                    storeSearches();

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
                });
            //-------------------------------------------------------------------------------------------


        } else if (inquirerResponse.operationType === "Movie Information") {
            console.log(" this is movie information");
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

                    console.log("this is inside movie search");
                    console.log(inquirerResponse.searchString);
                    searchString = inquirerResponse.searchString;
                    storeSearches();

                    request("http://www.omdbapi.com/?t=" + searchString + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

                        if (!error && response.statusCode === 200) {
                            console.log("The movie's title is: " + JSON.parse(body).Title);
                            console.log("The movie was made in " + JSON.parse(body).Year);
                            console.log("The movie's imbd rating is " + JSON.parse(body).imdbRating);
                            console.log("The movie's rotten Tomatoes rating is: " + JSON.parse(body).Ratings[1].Value);
                            console.log("The movie was made in: " + JSON.parse(body).Country);
                            console.log("The movie's language is: " + JSON.parse(body).Language);
                            console.log("The movie's plot: " + JSON.parse(body).Plot);
                            console.log("The movie's main actors: " + JSON.parse(body).Actors);
                        }
                        //   console.log(JSON.parse(body));


                    });



                });








        } else if (inquirerResponse.operationType === "Spotify Search") {
            console.log(" this is spotify");
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

                    console.log("this is inside spotify");
                    console.log(inquirerResponse.searchString);
                    searchString = inquirerResponse.searchString;
                    storeSearches();

                    if (!searchString) {
                        console.log("you didnt enter a song, so you get....");
                        // load "ace of base" ------
                        var spotify = new Spotify(keys.spotify);
                        spotify.search({ type: 'track', query: "the sign", limit: 20 }, function (err, data) {
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

                        spotify.search({ type: 'track', query: searchString, limit: 1 }, function (err, data) {
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
                });

        } else if (inquirerResponse.operationType === "Random Command") {
            console.log("inside do what it says")
            operation = "do-what-it-says";
            storeSearches();

            fs.readFile("random.txt", "utf8", function (error, data) {
                if (error) {
                    return console.log(error);
                }
                var dataArr = data.split(",");

                // console.log(dataArr[0]);
                // console.log(dataArr[1]);

                cmd.get(
                    `node liri.js ${dataArr[0]} ${dataArr[1]}`,
                    function (err, data, stderr) {
                        console.log(data)
                    }
                );

            });
        };


       
    }

);
//----------------------------------------------------------------------------  








// first user input -----
// var operation = process.argv[2];
// console.log("process.argv [2]" + operation);
// second user input  -----
// var userSearch = process.argv;
// var searchString = "";

// if (userSearch.length === 4) {
//     searchString = process.argv[3];

// } else if (userSearch.length > 4) {

//     for (var i = 3; i < userSearch.length; i++) {
//         searchString = searchString + " " + userSearch[i];
//     }
//     console.log("search-string" + searchString);

// }


















// storing all searches to file log.txt -------

function storeSearches() {
    var obj = JSON.stringify({
        [operation] : searchString,
    });
    console.log(obj);
    
    fs.appendFile("log.txt", obj , function(err) {
    
      // If an error was experienced we say it.
      if (err) {
        console.log(err);
      }
    
      // If no error is experienced, we'll log the phrase "Content Added" to our node console.
      else {
        console.log("Content Added!");
      }
    
    });

}

















