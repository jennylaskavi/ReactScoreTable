import React from 'react';
import Player from './Player';
import {Card} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Pagination from 'material-ui-pagination';
import {SearchIcon} from 'material-ui/svg-icons/action/search';


import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const styles = {

  root:{
    width:'60%',
    marginLeft: 'auto',
    marginRight: 'auto',

  },

  title:{
    fontSize:'20px',
    color:'blue',
    textAlign:'center'
  },

  search:{
    marginRight:'70%',
    marginLeft:'30%',

  },

  paging:{
    marginLeft:'35%',
  },
  suspected:{
    backgroundColor:'red',
  }
}

class PlayersList extends React.Component {
  constructor(props){
    super(props);
    this.setTotal = this.setTotal.bind(this);
    this.setDisplay = this.setDisplay.bind(this);
    this.state = {
      search: '',
      players:null,
      allPlayers:null,
      suspected:null,
      total: 0,
      number: 1,
      display:5,
      levelFilter:"all"
    };
  }


    componentDidMount() {
      fetch('/api/v1/players?start=0&n=2000')
        .then(response => response.json())
        .then((players) => {
          this.setState({
            players:players.slice(0,5),
            allPlayers:players,
            total:players.length / 5,
          });
        });

        fetch('/api/v1/players/suspects')
        .then(response => response.json())
        .then((suspected) => {
          this.setState({suspected});
        });
    }


  setTotal(event, total) {
     total = total.trim();
     if (total.match(/^\d*$/)) {
       if (total !== '') {
         total = parseInt(total, 5);
       } else {
         total = 0;
       }

       this.setState({ total });
     }
   }

   setDisplay(event, display) {
    display = display.trim();
    if (display.match(/^\d*$/)) {
      if (display !== '') {
        display = parseInt(display, 5);
      } else {
        display = 0;
      }

      this.setState({ display });
    }
  }


  onPageChange(page){
    const currentIndex = (page - 1) * 5;
    this.setState({
      players: this.state.allPlayers.slice(currentIndex, currentIndex + 5),
      number: page
    });
  }


  updateSearch(event) {
    this.setState({
      search:event.target.value
    });
  }


  handleLevelChange(event,index, level){
    console.log("level changed");
    this.setState({
      levelFilter:level
    });
  }

  render(){
    if (!this.state.players) {
      return <div>Loading</div>;
    }


    let filteredPlayers = this.state.players.filter(
      (player) => {
      return (player.name.toLowerCase().includes( this.state.search.toLowerCase() ) || ﻿
         player.level.toLowerCase().includes( this.state.search.toLowerCase() )
       )
      }
    );
    return (

          <div style={styles.root}>
            <div style={styles.title}>Tournament 101 - Final Results</div>
              <TextField style={styles.search} fullWidth={true} underlineShow={false} hintText="Search..."
                value={this.state.search}
                onChange={this.updateSearch.bind(this)}/>
                <Table
                    height={'60vh'}
                    bodyStyle={{overflow:'visible'}}
                >
                  <TableHeader
                  adjustForCheckbox={false}
                  displaySelectAll={false}
                >
                      <TableRow>
                        <TableHeaderColumn>Id</TableHeaderColumn>
                        <TableHeaderColumn>Name</TableHeaderColumn>


                        <DropDownMenu value={this.state.levelFilter} onChange={this.handleLevelChange}>
                         <MenuItem value={"all"} primaryText="Level : all"></MenuItem>
                         <MenuItem value={"pro"} primaryText="pro" />
                         <MenuItem value={"amateur"} primaryText="amateur" />
                         <MenuItem value={"rookie"} primaryText="rookie" />
                        </DropDownMenu>


                        <TableHeaderColumn>Score</TableHeaderColumn>
                      </TableRow>
                  </TableHeader>

                  <TableBody displayRowCheckbox={false} showRowHover={false} stripedRows={true}>
                    {filteredPlayers.map((player) =>
                      this.state.suspected.includes(player.id) ? (
                        <TableRow style={styles.suspected} key={player.id}>
                          <TableRowColumn>{player.id}</TableRowColumn>
                          <TableRowColumn>{player.name.charAt(0).toUpperCase()+player.name.slice(1)}</TableRowColumn>
                          <TableRowColumn>{player.level}</TableRowColumn>
                          <TableRowColumn>{player.score}</TableRowColumn>
                        </TableRow>
                      ) :
                      (
                        <TableRow key={player.id}>
                          <TableRowColumn>{player.id}</TableRowColumn>
                          <TableRowColumn>{player.name.charAt(0).toUpperCase()+player.name.slice(1)}</TableRowColumn>
                          <TableRowColumn>{player.level}</TableRowColumn>
                          <TableRowColumn>{player.score}</TableRowColumn>
                        </TableRow>
                      )

                    )}
                  </TableBody>
               </Table>
            <div style={styles.paging}>
                <Pagination
                  total = { this.state.total }
                  current = { this.state.number }
                  display = { this.state.display }
                  onChange = {this.onPageChange.bind(this)}

                />
            </div>

          </div>


    );
  }
}

export default PlayersList;
