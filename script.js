const APIKEY = "04c35731a5ee918f014970082a0088b1";
const APIKEY_URL = "?api_key=04c35731a5ee918f014970082a0088b1";
const APIURL = "https://api.themoviedb.org/3/";

const API_NOW_PLAYING_MOVIES = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + APIKEY + "&page=";
const API_POPULAR_MOVIES = "https://api.themoviedb.org/3/movie/popular?api_key=" + APIKEY + "&page="
const API_TOP_RATED_MOVIES = "https://api.themoviedb.org/3/movie/top_rated?api_key=" + APIKEY + "&page=";
const API_UPCOMING_MOVIES = "https://api.themoviedb.org/3/movie/upcoming?api_key=" + APIKEY + "&page=";
const API_TRENDING_MOVIES = "https://api.themoviedb.org/3/trending/movie/day?api_key=" + APIKEY + "&page=";

const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=" + APIKEY + "&query="

const main = document.querySelector('main');
const form = document.getElementById('form');
const search = document.querySelector('.search');

const moviePopup = document.getElementById('movie-popup');
const closePopupBtn = document.getElementById('close-popup');

// Menu
const nowPlayingMenu = document.querySelector('.now-playing');
const popularMenu = document.querySelector('.popular');
const trendingMenu = document.querySelector('.trending');
const topRatedMenu = document.querySelector('.top-rated');
const upcomingMenu = document.querySelector('.upcoming');

// Variable
let pageNumber = 1
let currAPI = API_NOW_PLAYING_MOVIES;

// Footer
const prevPageBtn = document.querySelector('.prev-page');
const nextPageBtn = document.querySelector('.next-page');
const pageNumberEl = document.querySelector('.page-num');

// initially get movies
getMovies(API_NOW_PLAYING_MOVIES + pageNumber);

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
            <span class="${getClassByRate(vote_average.toFixed(1))}">${vote_average.toFixed(1)}</span>
        </div>
        `;

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
        return "./images/no-cover.png"
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
    const videoEl = document.getElementById('video-frame');
    const castEl = document.getElementById('cast');
    const reviewListEl = document.querySelector('.review-list');

    // Cover
    coverEl.setAttribute('src', getPosterPath(resData.poster_path));

    // Average
    averageEl.innerHTML = resData.vote_average.toFixed(1);
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
    if (resData.genres) {
        resData.genres.forEach(element => {
            const genreEl = document.createElement('span');
            genreEl.classList.add('genre');
            genreEl.innerHTML = element.name;
            genresEl.appendChild(genreEl);
        });
    }

    // Summary
    summaryEl.innerHTML = resData.overview;

    // Video
    const resVideo = await fetch(APIURL + "movie/" + movieId + "/videos" + APIKEY_URL);
    const resVideoData = await resVideo.json();
    videoEl.setAttribute('src', "https://www.youtube.com/embed/" + resVideoData.results[0].key);

    // Cast
    const resCredit = await fetch(APIURL + "movie/" + movieId + "/credits" + APIKEY_URL);
    const resCreditData = await resCredit.json();
    console.log(resCreditData);

    castEl.innerHTML = "";
    if (resCreditData.cast) {
        resCreditData.cast.forEach(element => {
            const listCastEl = document.createElement('li');
            listCastEl.innerHTML = `<img src="${getPosterPath(element.profile_path)}" alt="">
        <span>${element.name}</span>`;
            castEl.appendChild(listCastEl);
        });
    }

    // Review
    const resReview = await fetch(APIURL + "movie/" + movieId + "/reviews" + APIKEY_URL);
    const resReviewData = await resReview.json();
    console.log(resReviewData);

    reviewListEl.innerHTML = "";
    if (resReviewData.results) {
        resReviewData.results.forEach(element => {
            const reviewEl = document.createElement('div');
            reviewEl.classList.add('review-info');
            reviewEl.innerHTML = `
        <div class="review-name">${element.author}</div>
        <div class="review-text">${marked(element.content)}</div>`;
            reviewListEl.appendChild(reviewEl);
        });
    }

    closePopupBtn.addEventListener('click', () => {

        // Stop the video player
        if (videoEl) {
            videoEl.setAttribute('src', "");
        }

        moviePopup.classList.add('hidden');
    })
}

nowPlayingMenu.addEventListener('click', () => {
    pageNumber = 1;
    getMovies(API_NOW_PLAYING_MOVIES + pageNumber);
    currAPI = API_NOW_PLAYING_MOVIES;

    nowPlayingMenu.classList.add('clicked');
    popularMenu.classList.remove('clicked');
    trendingMenu.classList.remove('clicked');
    topRatedMenu.classList.remove('clicked');
    upcomingMenu.classList.remove('clicked');
})

popularMenu.addEventListener('click', () => {
    pageNumber = 1;
    getMovies(API_POPULAR_MOVIES + pageNumber);
    currAPI = API_POPULAR_MOVIES;

    nowPlayingMenu.classList.remove('clicked');
    popularMenu.classList.add('clicked');
    trendingMenu.classList.remove('clicked');
    topRatedMenu.classList.remove('clicked');
    upcomingMenu.classList.remove('clicked');
})

trendingMenu.addEventListener('click', () => {
    pageNumber = 1;
    getMovies(API_TRENDING_MOVIES + pageNumber);
    currAPI = API_TRENDING_MOVIES;

    nowPlayingMenu.classList.remove('clicked');
    popularMenu.classList.remove('clicked');
    trendingMenu.classList.add('clicked');
    topRatedMenu.classList.remove('clicked');
    upcomingMenu.classList.remove('clicked');
})

topRatedMenu.addEventListener('click', () => {
    pageNumber = 1;
    getMovies(API_TOP_RATED_MOVIES + pageNumber);
    currAPI = API_TOP_RATED_MOVIES;

    nowPlayingMenu.classList.remove('clicked');
    popularMenu.classList.remove('clicked');
    trendingMenu.classList.remove('clicked');
    topRatedMenu.classList.add('clicked');
    upcomingMenu.classList.remove('clicked');
})

upcomingMenu.addEventListener('click', () => {
    pageNumber = 1;
    getMovies(API_UPCOMING_MOVIES + pageNumber);
    currAPI = API_UPCOMING_MOVIES;

    nowPlayingMenu.classList.remove('clicked');
    popularMenu.classList.remove('clicked');
    trendingMenu.classList.remove('clicked');
    topRatedMenu.classList.remove('clicked');
    upcomingMenu.classList.add('clicked');
})

nextPageBtn.addEventListener('click', () => {
    pageNumber += 1;
    pageNumberEl.innerHTML = pageNumber;
    getMovies(currAPI + pageNumber);
})

prevPageBtn.addEventListener('click', () => {
    if (pageNumber >= 2) {
        pageNumber -= 1;
        pageNumberEl.innerHTML = pageNumber;
        getMovies(currAPI + pageNumber);
    }
})