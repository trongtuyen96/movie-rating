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
const closePopupBtn = document.getElementById('close-popup');

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

    // Specify movie info
    const coverEl = document.getElementById('cover');
    const averageEl = document.getElementById('average');
    const titleEl = document.getElementById('title');
    const runtimeEl = document.getElementById('runtime');
    const releaseEl = document.getElementById('release');
    const genresEl = document.querySelector('.movie-genre');
    const summaryEl = document.getElementById('summary');
    const castEl = document.getElementById('cast');
    const reviewListEl = document.querySelector('.review-list');

    // Cover
    coverEl.setAttribute('src', getPosterPath(resData.poster_path));

    // Average
    averageEl.innerHTML = resData.vote_average;
    if (resData.vote_average > 8) {
        averageEl.style.backgroundColor = '#008000';
    } else if (resData.vote_average >= 5) {
        averageEl.style.backgroundColor = '#ffa500';
    } else {
        averageEl.style.backgroundColor = '#ff0000';
    }

    // Title
    titleEl.innerHTML = resData.title;

    // Runtime
    const hour = parseInt(resData.runtime / 60);
    const min = parseInt(resData.runtime % 60);
    runtimeEl.innerHTML = `${hour}h ${min}m`;

    // Release
    releaseEl.innerHTML = resData.release_date;

    // Genres
    genresEl.innerHTML = ""
    resData.genres.forEach(element => {
        const genreEl = document.createElement('span');
        genreEl.innerHTML = element.name;
        genresEl.appendChild(genreEl);
    });

    // Summary
    summaryEl.innerHTML = resData.overview;

    // Cast
    const resCredit = await fetch(APIURL + "movie/" + movieId + "/credits" + APIKEY_URL);
    const resCreditData = await resCredit.json();
    console.log(resCreditData);

    castEl.innerHTML = "";
    resCreditData.cast.forEach(element => {
        const listCastEl = document.createElement('li');
        listCastEl.innerHTML = `<img src="${getPosterPath(element.profile_path)}" alt="">
        <span>${element.name}</span>`;
        castEl.appendChild(listCastEl);
    });

    // Review
    const resReview = await fetch(APIURL + "movie/" + movieId + "/reviews" + APIKEY_URL);
    const resReviewData = await resReview.json();
    console.log(resReviewData);

    reviewListEl.innerHTML = "";
    resReviewData.results.forEach(element => {
        const reviewEl = document.createElement('div');
        reviewEl.classList.add('review-info');
        reviewEl.innerHTML = `
        <div class="review-name">${element.author}</div>
        <div class="review-text">${marked(element.content)}</div>`;
        reviewListEl.appendChild(reviewEl);
    });

    closePopupBtn.addEventListener('click', () => {
        moviePopup.classList.add('hidden');
    })
}