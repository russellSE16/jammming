import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import PlaylistList from '../PlaylistList/PlaylistList';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import {userId} from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlists: [],
      playlistName: 'New Playlist',
      playlistId: null,
      playlistTracks: [],
      userId: null
    };
    this.search = this.search.bind(this);
    this.updatePlaylists = this.updatePlaylists.bind(this);
    this.selectPlaylist = this.selectPlaylist.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }
  componentDidMount() {
    this.updatePlaylists();
  }
  async search(term) {
    const results = await Spotify.search(term);
    this.setState({ searchResults: results });
  }
  async updatePlaylists() {
    const latestUserPlaylists = await Spotify.getUserPlaylists();
    this.setState({ 
      playlists: latestUserPlaylists,
      userId: userId 
    });
  }
  async selectPlaylist(id) {
    const selectedPlaylist = await Spotify.getPlaylist(id);
    this.setState({
      playlistName: selectedPlaylist.name,
      playlistId: id,
      playlistTracks: selectedPlaylist.tracks
    });
  }
  addTrack(track) {
    const newPlaylistTracks = [];
    let isInPlaylist = false;
    this.state.playlistTracks.forEach(playlistTrack => {
      newPlaylistTracks.push(playlistTrack);
      if (track.id === playlistTrack.id) {
        isInPlaylist = true;
      }
    })
    if (!isInPlaylist) {
      newPlaylistTracks.push(track);
      this.setState({ playlistTracks: newPlaylistTracks });
    }
  }
  removeTrack(track) {
    const newPlaylistTracks = this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id);
    this.setState({ playlistTracks: newPlaylistTracks });
  }
  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }
  async savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    await Spotify.savePlaylist(this.state.playlistName, this.state.playlistId, trackUris);
    this.updatePlaylists();
    this.setState({
      playlistName: 'New Playlist',
      playlistId: null,
      playlistTracks: []
    });
    
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults 
              searchResults={this.state.searchResults} 
              onAdd={this.addTrack}
            />
            <Playlist 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack} 
              onNameChange={this.updatePlaylistName} 
              onSave={this.savePlaylist} 
            />
            <PlaylistList 
              userPlaylists={this.state.playlists}
              userId={this.state.userId}
              updatePlaylists={this.updatePlaylists}
              selectPlaylist={this.selectPlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
