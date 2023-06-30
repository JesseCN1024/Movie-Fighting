
// FETCH FUNCTION --------------------------------------
// const fetchData = async (search) => {
//     const response = await axios.get('https://www.omdbapi.com/', {
//         // params is an option object passed to the axios.get() method as the second argument
//         // The params option is used to specify the query string parameters that will be appended to the URL when making a GET request
//         // The axios.get() method uses the params object to construct the final URL that will be used to make the HTTP request. The resulting URL will look something like this: 
//         // https://www.omdbapi.com/?apikey=7f8afbf3&s=avengers
//         params: {
//             apikey: '7f8afbf3',
//             s: search.trim() //search keys
//         }
//     });
//     // Check the data
//     if (response.data.Error){
//         return [];
//     }    
//     return response.data.Search; 
// };

const showMovie = async (root, movie) => {
    const target = root.querySelector('.summary');
    target.innerHTML = movieTemplate(movie);
}

// DEFINING AND CALLING VARIABLES ----------------------
    // dropdown menu
 // become a funtion that can only invoke after every 1 sec
    // Return HTML code for all the MOVIE INFORMATION
const movieTemplate = movieDetail => {
    // Convert and store variables
    let dollars = !movieDetail.BoxOffice ? NaN : parseInt(movieDetail.BoxOffice.replace(/\$|,/g,''));
    const metascore = parseInt(movieDetail.Metascore);
    const imdb = parseFloat(movieDetail.imdbRating);
    const numvote = parseInt(movieDetail.imdbVotes.replace(/,/g,''));
    let count = parseInt(movieDetail.Awards.split(' ').reduce((prev,word)=>{
        let value = parseInt(word);
        if (isNaN(value)){
            return prev;
        }
        return prev+value;
    }, 0));

    console.log(count, dollars, metascore, imdb, numvote);
    return `
    <!-- Summary Info -->
    <div class="summary__info d-flex align-items-center">
        <img class="" width="160px" src="${movieDetail.Poster}" alt="">
        <div class="summary__info-content ms-4">
            <h2>${movieDetail.Title}</h1>
            <p><b>Director: </b>${movieDetail.Director}</p>
            <p>${movieDetail.Plot}</p>
            <p><b>Genre: </b>${movieDetail.Genre}</p>
        </div>
    </div>
    <!-- Statistic Boxes -->
    <div class="boxes mt-3">
        <div data-value=${count} class="box p-2 mb-2">
            <p class="fw-bolder mb-0 fs-4" style="min-height: 72px;" >${movieDetail.Awards}</p>
            <p class="mb-0">Awards</p>
        </div>
    </div>
    <div class="boxes mt-3">
        <div data-value=${dollars} class="box p-2 mb-2">
            <p class="fw-bolder mb-0 fs-3" >${(!movieDetail.BoxOffice) ? "N/A" : movieDetail.BoxOffice}</p>
            <p class="mb-0">Box Office</p>
        </div>
    </div>
    <div class="boxes mt-3">
        <div data-value=${metascore} class="box p-2 mb-2">
            <p class="fw-bolder mb-0 fs-3" >${movieDetail.Metascore}</p>
            <p class="mb-0">Metascore</p>
        </div>
    </div>
    <div class="boxes mt-3">
        <div data-value=${imdb} class="box p-2 mb-2">
            <p class="fw-bolder mb-0 fs-3" >${movieDetail.imdbRating}</p>
            <p class="mb-0">IMDB Rating</p>
        </div>
    </div>
    <div class="boxes mt-3">
        <div data-value=${numvote} class="box p-2 mb-2">
            <p class="fw-bolder mb-0 fs-3" >${movieDetail.imdbVotes}</p>
            <p class="mb-0">IMDB Votes</p>
        </div>
    </div>
    `;
};


