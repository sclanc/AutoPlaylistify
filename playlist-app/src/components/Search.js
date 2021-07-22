import React from 'react';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';


const Search = ({
    onKeyUp
}) => (
    <div className="Search">
        <div>
        <SearchIcon />
        </div>
        <InputBase
        placeholder="Search…"
        inputProps={{ 'aria-label': 'search' }}
        />
  </div>
);

export default Search;