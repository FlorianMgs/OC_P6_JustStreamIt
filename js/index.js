/**
 * Variables & funcs helpers
 */

const urlBestMovies = "http://localhost:8000/api/v1/titles/?actor=&actor_contains=&company=&company_contains=&country=&country_contains=&director=&director_contains=&format=json&genre=&genre_contains=&imdb_score=&imdb_score_max=&imdb_score_min=&lang=&lang_contains=&max_year=&min_year=&rating=&rating_contains=&sort_by=-imdb_score&title=&title_contains=&writer=&writer_contains=&year="
const urlScifiMovies = "http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=sci-fi&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains="
const urlThrillerMovies = "http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=thriller&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains="
const urlHorrorMovies = "http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=horror&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains="


/**
 * make get request to api
 * @param {string} url 
 * @returns json
 */
 async function get(url) {
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    } catch (err) {
        console.log(err);
    }
};



/**
 * get screen resolution for responsive
 * @returns {integer}
 */
function getResolution() {
    resolution = window.screen.width * window.devicePixelRatio
    return resolution
}


/**
 * Carousel object
 */
class Carousel {

    /**
     * 
     * @param {HTMLElement} element 
     * @param {Object} options
     * @param {Object} options.slidesToScroll nb d'element a faire defiler
     * @param {Object} options.slidesVisible nb visibles dans un slide
     */
    constructor (element, options = {}) {
        this.element = element;
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1,
        }, options)

        let children = [].slice.call(element.children);
        this.currentItem = 0;
        this.root = this.createDivWithClass('carousel');
        this.container = this.createDivWithClass('carousel__container');
        this.root.appendChild(this.container);
        this.element.appendChild(this.root);
        this.items = children.map((child) => {
            let item = this.createDivWithClass('carousel__item')
            item.appendChild(child)
            this.container.appendChild(item)
            return item;
        })
        this.setStyle()
        this.createNavigation();  
    }

    /**
     * Create carousel child divs
     * @param {string} className 
     * @returns {object}
     */
    createDivWithClass (className) {
        let div = document.createElement('div')
        div.setAttribute('class', className)
        return div;
    }

    /**
     * set carousel items style
     */
    setStyle () {
        let ratio = this.items.length / this.options.slidesVisible
        this.container.style.width = (ratio * 100) + "%";
        resolution = getResolution();
        this.items.forEach(item => {
            item.style.width = ((100 / this.options.slidesVisible) / ratio) + "%";

            if (resolution >= 1024) {
                switch (this.items.indexOf(item)) {
                    case 0:
                        item.style.transform = "perspective(700px) rotateY(30deg)";
                        break;
                    case 1:
                        item.style.transform = "perspective(700px) rotateY(15deg)";
                        break;
                    case 3:
                        item.style.transform = "perspective(700px) rotateY(-15deg)";
                        break;
                    case 4:
                        item.style.transform = "perspective(700px) rotateY(-30deg)";
                        break;
                }
                applyHoverOnItems();
            }


        });
    }

    /**
     * create carousel navigation buttons
     */
    createNavigation () {
        let nextButton = this.createDivWithClass("carousel__next");
        let prevButton = this.createDivWithClass("carousel__prev");
        this.root.appendChild(nextButton);
        this.root.appendChild(prevButton);
        nextButton.addEventListener('click', this.next.bind(this))
        prevButton.addEventListener('click', this.prev.bind(this))
    }

    next() {
        this.gotoItem(this.currentItem + this.options.slidesToScroll)
    }
    
    prev() {
        this.gotoItem(this.currentItem - this.options.slidesToScroll)
    }

    /**
     * Move carousel items by index
     * @param {integer} index 
     */
    gotoItem(index) {
        if (index < 0) {
            index = this.items.length - this.options.slidesVisible;
        } else if (index >= this.items.length || this.items[this.currentItem + this.options.slidesVisible] === undefined) {
            index = 0;
        }
        let translateX = index * -100 / this.items.length
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
        this.currentItem = index;

        /**
         * Apply perspective effect to carousel items only on desktop
         */
         resolution = getResolution();
        if (resolution >= 1024) {
            this.items[this.currentItem].style.transform = "perspective(700px) rotateY(30deg)";
            this.items[this.currentItem + 1].style.transform = "perspective(700px) rotateY(15deg)";
            this.items[this.currentItem + 2].style.transform = "perspective(700px) rotateY(0deg)";
            this.items[this.currentItem + 3].style.transform = "perspective(700px) rotateY(-15deg)";
            this.items[this.currentItem + 4].style.transform = "perspective(700px) rotateY(-30deg)";
            applyHoverOnItems();
        }

    }
}


/**
 * Apply mouseover effects to items in carousel
 */
 function applyHoverOnItems() {
    items = document
                .querySelectorAll(".carousel__item")

    for (item of items) {
            /**
             * get inital transform value
             */
        let styleInitialValue = item.getAttribute("style");

        item.addEventListener("mouseenter", function(e) {
            e.target.style.transform = "scale(1.1)";
        })
        item.addEventListener("mouseleave", function(e) {
            e.target.setAttribute("style", styleInitialValue);
        })
        
    }
}


/**
 * Get 10 first movies for carousel
 * @param {string} endpoint 
 * @returns array of json
 */

