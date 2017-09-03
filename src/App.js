import React from 'react';
import {render} from 'react-dom';
import PlayersList from './PlayersList';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';



class App extends React.Component {


  render(){
    return (

          <MuiThemeProvider >
              <PlayersList />
          </MuiThemeProvider>

    );
  }
}

render(<App />, document.getElementById('app'));
