/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { PopulateSpotifyAutoComplete, getGenres } from '../app-utils'

const  MaterialAutoComplete = ({
    onChange,
    type,
    at,
    market,
    label,
    setError
}) => {
    const [value, setValue] = useState(null);
    const [options, setOptions] = useState([]);
    const [debounceId, setDebounceId] = useState(null);

    const handleChange = (e) => {
        setValue(e.target.value);
        if (debounceId) {
            clearTimeout(debounceId);
        } 
        setDebounceId(setTimeout(() => {
          if (e.target.value.length > 0) {
            getOptions(e.target.value);
          }
        }, 1000));
    }

    const getOptions = async (q) => {
        try {
            let options = null;
            if (type === 'genre') {
              options = await getGenres(at);
              if (options.error) {
                throw(options.error.message)
              }
              if (options.genres) {
                setOptions(options.genres);
              }
              return;
            } 
            
            options = await PopulateSpotifyAutoComplete(type, at, q, market);
            if (options.error) {
              throw(options.error.message)
            }
            if (options[type + 's']) {
                setOptions(options[type + 's'].items);
            }
        } catch(e) {
            console.error(e);
            setError(e);
        }
    }

    const getOptionLabel = (type) => {
      switch(type) {
        case 'artist': return (option) => option.name;
        case 'genre': return (option) => option;
        case 'track': return (option) => {
          const artists = option.artists.map((artist) => artist.name);
          return artists.length > 0 ? `${option.name} by ${artists.toString()}` : option.name;
        }
        default: return;
      }
    }

  return (
    <div style={{ width: 300 }}>
      <Autocomplete
        onChange={(e,v) => {
            onChange(e,v);
        }}
        freeSolo
        options={options}
        getOptionLabel={getOptionLabel(type)}
        renderInput={(params) => (
          <TextField {...params} label={label} margin="normal" variant="outlined" value={value} onChange={handleChange} />
        )}
      />
    </div>
  );
}

export default MaterialAutoComplete;