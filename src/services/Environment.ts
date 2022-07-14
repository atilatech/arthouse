export const EnvironmentDev = {
    atilaApiUrl: 'http://127.0.0.1:8000/api',
    arthouseApiUrl: 'http://127.0.0.1:8008/api',
};

export const EnvironmentStaging = {
    atilaApiUrl: 'https://atila-7-staging.herokuapp.com/api',
    arthouseApiUrl: 'http://127.0.0.1:8000/api',
};

export const EnvironmentProd = {
    atilaApiUrl: 'https://atila-7.herokuapp.com/api',
    arthouseApiUrl: 'http://127.0.0.1:8000/api',
}

// set to EnvironmentDev as the default so we can use type hinting and the autocomplete feature
let Environment = EnvironmentDev;

if (window.location.host.includes('localhost')) {
    Environment = EnvironmentDev;
} else if (window.location.host.includes('test')) {
    Environment = EnvironmentStaging;
} else if(window.location.host.includes('art.atila.ca')){
    Environment =  EnvironmentProd;
}

export default Environment;
