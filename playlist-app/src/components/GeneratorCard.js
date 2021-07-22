import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';
import CachedIcon from '@material-ui/icons/Cached';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { 
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Modal,
  Tooltip,
  IconButton,
} from '@material-ui/core/';


const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 320,
    width: 320
  },
});

 const  GeneratorCard = ({
    generator, // use custom hook and deep equals to properly rerender.
    at,
    setError,
    edit
 }) =>  {
  const classes = useStyles();

  const [tracks, setTracks] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [artwork, setArtwork] = useState([]);
  const [featuredArtists, setFeatured] = useState([]);
  const [showTracks, setShowTracks] = useState(false);


  const getTracks = async () => {
    const tracks = await generator.run(at);
    console.log(tracks);
    setTracks(tracks);
    getArtwork(tracks[0].artists[0].href);
    getArtwork(tracks[1].artists[0].href);
    getArtwork(tracks[2].artists[0].href);
    getArtwork(tracks[3].artists[0].href);
  }

  useEffect(() => {
    if (generator && at) {
      getTracks();
    }
  }, [generator, at]);

  const toggleModal = () => setShowTracks((prev) => !prev);

  const getArtwork = (href) => {
    try {
      fetch(href,{
        headers: {
          Authorization: 'Bearer ' + at
        }
      })
      .then((response) => {
        if(response.status > 300) {
          throw response.error;
        } else {
          return response.json();
        }
      }).then((json) =>{
        setArtwork((art) => [...art, json.images[2].url]);
        setFeatured((artist) => [...artist, json.name]);
      })
    } catch(e) {
      console.error(e);
      setError(e);
      return null;
    }
  }

  const saveToSpotify = () => {
    try {
      fetch(`https://api.spotify.com/v1/users/${generator.user_id}/playlists`,{
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Authorization': 'Bearer ' + at,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: `${generator.name} (from AutoPlaylistify)`})
      }).then((response) => {
        if (response.status > 300) {
          throw response.error;
        } 
        return response;
      }).then((response) => response.json())
      .then((json) => {
        if (json.id) {
          fetch(`https://api.spotify.com/v1/playlists/${json.id}/tracks`, {
            method: 'POST',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
              'Authorization': 'Bearer ' + at,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              position: 0,
              uris: tracks.map((track) => track.uri)
            })
          })
        } else {
          setError('Unable to save playlist');
        }
      })
    } catch(e) {
      console.log(e);
      setError('Unable to save playlist');
    }
  }

  const renderArt = (i) => (
     <div className="GeneratorCard__images" style={artwork[i] ? {backgroundImage: `url(${artwork[i]})`, backgroundSize: 'cover'} : {backgroundColor: 'grey'}} alt="Album Artwork" />
  )

  const renderArtwork = () => (
    <div style={{width: '386px'}}>
      <div style={{display: 'flex'}}>
        {renderArt(0)}
        {renderArt(1)}
      </div>
      <div style={{display: 'flex'}}>
        {renderArt(2)}
        {renderArt(3)}
      </div>
    </div>
  )

  return (
    <div style={{paddingTop: '25px'}}>
      <Card className={classes.root}>
        <CardActionArea onClick={toggleModal}>
          <CardMedia className={classes.media}>
            {renderArtwork()}
          </CardMedia>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {generator.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              <div>
                {`Inspired by: ${generator.seed_genres.join(', ')}`}
              </div>
              <div>
                {`Featuring: ${featuredArtists[0]}, ${featuredArtists[1]}, ${featuredArtists[2]}, and more.`}
              </div>
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Tooltip title="Refresh your playlist with new tracks.">
            <IconButton onClick={getTracks} aria-label="Refresh">
              <CachedIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save your playlist to your spotify account.">
            <IconButton onClick={saveToSpotify} aria-label="Save">
              <SaveIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Schedule your playlist to refresh and save to your spotify account automatically. (still in development)">
            <IconButton aria-label="Schedule">
              <ScheduleIcon disabled color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share this playlist with a friend (still in development)">
            <IconButton aria-label="Share">
              <ShareIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit your playlist generator">
            <IconButton onClick={() => edit(generator.toFormData())} aria-label="Edit">
              <EditIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete your playlist generator">
            <IconButton aria-label="delete">
              <DeleteIcon color="primary" />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    <Modal 
      open={showTracks}
      onBackdropClick={toggleModal}
    > 

    </Modal>
    </div>
  );
}

export default GeneratorCard;