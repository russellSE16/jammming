import React from 'react';
import './PlaylistListItem.css';

class PlaylistListItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.props.selectPlaylist(this.props.id);
    }
    render() {
        return (
            <div className="PlaylistListItem">
                <h3 onClick={this.handleClick}>{this.props.name}</h3>
            </div>
        )
    }
}

export default PlaylistListItem;