const APIKEY = "04c35731a5ee918f014970082a0088b1";
const APIKEY_URL = "?api_key=04c35731a5ee918f014970082a0088b1";
const APIURL = "https://api.themoviedb.org/3/";
const API_POP_MOVIES = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1"
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query="

const main = document.querySelector('main');
const form = document.getElementById('form');
const search = document.querySelector('.search');

const moviePopup = document.getElementById('movie-popup');

// initially get movies
getMovies(API_POP_MOVIES);

async function getMovies(url) {
    const res = await fetch(url);
    const resData = await res.json();

    showMovies(resData.results);
}

function showMovies(movies) {

    // clear main
    main.innerHTML = "";

    movies.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.addEventListener('click', () => {
            openMovieDetail(movie.id);
        });

        const { poster_path, title, vote_average, overview } = movie;

        movieEl.innerHTML = `
        <img src="${getPosterPath(poster_path)}" alt="${title}">
        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getClassByRate(vote_average)}">${vote_average}</span>
        </div>
        
        `;
        // <div class="overview">
        //     <h3>Overview:</h3>
        //     ${overview}
        // </div>
        main.appendChild(movieEl);
    });
}

function getClassByRate(vote) {
    if (vote > 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;

    if (searchTerm) {
        getMovies(SEARCHAPI + searchTerm);
        search.value = "";
    }
})

function getPosterPath(path) {
    if (path) {
        return IMGPATH + path;
    } else {
        return "./img/no-cover.png"
    }
}

async function openMovieDetail(movieId) {

    const res = await fetch(APIURL + "movie/" + movieId + APIKEY_URL);
    const resData = await res.json();

    console.log(resData)
    moviePopup.classList.remove('hidden');
}