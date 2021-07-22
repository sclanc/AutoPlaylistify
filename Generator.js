module.exports = class {
    constructor({
        seed_artists,
        seed_genres,
        seed_tracks,
        name,
        limit,
        market,
        min_danceability,
        min_duration_ms,
        min_energy,
        min_instrumentalness,
        min_key,
        min_liveness,
        min_popularity,
        min_speechiness,
        min_tempo,
        min_timeSignature,
        min_valence,
        min_acousticness,
        min_loudness,
        min_mode,
        max_danceability,
        max_duration_ms,
        max_energy,
        max_instrumentalness,
        max_key,
        max_liveness,
        max_popularity,
        max_speechiness,
        max_tempo,
        max_timeSignature,
        max_valence,
        max_acousticness,
        max_loudness,
        max_mode,
        target_danceability,
        target_duration_ms,
        target_energy,
        target_instrumentalness,
        target_liveness,
        target_popularity,
        target_speechiness,
        target_tempo,
        target_timeSignature,
        target_valence,
        target_acousticness,
        target_loudness,
    }) {

    this.limit = limit;
    this.name = name;
    this.market = market;
    this.seed_artists = seed_artists;
    this.seed_tracks = seed_tracks;
    this.seed_genres = seed_genres;
    this.min_danceability = min_danceability;
    this.min_duration_ms = min_duration_ms;
    this.min_energy = min_energy;
    this.min_instrumentalness = min_instrumentalness;
    this.min_key = min_key;
    this.min_liveness = min_liveness;
    this.min_danceability = min_danceability;
    this.min_popularity = min_popularity;
    this.min_speechiness = min_speechiness;
    this.min_tempo = min_tempo;
    this.min_timeSignature = min_timeSignature;
    this.min_valence = min_valence;
    this.min_acousticness = min_acousticness;
    this.min_loudness = min_loudness;
    this.min_mode = min_mode;
    this.max_danceability = max_danceability;
    this.max_duration_ms = max_duration_ms;
    this.max_energy = max_energy;
    this.max_instrumentalness = max_instrumentalness;
    this.max_key = max_key;
    this.max_liveness = max_liveness;
    this.max_danceability = max_danceability;
    this.max_popularity = max_popularity;
    this.max_speechiness = max_speechiness;
    this.max_tempo = max_tempo;
    this.max_timeSignature = max_timeSignature;
    this.max_valence = max_valence;
    this.max_acousticness = max_acousticness;
    this.max_loudness = max_loudness;
    this.max_mode = max_mode;
    this.target_danceability = target_danceability;
    this.target_duration_ms = target_duration_ms;
    this.target_energy = target_energy;
    this.target_instrumentalness = target_instrumentalness;
    this.target_liveness = target_liveness;
    this.target_danceability = target_danceability;
    this.target_popularity = target_popularity;
    this.target_speechiness = target_speechiness;
    this.target_tempo = target_tempo;
    this.target_timeSignature = target_timeSignature;
    this.target_valence = target_valence;
    this.target_acousticness = target_acousticness;
    this.target_loudness = target_loudness;
    }

    format(type) {
        if(this[type] !== undefined && this[type] !== null) {
            return `&${type}=${this[type]}`
        }
        return '';
    }

    async run(at, setError) {
        if (!at) return;
        try {
            const response = await fetch(`https://api.spotify.com/v1/recommendations?name=${this.name}
${this.format('limit')}
${this.format('name')}
${this.format('market')}
${this.format('seed_artists')}
${this.format('seed_tracks')}
${this.format('seed_genres')}
${this.format('min_duration_ms')}
${this.format('min_energy')}
${this.format('min_instrumentalness')}
${this.format('min_key')}
${this.format('min_liveness')}
${this.format('min_danceability')}
${this.format('min_popularity')}
${this.format('min_speechiness')}
${this.format('min_tempo')}
${this.format('min_timeSignature')}
${this.format('min_valence')}
${this.format('min_acousticness')}
${this.format('min_loudness')}
${this.format('min_mode')}
${this.format('max_danceability')}
${this.format('max_duration_ms')}
${this.format('max_energy')}
${this.format('max_instrumentalness')}
${this.format('max_key')}
${this.format('max_liveness')}
${this.format('max_popularity')}
${this.format('max_speechiness')}
${this.format('max_tempo')}
${this.format('max_timeSignature')}
${this.format('max_valence')}
${this.format('max_acousticness')}
${this.format('max_loudness')}
${this.format('max_mode')}
${this.format('target_duration_ms')}
${this.format('target_energy')}
${this.format('target_instrumentalness')}
${this.format('target_liveness')}
${this.format('target_danceability')}
${this.format('target_popularity')}
${this.format('target_speechiness')}
${this.format('target_tempo')}
${this.format('target_timeSignature')}
${this.format('target_valence')}
${this.format('target_acousticness')}
${this.format('target_loudness')}`, {
                headers: {
                    Authorization: 'Bearer ' + at
                }
            }).then((response) => response.json());
            
            if (response.error) {
                throw(response.error);
            } else {
                this.playlist = response.tracks;
                return this.playlist;
            }
            
        } catch (e) {
            if (setError) {
                setError(e);
            } else {
                throw(e);
            }
        }
    }
}