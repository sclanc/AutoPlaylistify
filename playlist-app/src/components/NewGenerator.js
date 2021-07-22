  import React, {useEffect, useState} from 'react';
  import MaterialSlider from './MaterialSlider';
  import MaterialAutoComplete from './MaterialAutoComplete';
  import { Divider, Typography, TextField, Button, Chip, Tooltip } from '@material-ui/core';
  import Generator from '../Generator';
  import { formToGenerator } from '../app-utils'

  const NewGenerator = ({
      exisitingGenerator,
      at,
      user,
      setError,
      setGenerators,
      closeSelf
  }) => {
    const [artists, setArtists] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [name, setName] = useState('');
    const [limit, setLimit] = useState([20]);
    const [acousticness, setacousticness] = useState([null, null]);
    const [danceability, setDanceability] = useState([null,null]);
    const [duration, setDuration] = useState([null,null]);
    const [energy, setEnergy] = useState([null,null]);
    const [instrumentalness, setInstrumentalness] = useState([null,null]);
    const [key, setKey] = useState([null,null]);
    const [liveness, setLiveness] = useState([null,null]);
    const [loudness, setLoudness] = useState([null,null]);
    const [mode, setMode] = useState([0,1]);
    const [popularity, setPopularity] = useState([null,null]);
    const [speechiness, setSpeechiness] = useState([null,null]);
    const [tempo, setTempo] = useState([null,null]);
    const [timeSig, setTimeSig] = useState([null,null]);
    const [valence, setValence] = useState([null,null]);

    useEffect(() => {
        if(exisitingGenerator) {
           setArtists(exisitingGenerator.artists);
           setTracks(exisitingGenerator.tracks);
           setGenres(exisitingGenerator.genres);
           setName(exisitingGenerator.name);
           setLimit(exisitingGenerator.limit);
           setacousticness(exisitingGenerator.acousticness);
           setDanceability(exisitingGenerator.danceability);
           setDuration(exisitingGenerator.duration);
           setEnergy(exisitingGenerator.energy);
           setInstrumentalness(exisitingGenerator.instrumentalness);
           setKey(exisitingGenerator.key);
           setLiveness(exisitingGenerator.liveness);
           setLoudness(exisitingGenerator.loudness);
           setMode(exisitingGenerator.mode);
           setPopularity(exisitingGenerator.popularity);
           setSpeechiness(exisitingGenerator.speechiness);
           setTempo(exisitingGenerator.tempo);
           setTimeSig(exisitingGenerator.timeSig);
           setValence(exisitingGenerator.valence);
        }
    }, [exisitingGenerator])

    const getSeedIndex = (seed, type) => {
        switch(type) {
            case 'artist': return artists.map(s => s.id).indexOf(seed.id);
            case 'track': return tracks.map(s => s.id).indexOf(seed.id);
            case 'genre': return genres.indexOf(seed);
            default: return -1;
        }
    }

    const addSeeds = (seed, type) => {
        const i = getSeedIndex(seed, type);
        switch(type) {
            case 'artist': 
                if (artists.length >= 5) return;
                if (i >= 0) return; 
                setArtists((artists) => [...artists, seed]); 
                break;
            case 'track':
                if (tracks.length >= 5) return;
                if (i >= 0) return;
                setTracks((tracks) => [...tracks, seed]);
                break;
            case 'genre':
                if (genres.length >= 5) return;
                if (i >= 0) return;
                setGenres((genres) => [...genres, seed]);
                break;
            default: return;
        }
    }

    const deleteSeed = (seed, type) => {
        switch (type) {
            case 'artist': 
                const newArtists = artists.filter((item) => item.id !== seed.id);
                setArtists(newArtists);
                break;
            case 'track':
                const newTracks = tracks.filter((item) => item.id !== seed.id);
                setTracks(newTracks);
                break;
            case 'genre':
                const newGenres = genres.filter((item) => item !== seed);
                setGenres(newGenres);
                break;
            default: return;
        }
    }

    const makeChips = (items, type) => items.map(item => (
        <Chip
            key={item.id}
            label={item.name ? item.name : item}
            onDelete={() => deleteSeed(item, type)}
        />
    ));

    const formIsValid = () => {
        return name.length > 0 && artists.length > 0 && tracks.length > 0 && genres.length > 0;
    }

    const saveGenerator = async () => {
        const market = user.country;
        const user_id = user.id;
        const gen = new Generator(formToGenerator({
            artists,
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
            user_id
        }));
        try {
            const res = await fetch('http://localhost:8888/generator', {
                method: 'POST',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(gen.postBody())
              }).then(res => res.json()); 

              if (res.success) {
                setGenerators((generators) => [ gen, ...generators]);
              } else {
                  throw res.error;
              }
            closeSelf();     
        } catch(e) {
            if (e.message) {
                setError(e.message);
            }
        }
    }

    return (
        <div className="NewGen__modal">
            <div className="NewGen__container">
                <Typography variant="h2" component="h2" color="textSecondary" style={{paddingBottom: '20px'}}>Playlist Details</Typography>
                <Typography variant="h6" component="div" color="textSecondary">Required Information</Typography>
                <div className="NewGen__required">
                    <div className="NewGen__required-group">
                        <div>
                            <TextField
                                label={'Name'}
                                margin="normal"
                                variant="outlined"
                                value={name}
                                onChange={(e) => setName(e.target.value) }
                            />
                        </div>
                        <div>
                            <MaterialAutoComplete
                                setError={setError}
                                onChange={(e,v) => v ? addSeeds(v,'genre') : undefined}
                                type="genre"
                                at={at}
                                market={user.country}   
                                label="Genres" 
                            />
                            <div className="NewGen__chips">
                                {makeChips(genres, 'genre')}
                            </div>
                        </div>
                    </div>
                    <div className="NewGen__required-group">
                        <div>
                            <MaterialAutoComplete
                                setError={setError}
                                onChange={(e,v) => v ? addSeeds({ id: v.id, name: v.name},'artist') : undefined}
                                type="artist"
                                at={at}
                                market={user.country}  
                                label="Artists"  
                            />
                            <div className="NewGen__chips">
                                {makeChips(artists, 'artist')}
                            </div>
                        </div>
                        <div>
                            <MaterialAutoComplete
                                setError={setError}
                                onChange={(e,v) => v ? addSeeds({ id: v.id, name: v.name},'track') : undefined}
                                type="track"
                                at={at}
                                market={user.country}    
                                label="Tracks"
                            />
                            <div className="NewGen__chips">
                                {makeChips(tracks, 'track')}
                            </div>
                        </div>
                    </div>
                </div>
                <Divider variant="middle" />
                <Tooltip title="Specify a minimum and maximum value for any of the following attributes. If min and max are the same, the value will be used as the target">
                    <Typography variant="h6" component="div" color="textSecondary" style={{marginTop: '30px'}}>Optional Details</Typography>
                </Tooltip>
                <div className="NewGen__optional">
                    <MaterialSlider
                        valueLabelDisplay="auto"
                        title={'Number of Tracks'}
                        value={limit}
                        min={1}
                        required={true}
                        marks={[
                            {
                                value: 1,
                                label: 1
                            },
                            {
                                value: 20,
                                label: 20
                            },
                            {
                                value: 40,
                                label: 40
                            },
                            {
                                value: 60,
                                label: 60
                            },
                            {
                                value: 80,
                                label: 80
                            },
                            {
                                value: 100,
                                label: 100
                            }
                        ]}
                        description="defaults to 20"
                        onChange={(e,v) => setLimit(v)}
                    />
                    <MaterialSlider
                        valueLabelDisplay="auto"
                        title={'acousticness'}
                        description="A measure of whether or not a track is recorded in the acoustic style, without electric amplification."
                        marks={[
                            {
                                value: 0,
                                label: 'electric'
                            },
                            {
                                value: 33,
                                label: 'less electric'
                            },
                            {
                                value: 66,
                                label: 'more acoustic'
                            },
                            {
                                value: 100,
                                label: 'mostly acoustic'
                            },
                        ]}
                        value={acousticness} 
                        onChange={(e,v) => setacousticness(v)}
                    />
                    <MaterialSlider
                        valueLabelDisplay="auto"
                        title={'Danceability'}
                        marks={[
                            {
                                value: 0,
                                label: 'dirge'
                            },
                            {
                                value: 33,
                                label: 'more danceable'
                            },
                            {
                                value: 66,
                                label: 'mostly danceable'
                            },
                            {
                                value: 100,
                                label: 'move it, move it'
                            },
                        ]}
                        description="A measure of how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity."
                        value={danceability} 
                        onChange={(e,v) => setDanceability(v)}
                    />
                    <MaterialSlider
                        valueLabelDisplay="auto"
                        title={'Energy'}
                        marks={[
                            {
                                value: 0,
                                label: 'chill'
                            },
                            {
                                value: 33,
                                label: 'coffee shop'
                            },
                            {
                                value: 66,
                                label: 'pumped up'
                            },
                            {
                                value: 100,
                                label: 'rave'
                            },
                        ]}
                        description="Represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy."
                        value={energy} 
                        onChange={(e,v) => setEnergy(v)}
                    />
                    <MaterialSlider
                        valueLabelDisplay="auto"
                        title={'Instrumentalness'}
                        marks={[
                            {
                                value: 0,
                                label: 'contains vocals'
                            },
                            {
                                value: 100,
                                label: 'instrumental'
                            }
                        ]}
                        description="Predicts whether a track contains no vocals. “Ooh” and “aah” sounds are treated as instrumental in this context"
                        value={instrumentalness} 
                        onChange={(e,v) => setInstrumentalness(v)}
                    />
                    <MaterialSlider
                        valueLabelDisplay="off"
                        title={'Key'}
                        min={0}
                        max={11}
                        marks={[
                            {
                                value: 0,
                                label: 'C'
                            },
                            {
                                value: 1,
                                label: 'C#'
                            },
                            {
                                value: 2,
                                label: 'D'
                            },
                            {
                                value: 3,
                                label: 'D#'
                            },
                            {
                                value: 4,
                                label: 'E'
                            },
                            {
                                value: 5,
                                label: 'F'
                            },
                            {
                                value: 6,
                                label: 'F#'
                            },
                            {
                                value: 7,
                                label: 'G'
                            },
                            {
                                value: 8,
                                label: 'G#'
                            },
                            {
                                value: 9,
                                label: 'A'
                            },
                            {
                                value: 10,
                                label: 'A#'
                            },
                            {
                                value: 11,
                                label: 'B'
                            }
                        ]}
                        value={key} 
                        onChange={(e,v) => setKey(v)}
                    />
                    <MaterialSlider
                        valueLabelDisplay="auto"
                        title={'Liveness'}
                        marks={[
                            {
                                value: 0,
                                label: 'no audiance'
                            },
                            {
                                value: 66,
                                label: 'live recording'
                            },
                            {
                                value: 100,
                                label: 'large, excited audiance'
                            }
                        ]}
                        description="Detects the presence of an audience in the recording. A value above 80 provides strong likelihood that the track is live."
                        value={liveness} 
                        onChange={(e,v) => setLiveness(v)}
                    />
                    <MaterialSlider
                        valueLabelDisplay="auto"
                        title={'Loudness'}
                        marks={[
                            {
                                value: 0,
                                label: 'quiet'
                            },
                            {
                                value: 100,
                                label: 'loud'
                            }
                        ]}
                        value={loudness} 
                        onChange={(e,v) => setLoudness(v)}
                    />
                    <MaterialSlider
                        valueLabelDisplay="auto"
                        description="Speechiness detects the presence of spoken words in a track."
                        title={'Speechiness'}
                        value={speechiness}
                        marks={[
                            {
                                value: 0,
                                label: 'music',
                            },
                            {
                                value: 33,
                                label: 'music & speech',
                            },
                            {
                                value: 66,
                                label: 'mostly words',
                            },
                            {
                                value: 100,
                                label: 'all words',
                            }
                        ]}
                        onChange={(e,v) => setSpeechiness(v)}
                    />
                <MaterialSlider
                        title={'Duration'}
                        description="The acceptable duration of selected tracks"
                        aria-labelledby="continuous-slider"
                        value={duration}
                        max={100}
                        valueLabelDisplay="off"
                        step={5}
                        marks={[
                                {
                                  value: 10,
                                  label: '1:00',
                                },
                                {
                                  value: 20,
                                  label: '2:00',
                                },
                                {
                                  value: 30,
                                  label: '3:00',
                                },
                                {
                                  value: 40,
                                  label: '4:00',
                                },
                                {
                                value: 50,
                                label: '5:00',
                                },
                                {
                                value: 60,
                                label: '6:00',
                                },
                                {
                                value: 70,
                                label: '7:00',
                                },
                                {
                                value: 80,
                                label: '8:00',
                                },
                                {
                                value: 90,
                                label: '9:00',
                                },
                                {
                                value: 100,
                                label: '10:00',
                                },
                              ]}
                        onChange={(e,v) => setDuration(v)}
                    />
                    <MaterialSlider
                        valueLabelDisplay="auto"
                        title={'Mode'}
                        min={0}
                        max={1}
                        required={true}
                        marks={[
                            {
                                value: 0,
                                label: 'minor'
                            },
                            {
                                value: 1,
                                label: 'major'
                            }
                        ]}
                        value={mode} 
                        onChange={(e,v) => setMode(v)}
                    />
                    <MaterialSlider
                        valueLabelDisplay="auto"
                        title={'Popularity'}
                        marks={[
                            {
                                value: 0,
                                label: 'obscure'
                            },
                            {
                                value: 100,
                                label: 'popular'
                            }
                        ]}
                        value={popularity} 
                        onChange={(e,v) => setPopularity(v)}
                    />
                    <MaterialSlider
                        valueLabelDisplay="auto"
                        title={'Tempo'}
                        min={30}
                        max={300}
                        marks={[
                            {
                                value: 30,
                                label: '30 BPM'
                            },
                            {
                                value: 300,
                                label: '300 BPM'
                            }
                        ]}
                        value={tempo} 
                        onChange={(e,v) => setTempo(v)}
                    />
                    <MaterialSlider
                        valueLabelDisplay="off"
                        title={'Time Signature'}
                        min={2}
                        max={12}
                        step={null}
                        marks={[
                            {
                                value: 2,
                                label: '2/4'
                            },
                            {
                                value: 3,
                                label: '3/4'
                            },
                            {
                                value: 4,
                                label: '4/4'
                            },
                            {
                                value: 5,
                                label: '5/4'
                            },
                            {
                                value: 6,
                                label: '6/8'
                            },
                            {
                                value: 9,
                                label: '9/8'
                            },
                            {
                                value: 12,
                                label: '12/8'
                            },
                        ]}
                        value={timeSig} 
                        onChange={(e,v) => setTimeSig(v)}
                    />
                    <MaterialSlider
                        valueLabelDisplay="auto"
                        title={'Valence'}
                        marks={[
                            {
                                value: 0,
                                label: 'less happy'
                            },
                            {
                                value: 100,
                                label: 'most happy'
                            }
                        ]}
                        value={valence} 
                        onChange={(e,v) => setValence(v)}
                    />
                </div>
                <div className="NewGen__submit">
                    <Button
                        variant="contained"
                        color="primary"
                        size='large'
                        onClick={() => formIsValid() ? saveGenerator() : setError('Name, Artist(s), Genre(s), and Track(s) are required')}
                    >
                        Save Playlist Generator
                    </Button>
                </div>
            </div>
        </div>
    );
  };

export default NewGenerator;