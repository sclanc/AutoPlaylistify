import React from 'react'
import { Typography } from '@material-ui/core';
import soundwave from './../images/s.png';
import sliders from './../images/sliders.png';
import gencard from './../images/gencard.png';

const Splash = ({
    hide
}) => {
    if (hide) return null;
    return (
        <div className="Splash">
            <div className="Splash__item">
                <div className="first" style={{backgroundImage: `url(${soundwave})`}}>
                    <Typography variant="h3" component="h2" color="textPrimary">
                        Harness the power of Spotify's Recomendations System to discover new music your way!
                    </Typography>
                </div>   
            </div>
            <div className="Splash__item">
                <img className="Splash__image" src={sliders} alt="sliders"/>
                <div className="Splash__item-text">
                    <Typography variant="h5" component="h2" color="textPrimary">
                        Perfect your recomendations, by optomizing for anything from popularity, and dancability, to tempo, time signature, and much more. 
                    </Typography>
                    <Typography variant="h5" component="h2" color="textPrimary" style={{paddingTop: '60px'}}>
                            Save your recomendation preferences, and use them to create playlists. You can even save them to your spotify account!
                    </Typography>
                </div>
            </div>
            <div className="Splash__item" style={{paddingBottom: '10px'}}>
                <div>
                    <div className="Splash__item-text">
                        <Typography variant="h5" component="h2" color="textPrimary">
                        Create a daily, weekly or monthly refresh schedule for your playlists, so you can keep your music fresh.
                        </Typography>
                    </div>
                    <div className="Splash__item-text" style={{paddingTop: '60px'}}>
                        <Typography variant="h5" component="h2" color="textPrimary">
                            Log in with your Spotify account to get Started.
                        </Typography>
                    </div>
                </div>
                <img className="Splash__image" src={gencard} alt="generator card"/>
            </div>
        </div>
    )
}

export default Splash;