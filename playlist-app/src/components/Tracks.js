import React from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SaveIcon from '@material-ui/icons/Save';
import ScheduleIcon from '@material-ui/icons/Schedule';
import CachedIcon from '@material-ui/icons/Cached';
import { 
    Tooltip,
    IconButton,
    Typography,
	Divider
  } from '@material-ui/core/';

const Tracks = ({
    tracks,
    saveToSpotify,
	getTracks,
    at
}) => {

    const launchPlayer = (track) => {

    }

	const millisToMinutesAndSeconds = (millis) => {
		var minutes = Math.floor(millis / 60000);
		var seconds = ((millis % 60000) / 1000).toFixed(0);
		return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
	  }

    const renderTrack = (track) => (
        <div className="Track">
            { track.is_playable && 
                <IconButton onClick={launchPlayer(track)} aria-label="delete">
                    <PlayArrowIcon color="primary" />
                </IconButton>
            }
			<img src={track.album.images[2].url} alt="album artwork" className="Track__albumArt"/>
			<div className="Track__info">
				<div>
					<Typography variant="p1" component="h2" color="textPrimary">
						{track.name}
					</Typography>
				</div>
				<div className="Tracks__artist">
					{ track.explicit &&
						<div className="Tracks__explicit">
							E
						</div>
					}
					<div>
						<Typography variant="p1" component="h3" color="textSecondary">
							{track.artists[0].name}
						</Typography>
					</div>
				</div>
			</div>
			<div className="Track__info">
				<Typography variant="p1" component="h3" color="textSecondary">
					{track.album.name}
				</Typography>
			</div>
			<div style={{flex: '.5'}}>
				<Typography variant="p1" component="h3" color="textSecondary">
					{millisToMinutesAndSeconds(track.duration_ms)}
				</Typography>
			</div>
        </div>
    );

    return (
        <div className="NewGen__modal">
            <div className="NewGen__container">
				<Tooltip title="Refresh your playlist with new tracks.">
					<IconButton onClick={getTracks} aria-label="Refresh">
						<CachedIcon color="primary" />
					</IconButton>
				</Tooltip>
				<Tooltip title="Save your playlist to your spotify account.">
					<IconButton onClick={saveToSpotify} aria-label="Save" size="large">
						<SaveIcon color="primary" />
					</IconButton>
				</Tooltip>
				<div className="Track__header">
					<div className="Track__header-item">
						<Typography variant="p3" component="p3" color="textSecondary">
							Track
						</Typography>
					</div>
					<div className="Track__header-item">
						<Typography variant="p3" component="p3" color="textSecondary">
							Album
						</Typography>
					</div>
					<div style={{flex: '.5'}}>
						<Typography variant="p3" component="p3" color="textSecondary">
							<ScheduleIcon disabled color="textPrimary" />
						</Typography>
					</div>
				</div>
				<Divider variant="middle" />
                {tracks.map(track => renderTrack(track))}
            </div>
        </div>
    )
}

export default Tracks;