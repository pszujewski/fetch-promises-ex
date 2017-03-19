var getFromApi = function(endpoint, query={}) {
    const url = new URL(`https://api.spotify.com/v1/${endpoint}`);
    Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
    return fetch(url).then(function(response) {
        if (!response.ok) {
            return Promise.reject(response.statusText);
        }
        return response.json();
    });
};

// undeclared variable to which we will save all data on searched artist and related artists
var artist; 
var getArtist = function(name) {
    const artistQuery = { 
        q: name,
        limit: 1,
        type: "artist"
     }; 
    return getFromApi("search", artistQuery).then(response => {
        // Save object representing information on the artist to the undeclared 'artist' variable
        artist = response.artists.items[0];
        let artistId = artist.id;
        return getFromApi(`artists/${artistId}/related-artists`); // returns a promise, so chaining 'then()' is possible
    }).then(response => {
        // Add array of objects representing all related artists to the artist object
        artist.related = response.artists; 
        let tracksBin = [];
        for (let i=0; i<artist.related.length; i++) {
           let id = artist.related[i].id;
           let endpoint = `artists/${id}/top-tracks`;
           let q = {
               country: "us"
           };
           tracksBin.push(getFromApi(endpoint, q));
        }
        // Get each artists top tracks and return all responses at once
        return Promise.all(tracksBin);
    }).then(response => {
        for (let i=0; i<response.length; i++) {
            artist.related[i].tracks = response[i].tracks;
        }
        console.log(artist);
        return artist;
    }) // handle any errors in the chain
    .catch(error => {
        console.error(error.stack);
        return error;
    });
}

