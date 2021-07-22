import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const Header = ({
    user
}) => (
    <AppBar position='static'>
        <div>AutoPlaylistify</div>
        {!user ? (
        <div>
            <a href="http://localhost:8888/login">
                <Typography>
                    Login
                </Typography>
            </a>
        </div>

        ) : (
            <Avatar src={user.images[0].url} />
        )}
        
    </AppBar>
);

export default Header;