// AUTOCOMPLETE SECTION --------------------------------
let leftMovie;
let rightMovie;
// Configuration
const autoCompleteConfig = {
    renderOption(movie, movieDetail){ // where choose what each dropdown option looks like
        return `
            <div class="border border-1 mb-2">
                <a class=" dropdown-anchor row gx-2 text-decoration-none text-dark" href="#">
                    <div class="col-2 text-center d-flex align-items-center">
                        <img class="mx-auto" src="${movie.Poster==='N/A' ? '' : movie.Poster}" alt="">
                    </div>
                    <div class="col-10">
                        <h1 class="dropdown-anchor-title mb-0" style="font-size: 1rem;">${movie.Title}</h1>
                        <p class="mb-0" style="font-size: .7rem;">${movieDetail.Plot}</p> 
                        <p class="mb-0" style="font-size: .7rem;"><b>Year: ${movie.Year}</b></p>
                    </div>
                </a>
            </div>
        `;
    },
    onOptionSelect(root, movieDetail,side){
        document.querySelector('#tutorial').classList.add('d-none');
        // root.querySelector('.sumamry').innerHTML = '';
        showMovie(root, movieDetail);
        if (side==='left'){
            leftMovie=movieDetail;
        }
        else if (side==='right'){
            rightMovie=movieDetail;
        }
        if (leftMovie && rightMovie){
            runComparison(side);
        }
    },
    async fetchData (search) {
        const response = await axios.get('https://www.omdbapi.com/', {
            // params is an option object passed to the axios.get() method as the second argument
            // The params option is used to specify the query string parameters that will be appended to the URL when making a GET request
            // The axios.get() method uses the params object to construct the final URL that will be used to make the HTTP request. The resulting URL will look something like this: 
            // https://www.omdbapi.com/?apikey=7f8afbf3&s=avengers
            params: {
                apikey: '7f8afbf3',
                s: search.trim() //search keys
            }
        });
        // Check the data
        if (response.data.Error){
            return [];
        }    
        
        return response.data.Search; 
    },
    async fetchItem (search)  {
        const response = await axios.get('https://www.omdbapi.com/', {
            // params is an option object passed to the axios.get() method as the second argument
            // The params option is used to specify the query string parameters that will be appended to the URL when making a GET request
            // The axios.get() method uses the params object to construct the final URL that will be used to make the HTTP request. The resulting URL will look something like this: 
            // https://www.omdbapi.com/?apikey=7f8afbf3&s=avengers
            params: {
                apikey: '7f8afbf3',
                i: search //search keys
            }
        });
        //Check the data
        if (response.data.Error){
            return [];
        }    
        
        return response.data; 
    },
    inputValues(movie){ // contain all kinds of varibles passed in 
        return {
            ipValAfterClicked: movie.Title,
            fetchDetailBy: movie.imdbID
        };
    }
};
function runComparison(side){
    const leftSideStats = document.querySelectorAll(`#left-autocomplete .summary .box`);
    const rightSideStats = document.querySelectorAll(`#right-autocomplete .summary .box`);
    const resetBoxes = (leftStat,rightStat) => {
        leftStat.classList.remove('bg-success');
        leftStat.classList.remove('bg-danger');
        rightStat.classList.remove('bg-danger');
        rightStat.classList.remove('bg-success');
        leftStat.classList.remove('text-white');
        rightStat.classList.remove('text-white');
    }
    const textWhite = (leftStat, rightStat) => {
        leftStat.classList.add('text-white');
        rightStat.classList.add('text-white');
    }

    // Loop 
    leftSideStats.forEach((leftStat, idx) => {
        // Get 
        rightStat = rightSideStats[idx];
        const leftSideValue = parseFloat(leftStat.dataset.value);
        const rightSideValue = parseFloat(rightStat.dataset.value);
        resetBoxes(leftStat, rightStat);
        // Style css when two stats are comparible 
        if (!(isNaN(leftSideValue) || isNaN(rightSideValue))){
            if((leftSideValue!==rightSideValue)){
                leftStat.classList.add('text-white');
                rightStat.classList.add('text-white');
            }
            // 3 cases happen
            if (leftSideValue<rightSideValue){
                leftStat.classList.add('bg-danger');
                rightStat.classList.add('bg-success');
            }
            else if(leftSideValue > rightSideValue) {
                leftStat.classList.add('bg-success');
                rightStat.classList.add('bg-danger');
            }
        }
        
    })  

}   
// Calling AUTOCOMPLETE
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'), // object root
    side:'left'
});
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    side: 'right'
});



