import React from 'react';
import './PlaylistList.css';
import PlaylistListItem from '../PlaylistListItem/PlaylistListItem';

class PlaylistList extends React.Component {
    render() {
        return (
            <div className="PlaylistList">
                <h2>Playlists for {this.props.userId}</h2>
                {this.props.userPlaylists.map(playlist => {
                    return <PlaylistListItem key={playlist.id} id={playlist.id} name={playlist.name} selectPlaylist={this.props.selectPlaylist} /> 
                })}
            </div>
        )
    }
}

export default PlaylistList;