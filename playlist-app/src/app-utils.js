export const getUser = (at,rt) => (
    fetch('https://api.spotify.com/v1/me',{ headers: { 'Authorization': 'Bearer ' + at } })
    .then((res) => {
      if (res.status === 401) {
        fetch(`http://localhost:8888/refresh_token?refresh_token='${rt}'`)
        .then(response => response.json())
        .then(data => console.log('refresh: ', data))
        .then(data => data)
      } else {
        let json = res.json();
        return json;
      }
    })
    .catch((e) => {
      console.error(e)
    })
);

export const PopulateSpotifyAutoComplete = (type, at, q, market) => (
  fetch(`https://api.spotify.com/v1/search?q=${q}&type=${type}&market=${market}&limit=${50}`,{
    headers: {
      Authorization: 'Bearer ' + at
    }
  }).then((response) => {
    let json = response.json();
    return json;
  })
  .catch((e) => {
    console.error(e);
  })
);

export const getGenres = (at) => (
  fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds',{
    headers: {
      Authorization: 'Bearer ' + at
    }
  }).then((response) => {
    let json = response.json();
    return json;
  })
  .catch((e) => {
    console.error(e);
  })
);

// formItemToGeneratorItem = (item, name, RequestParams) => {
//   if (item[0]) {
//     return item[0] === item[1] ? RequestParams[target_ + name]
//   }
// }

export const formToGenerator = ({artists,
  tracks,
  genres,
  name,
  limit,
  acousticness,
  danceability,
  duration,
  energy,
  instrumentalness,
  key,
  liveness,
  loudness,
  mode,
  popularity,
  speechiness,
  tempo,
  timeSig,
  valence,
  market,
  user_id}) => {
    const RequestParams = {};
    RequestParams.limit = limit[0];
    RequestParams.name = name;
    RequestParams.market = market;
    RequestParams.user_id = user_id;
    RequestParams.seed_artists = artists;
    RequestParams.seed_tracks = tracks;
    RequestParams.seed_genres = genres.toString();
    if (danceability[0]) {
      if (danceability[0] !== danceability[1]) {
        RequestParams.min_danceability = danceability[0] * .01;
        RequestParams.max_danceability = danceability[1] * .01;
      } else {
        RequestParams.target_danceability = danceability[0] * .01;
      }
    }
    if (duration[0]) {
      if (duration[0] !== duration[1]) {
        RequestParams.min_duration_ms = duration[0] * 6000;
        RequestParams.max_duration_ms = duration[1] * 6000;
      } else {
        RequestParams.target_duration_ms = duration[0] * 6000;
      }
    }
    if (energy[0]) {
      if (energy[0] !== energy[1]) {
        RequestParams.min_energy = energy[0] * .01;
        RequestParams.max_energy = energy[1] * .01;
      } else {
        RequestParams.target_energy = energy[0] * .01;
      }
    }
    if (instrumentalness[0]) {
      if (instrumentalness[0] !== instrumentalness[1]) {
        RequestParams.min_instrumentalness = instrumentalness[0] * .01;
        RequestParams.max_instrumentalness = instrumentalness[1] * .01;
      } else {
        RequestParams.target_instrumentalness = instrumentalness[0] * .01;
      }
    }
    if (key[0]) {
      if (key[0] !== key[1]) {
        RequestParams.min_key = key[0];
        RequestParams.max_key = key[1]; 
      } else {
        RequestParams.target_key = key[0];
      }
    }

    if (liveness[0]) {
      if (liveness[0] !== liveness[1]) {
        RequestParams.min_liveness = liveness[0] * .01;
        RequestParams.max_liveness = liveness[1] * .01;
      } else {
        RequestParams.target_liveness = liveness[0] * .01;
      }
    }
    if (popularity[0]) {
      if (popularity[0] !== popularity[1]) {
        RequestParams.min_popularity = popularity[0] * .01;
        RequestParams.max_popularity = popularity[1] * .01;
      } else {
        RequestParams.target_popularity = popularity[0] * .01;
      }
    }
    if (speechiness[0]) {
      if (speechiness[0] !== speechiness[1]) {
        RequestParams.min_speechiness = speechiness[0] * .01;
        RequestParams.max_speechiness = speechiness[1] * .01;
      } else {
        RequestParams.target_speechiness = speechiness[0] * .01;
      }
    }
    if (tempo[0]) {
      if (tempo[0] !== tempo[1]) {
        RequestParams.min_tempo = tempo[0];
        RequestParams.max_tempo = tempo[1];
      } else {
        RequestParams.target_tempo = tempo[0];
      }
    }
    if (timeSig[0]) {
      if (timeSig[0] !== timeSig[1]) {
        RequestParams.min_timeSignature = timeSig[0];
        RequestParams.max_timeSignature = timeSig[1];
      } else {
        RequestParams.target_timeSignature = timeSig[0];
      }
    }
    if (valence[0]) {
      if (valence[0] !== valence[1]) {
        RequestParams.min_valence = valence[0] * .01;
        RequestParams.max_valence = valence[1] * .01;
      } else {
        RequestParams.target_valence = valence[0] * .01;
      }
    }
    if (acousticness[0]) {
      if (acousticness[0] !== acousticness[1]) {
        RequestParams.min_acousticness = acousticness[0] * .01;
        RequestParams.max_acousticness = acousticness[1] * .01;
      } else {
        RequestParams.target_acousticness = acousticness[0] * .01;
      }
    }
    if (loudness[0]) {
      if (loudness[0] !== loudness[1]) {
        RequestParams.min_loudness = loudness[0] * .01;
        RequestParams.max_loudness = loudness[1] * .01;
      } else {
        RequestParams.target_loudness = loudness[0] * .01;
      }
    }

    RequestParams.min_mode = mode[0];
    RequestParams.max_mode = mode[1];
    return RequestParams;
}

export const generatorToForm = (generator) => {

}