async function getMovies(endpoint) {

    /*
     * Gathering infos for first 10 best movies
     */
    const moviesList = []
    let movies = []

    for (let i of Array(2).keys()) {
        if (i == 0) {
            movies = await get(endpoint);
        } else {
            movies = await get(endpoint + "&page=" + i+1);
        }
        const results = movies.results;
        for (let result of results) {
            const movie = await get("http://localhost:8000/api/v1/titles/" + result.id);
            moviesList.push(movie);
        }
    }

    return moviesList;
}



/**
 * Rendering carousel
 * @param {string} carouselId 
 * @param {string} endpoint 
 */
async function renderCarousel(carouselId, endpoint) {

    /**
     * Get resolution
     * 1 slide visible if mobile
     */
    resolution = getResolution()
    if (resolution <= 1024) {
        slidesVisible = 1
    } else {
        slidesVisible = 5
    }

    new Carousel(document.querySelector(carouselId), {
        slidesToScroll: 1,
        slidesVisible: slidesVisible
    })

    let carousel = document
                    .querySelectorAll(carouselId + " .carousel .carousel__item .item");
    const movies = await getMovies(endpoint);

    for (let [i, slide] of carousel.entries()) {
        slide.setAttribute("onclick", "renderModal(" + movies[i].id + ")");
        slide.querySelector(".item__image img")
             .setAttribute("src", movies[i].image_url.replaceAll('268', '536').replaceAll('182', '364'));
        slide.querySelector(".item__title h3")
             .innerText = movies[i].title;
    }

}


/**
 * render best movie section
 */


async function renderBestMovie() {
    const bestMovies =  await get("http://localhost:8000/api/v1/titles/?actor=&actor_contains=&company=&company_contains=&country=&country_contains=&director=&director_contains=&format=json&genre=&genre_contains=&imdb_score=&imdb_score_max=&imdb_score_min=&lang=&lang_contains=&max_year=&min_year=&rating=&rating_contains=&sort_by=-imdb_score&title=&title_contains=&writer=&writer_contains=&year=");
    let bestMovieId = bestMovies.results[0].id;

    const bestMovie = await get(" http://localhost:8000/api/v1/titles/" + bestMovieId)
    /*
     * Gathering infos for the best movie
     */

    let bestMovieImdb = bestMovies.results[0].imdb_url;
    let bestMovieImg = bestMovie.image_url.replaceAll('268', '1072').replace('182', '728');
    document
        .getElementById("best-movie__pic")
        .setAttribute("src", bestMovieImg);
    
    document
        .getElementById("best-movie__pic")
        .setAttribute("onclick", "renderModal(" + bestMovieId + ")");

    document
    .getElementById("best-movie__title")
    .innerText = bestMovie.title;

    document
    .getElementById("best-movie__description")
    .innerText = bestMovie.description;

    document
        .querySelector("#best-movie__infos > a")
        .setAttribute("href", bestMovieImdb);

}

/**
 * 
 * render modal
 */
async function renderModal(id) {
    const movie = await get("http://localhost:8000/api/v1/titles/" + id);
    let modal = document
                    .getElementById("modal")
    let close = document
                    .getElementsByClassName("modal__close")[0]
    
    /**
     * populate modal
     */
    document
        .getElementById("movie__image")
        .setAttribute("src", movie.image_url);
    document
        .getElementById("movie__title")
        .innerText = movie.title;
    document
        .querySelector("#movie__header div .btn")
        .setAttribute("href", "https://www.imdb.com/title/tt" + movie.id + "/")
    document
        .getElementById("genre")
        .innerHTML = "<span><b>Genre: </b></span>" + movie.genres.join(', ');
    document
        .getElementById("date")
        .innerHTML = "<span><b>Release date: </b></span>" + movie.date_published;
    document
        .getElementById("rated")
        .innerHTML = "<span><b>Rated: </b></span>" + movie.rated;      
    document
        .getElementById("imdb_score")
        .innerHTML = "<span><b>IMDB Score: </b></span>" + movie.imdb_score;
    document
        .getElementById("director")
        .innerHTML = "<span><b>Director: </b></span>" + movie.directors.join(', ');
    document
        .getElementById("actors")
        .innerHTML = "<span><b>Actors: </b></span>" + movie.actors.join(', ');
    document
        .getElementById("duration")
        .innerHTML = "<span><b>Duration: </b></span>" + movie.duration + "min";
    document
        .getElementById("country")
        .innerHTML = "<span><b>Country: </b></span>" + movie.countries[0];
    document
        .getElementById("box-office")
        .innerHTML = "<span><b>Box Office results: </b></span>" + movie.worldwide_gross_income + " $";
    document
        .getElementById("description")
        .innerHTML = "<span><b>Description: </b></span>" + movie.long_description;

    /**
     * open modal
     * on close btn or outside modal click, close modal
     */
    modal.style.display = "block";

    close.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
}

/**
 * rendering all elements when dom is loaded
 */


document.addEventListener("DOMContentLoaded", function(e) {
    renderCarousel("#best-movies", urlBestMovies);
    renderCarousel("#scifi-movies", urlScifiMovies);
    renderCarousel("#thriller-movies", urlThrillerMovies);
    renderCarousel("#horror-movies", urlHorrorMovies);
    renderBestMovie(); 
})