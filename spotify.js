var getFromApi = function(endpoint, query={}) {
    const url = new URL(`https://api.spotify.com/v1/${endpoint}`);
    Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
    return fetch(url).then(function(response) {
        if (!response.ok) {
            return Promise.reject(response.statusText);
        }
        console.log(response);
        return response.json();
    });
};


var artist;
var getArtist = function(name) {
    const artistQuery = { q: name, limit: 1, type: 'artist' };
    return getFromApi("search", artistQuery).then(function(item){
        console.log('The item is: ',item);
        artist= item.artists.items[0];
        let artistId= item.artists.items[0].id;
        console.log('Artist ID is: ', artistId);
        let relatedArtistUrl= `https://api.spotify.com/v1/artists/${artistId}/related-artists`;
        console.log(artist);

        return fetch(relatedArtistUrl);
    }).then(function(response) {
        return response.json();
    }).then(function(parsedData){
        console.log('Parsed Data: ',parsedData);
        artist.related = parsedData.artists;
        console.log('Returning: ',artist);
        return artist;
    })
    .catch(function(err){
        console.error(err);
    });
};
