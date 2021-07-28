import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Link } from "react-router-dom";

const Header = ({
    user
}) => (
    <AppBar position='static'>
		<Link to="/">
			<Typography variant="h2" component="h2" color="textPrimary">
				Autoplaylistify
			</Typography>
		</Link>
        {!user ? (
        <div>
            <a href="http://localhost:8888/login">
                <Typography variant="h4" component="h2" color="textPrimary">
                    Login
                </Typography>
            </a>
        </div>

        ) : (
			<div className="Header__items">
				<Link to="/Discover">
					<Typography variant="h4" component="h2" color="textPrimary">
						Discover
					</Typography>
				</Link>
				<Link to="/Reporting">
					<Typography variant="h4" component="h2" color="textPrimary">
						Reporting
					</Typography>
				</Link>
				<Avatar src={user.images[0].url} />
			</div>
        )}
        
    </AppBar>
);

export default Header;
