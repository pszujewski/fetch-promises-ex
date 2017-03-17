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


var artist;
var getArtist = function(name) {
    const artistQuery = { q: name, limit: 1, type: 'artist' };
    return getFromApi("search", artistQuery).then(function(item){
        artist= item.artists.items[0];
        let artistId= item.artists.items[0].id;
        let relatedArtistUrl= `https://api.spotify.com/v1/artists/${artistId}/related-artists`;
        return fetch(relatedArtistUrl);
    }).then(function(response) {
        let show = response.json();
        console.log(show);
        return show;
    }).then(function(parsedData){
        artist.related = parsedData.artists;
        console.log(artist.related[0]);
        let urls = [];
        for (let i=0; i<artist.related.length; i++) {
          let id = artist.related[i].id;
          let topTracksUrl = `https://api.spotify.com/v1/artists/${id}/top-tracks?country=us`;
          urls.push(fetch(topTracksUrl));
        }
      let allPromises = Promise.all(urls);
      return allPromises;
    }).then(function(responseArr) {
        let data = [];
        for (let i=0; i<responseArr.length; i++) {
            data.push(responseArr[i].json());
        }
        console.log("Array of responses",responseArr);
        return data;
    }).then(function(results) {
       console.log(results);
       let pieceOfData = results[1].tracks[1].album.name;
       console.log(pieceOfData);
        // let data2 = [];
        // for (let i=0; i<results.length; i++) {
        //     data2.push(results[i].json());
        // }
        // console.log(data2);
        // return data2;
        //return results.json();
    }).then(function(anotherResult){
       console.log(typeof anotherResult);
    })
    .catch(function(err){
        console.error(err);
    });
};
