import React, {Component} from 'react';

class AppHeader extends Component {
    render() {
        return (
            <React.Fragment>
                <div>
                    <h1 className="App-title">Minesweeper UI</h1>
                    <div id='intro' className="App-intro">
                        Minesweeper API Client
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AppHeader;
