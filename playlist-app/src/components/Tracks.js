import React from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SaveIcon from '@material-ui/icons/Save';
import { 
    Tooltip,
    IconButton,
    Typography,
  } from '@material-ui/core/';

const Tracks = ({
    tracks,
    saveToSpotify,
    at
}) => {

    const launchPlayer = (track) => {

    }

    const renderTrack = (track) => (
        <div>
            { track.is_playable && 
                <IconButton onClick={launchPlayer(track)} aria-label="delete">
                    <PlayArrowIcon color="primary" />
                </IconButton>
            }
            <div>
                <Typography>
                    {track.name}
                </Typography>
            </div>
            <div>
                { track.explicit &&
                    <div>
                        <Typography>
                            E
                        </Typography>
                    </div>
                }
                <div>
                    {track.artists[0].name}
                </div>
            </div>
        </div>
    );

    return (
        <div className="NewGen__modal">
            <Tooltip title="Save your playlist to your spotify account.">
                <IconButton onClick={saveToSpotify} aria-label="Save">
                    <SaveIcon color="primary" />
                </IconButton>
            </Tooltip>
            <div className="NewGen__container">
                {tracks.map(track => renderTrack(track))}
            </div>
        </div>
    )
}

export default Tracks;