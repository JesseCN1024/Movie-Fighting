// Functions that take autocomplete config and render an autocomplete on the screen
// confic obj contains all specified functions decide how auto complete should work
const createAutoComplete = ({root, renderOption, fetchData, fetchItem, onOptionSelect, inputValues, side}) => { 
    // Pass root element as parameter: represent the frame for the dropdown
    root.innerHTML = `
            <div class="">
                <!-- Seảch Box 1 -->
                <div class="dropdown d-block">
                    <!-- Label -->
                    <label for="search-input" class="form-label d-block dropdown__input"><b>Search: </b></label>
                    <!-- Input -->
                    <input type="text" class="search__input form-control w-100" id="search-input">
                    <!-- Dropdown Menu -->
                    <ul class="dropdown-menu d-block mt-2 w-100 px-2 d-none">
                    </ul>
                </div>
                <!-- Summary Section 1 -->
                <div class="summary mt-5"></div>
            </div>
    `;
    // Change document -> root: select the input and dropdown in that root
    const searchInput = root.querySelector('#search-input');
    const dropdown = root.querySelector('.dropdown-menu');


    // FUNCIONS
    const onInput = debounce(async (event) => { // use async func to wait for fetchData() to be done
        const searchInput = event.target;
        // Reset dropdown
        dropdown.innerHTML='';  
        const items = await fetchData(event.target.value);
        if (!items.length){ // Hide dropdown when nodata found
            dropdown.classList.add('d-none');
            return;
        }
        dropdown.classList.remove('d-none');
        // FOR EVERY ELEMENTS FOUND
        for (let item of items){    
            const itemDetail = await fetchItem(inputValues(item).fetchDetailBy); // item.idmbID
            const option = document.createElement('li');

            // Handle "Clicking Event" on item 
            option.addEventListener('click', (event) => {
                // FIll Input Field with the name of the item
                const title = option.querySelector('h1');
                searchInput.value = inputValues(item).ipValAfterClicked;
                // Close the dropdown
                dropdown.innerHTML = '';
                dropdown.classList.add('d-none');
                // 
                onOptionSelect(root, itemDetail, side);
            })

            option.innerHTML = renderOption(item, itemDetail) ;
            dropdown.appendChild(option);

            // document.querySelector('.target').appendChild(option);
        }

    },500);

    searchInput.addEventListener('input', onInput);
    // ADD EVENT LISTENER -----------------------
    document.addEventListener('click', (event) => {
        if(!root.contains(event.target)){
            dropdown.innerHTML = '';
            dropdown.classList.add('d-none');

        }
    }); // hide dropdown when clicking outside
    
}



