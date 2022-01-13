require("dotenv").config();
const { TextChannel, CommandInteractionOptionResolver } = require("discord.js");
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
                    desc: result.overview,
                    id: result.id
                })
            }
        } else {
            for (let i = 0; i < results.length; i++) {
                let result = results[i]
                arrayMedia.push({
                    name: result.name,
                    image: result.poster_path,
                    desc: result.overview,
                    id: result.id
                })
            }
        }
        res.render("seriePage", {
            medias: arrayMedia,
            search: tvName,
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
                    desc: result.overview,
                    id: result.id
                })
            }
        } else {
            for (let i = 0; i < results.length; i++) {
                let result = results[i]
                arrayMedia.push({
                    name: result.title,
                    image: result.poster_path,
                    desc: result.overview,
                    id: result.id
                })
            }
        }
        res.render("filmsPage", {
            medias: arrayMedia,
            search: movieName
        })
      } catch (error) {
        console.error(error);
      }
})

app.get("/tv/:id", async (req, res) => {
    let id = req.params.id;
    try {
        const args = {
            pathParameters: {
                tv_id: id
            },
        };
        const tv = await mdb.tv.getDetails(args);
        res.render("serieAdv", {
            name: tv.data.name,
            year: `${tv.data.first_air_date}`,
            img: tv.data.poster_path,
            desc: tv.data.overview,
            seasons: tv.data.number_of_seasons,
            episodes: tv.data.number_of_episodes,
            note: String(tv.data.vote_average),
            creators: tv.data.created_by
        })
    } catch (error) {
        console.error(error)
    }
})

app.get("/movie/:id", async (req, res) => {
    let id = req.params.id;
    try {
        const args = {
            pathParameters: {
                movie_id: id
            },
        };
        const movie = await mdb.movie.getDetails(args);
        res.render("filmAdv", {
            name: movie.data.title,
            year: `${movie.data.release_date}`,
            img: movie.data.poster_path,
            desc: movie.data.overview,
            note: String(movie.data.vote_average),
            budget: String(movie.data.budget)
        })
    } catch (error) {
        console.error(error)
    }
})


app.listen("8080", () => {
    console.log("App démarrée sur le port 8080")
})