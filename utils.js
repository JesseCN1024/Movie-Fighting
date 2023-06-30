// For storing utils function
const debounce = (func, delay=1000) => {
    let timeoutId;
    return (...args) => { // ..args: rest contains all parameters as an alike array
        if (timeoutId){
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            // apply call the function as normally but seperate the args into vars
            func.apply(null, args);
        }, delay);
    }
}