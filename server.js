require("dotenv").config();
const express = require("express");
const app = express();
let apiKey = process.env.THEMOVIEDB_API_KEY
const MovieDB = require('node-themoviedb');
let linkImage = "https://image.tmdb.org/t/p/original"
// ES6 Style
// import MovieDB from 'node-themoviedb';
const mdb = new MovieDB(apiKey, {
    language: "fr-FR"
});

app.set('view engine', 'ejs');
app.use(express.static("public"))

app.get('/', (req, res) => {
    res.render("index")
})

app.get("/series", (req, res) => {
    res.render("series")
})

app.get("/films", (req, res) => {
    res.render("films")
})

app.get("/getTv", async (req, res) => {
    let tvName = req.query.tvName;
    try {
        const args = {
            query: {
              query: tvName,
            },
        };
        const tv = await mdb.search.TVShows(args)
        let results = tv.data.results
        let arrayMedia = new Array()
        if (results.length >= 5) {
            for (let i = 0; i < 5; i++) {
                let result = results[i]
                arrayMedia.push({
                    name: result.name,
                    image: result.poster_path,
                    desc: result.overview
                })
            }
        } else {
            for (let i = 0; i < results.length; i++) {
                let result = results[i]
                arrayMedia.push({
                    name: result.original_name,
                    image: result.poster_path,
                    desc: result.overview
                })
            }
        }
        res.render("seriePage", {
            medias: arrayMedia
        })
      } catch (error) {
        console.error(error);
      }
})

app.get("/getMovie", async (req, res) => {
    let movieName = req.query.movieName;
    try {
        const args = {
            query: {
              query: movieName,
            },
        };
        const movie = await mdb.search.movies(args)
        let results = movie.data.results
        let arrayMedia = new Array()
        if (results.length >= 5) {
            for (let i = 0; i < 5; i++) {
                let result = results[i]
                arrayMedia.push({
                    name: result.title,
                    image: result.poster_path,
                    desc: result.overview
                })
            }
        } else {
            for (let i = 0; i < results.length; i++) {
                let result = results[i]
                arrayMedia.push({
                    name: result.title,
                    image: result.poster_path,
                    desc: result.overview
                })
            }
        }
        res.render("filmsPage", {
            medias: arrayMedia
        })
      } catch (error) {
        console.error(error);
      }
})

app.listen("8080", () => {
    console.log("App démarrée sur le port 8080")
})