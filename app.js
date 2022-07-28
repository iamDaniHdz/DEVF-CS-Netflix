const BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = "784cc2f68acaa91c7e2bfc28a735c30b"
const POSTER_URL = "//image.tmdb.org/t/p/w500"
var dataQuery; // PELICULAS POR GENERO
var array_Genre = [] // GENEROS
var array_Genre_ID = [] // ID DE GENEROS
var array_Genre_name = [] // NOMBRE DE GENEROS
var arr_cast_global = [] // ACTORES
var response; // PELICULAS SEGUN EL GENERO SELECCIONADO

// OBTENER EL RESULTADO DEL BUSCADOR
function getValueInput() {
    var newSearch = document.querySelector("#searchMovie").value;
    if (newSearch.length > 0) {
        getQuery(newSearch)
    }
}

// LIMPIAR EL BUSCADOR
function clean() {
    newSearch = document.querySelector("#searchMovie").value = "";
    dataQuery = undefined
}

// OBTENER LA LISTA DE GENEROS
async function getQuery(newSearch) {

    var genre = await axios.get(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${newSearch}`
    );

    for (let i = 0; i < 15; i++) {
        let imagenAPI = genre.data.results[i].poster_path;
        let url = `${POSTER_URL}${imagenAPI}`;
        document.getElementById(`movie_poster_${i+1}`).src = url;
    }

    dataQuery = genre.data
    return genre.data;
}

// OBTENER GENEROS
async function getGenre(newGenre) {
    let arrGenre = await axios.get(
        `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );

    // CREAR ARRAYS DE NOMBRE DE GENEROS Y ID DE GENEROS
    for (let i = 0; i < arrGenre.data.genres.length; i++) {
        array_Genre.push(arrGenre.data.genres[i])
    }

    for (let i = 0; i < array_Genre.length; i++) {
        array_Genre_ID.push(array_Genre[i].id)
        array_Genre_name.push(array_Genre[i].name)
    }

    // console.warn(array_Genre_name[newGenre], array_Genre_ID[newGenre]);

    // CONDICIONES - VALIDAR SI EL USUARIO USO EL BUSCADOR
    if (newGenre === undefined) {
        var genre = await axios.get(
            `${BASE_URL}/movie/popular?api_key=${API_KEY}`
        );
        document.getElementById(`title_genero`).innerHTML = "Top rated";
    } else {
        var genre = await axios.get(
            `${BASE_URL}/discover/movie?with_genres=${array_Genre_ID[newGenre]}&api_key=${API_KEY}&sort_by=popularity.desc`
        );
        document.getElementById(`title_genero`).innerHTML = array_Genre_name[newGenre];
    }

    // POSTERS DE PELICULAS
    for (let i = 0; i < 15; i++) {
        let imagenAPI = genre.data.results[i].poster_path;
        let url = `${POSTER_URL}${imagenAPI}`;
        document.getElementById(`movie_poster_${i+1}`).src = url;
    }

    // console.log(array_Genre_name[newGenre], genre.data);
    getValueInput()
    return genre.data;
}

// getGenre 
async function awaitResponseGenres(id) {
    response = await getGenre(id);
    return response;
}

// getQuery
async function awaitResponseQuery(search) {
    response = await getQuery(search);
    return response;
}

// ASIGNACION DE DATOS DE PELICULA
async function awaitResponseMovies(idMovide) {
    let arrayResponse;

    // CONDICION - SI EL USUARIO BUSCO POR GENERO O POR BUSCADOR
    if (dataQuery) {
        arrayResponse = dataQuery;
    } else {
        arrayResponse = response;
    }

    let ID = arrayResponse.results[idMovide].id

    // GET CAST
    let cast = await axios.get(
        `${BASE_URL}/movie/${ID}/credits?api_key=${API_KEY}`
    );

    let arr_cast = []

    let castLength = cast.data.cast.length

    // CONDICION - MOSTRAR SOLO 10 ACTORES
    if (castLength <= 10) {
        for (let j = 0; j < castLength; j++) {
            var castName = cast.data.cast[j].name
            arr_cast.push(castName)
        }
    } else {
        for (let j = 0; j <= 10; j++) {
            var castName = cast.data.cast[j].name
            arr_cast.push(castName)
        }
    }

    arr_cast_global = arr_cast.join(", ")

    // ASIGNAR VARIABLES CON DATOS
    let movieName = arrayResponse.results[idMovide].title;
    let movieOriginalName = arrayResponse.results[idMovide].original_title;
    let movieSinopsis = arrayResponse.results[idMovide].overview;
    let imagenModal = arrayResponse.results[idMovide].poster_path;
    let urlModal = `${POSTER_URL}${imagenModal}`;
    let movieDate = arrayResponse.results[idMovide].release_date;
    let voteAverage = arrayResponse.results[idMovide].vote_average;

    let trailer = document.getElementById('youtube');
    trailer.href = `https://www.youtube.com/results?search_query=${movieName}+trailer`;

    let calificacion = document.getElementById(`movie_average`);
    let average = document.getElementById(`average`);

    // ASIGNAR INFORMACION EN HTML (DOM)
    document.getElementById(`movie_cast`).innerHTML = arr_cast_global
    document.getElementById(`movie_name`).innerHTML = movieName
    document.getElementById(`movie_original_name`).innerHTML = movieOriginalName
    document.getElementById(`movie_sinopsis`).innerHTML = movieSinopsis
    document.getElementById(`movie_poster_modal`).src = urlModal;
    document.getElementById(`movie_date`).innerHTML = movieDate;
    document.getElementById(`movie_average`).innerHTML = voteAverage

    // CONDICION - ASIGNAR COLOR SEGUN CALIFICACION
    if (voteAverage >= 8) {
        calificacion.classList.remove("text-orange");
        calificacion.classList.remove("text-red");
        calificacion.classList.add("text-green");

        average.classList.remove("border-orange");
        average.classList.remove("border-red");
        average.classList.add("border-green");
    } else if (voteAverage >= 6) {
        calificacion.classList.remove("text-green");
        calificacion.classList.remove("text-red");
        calificacion.classList.add("text-orange");

        average.classList.remove("border-green");
        average.classList.remove("border-red");
        average.classList.add("border-orange");
    } else {
        calificacion.classList.remove("text-green");
        calificacion.classList.remove("text-orange");
        calificacion.classList.add("text-red");

        average.classList.remove("border-green");
        average.classList.remove("border-orange");
        average.classList.add("border-red");
    }
}

awaitResponseGenres();