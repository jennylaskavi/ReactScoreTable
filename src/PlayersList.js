import React from 'react';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Pagination from 'material-ui-pagination';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import {Toolbar,ToolbarGroup} from 'material-ui/Toolbar';
import SvgIcon from 'material-ui/SvgIcon';

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
    color: '#CEF0D4',
    fontFamily: 'Rouge Script, cursive',
    fontSize: '48px',
    fontWeight: 'normal',
    lineHeight: '48px',
    margin: '0 0 50px',
    textAlign: 'center',
    textShadow: '1px 1px 2px #082b34'
  },

  search:{

    marginRight:'70%',
    marginLeft:'30%',
    width:'30%',


  },

  paging:{
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor:'rgba(255, 255, 255,0.8)',
    textAlign: 'center',

  },
  suspected:{
    backgroundColor:'#FF7073'
  },
  dropMenuLine:{
     display: 'none'
  },
  errow:{
    fill: 'black',
  },
  level:{
    marginLeft:'-2.5vh'
  },
  header:{
    color:'#0A0A0A',
    fontWeight: 'bold',
    fontSize:'14px'
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
      levelFilter:"all",
      currentIndex:0,
    };
  }


    componentDidMount() {
      fetch('/api/v1/players?start=0&n=2000')
        .then(response => response.json())
        .then((players) => {
          this.setState({
            players:players,
            filteredPlayers:players,
            allPlayers:players,
            total:Math.round(players.length / 5)
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
    const level = this.state.levelFilter;
    if(level === "all"){
      this.setState({
        players: this.state.allPlayers,
        number: page,
        currentIndex:currentIndex,
        total:Math.round(this.state.allPlayers.length / 5)
      });
    }else{
      this.setState({
        players: this.state.allPlayers.filter((player) => player.level.includes(this.state.levelFilter)),
        number: page,
        currentIndex:currentIndex,
        total:Math.round(this.state.allPlayers.filter((player) => player.level.includes(this.state.levelFilter)).length/5 )
      });
    }

  }


  updateSearch(event) {
    let level = this.state.levelFilter;
      this.setState({
        search: event.target.value,
        players: this.state.allPlayers.filter(
          (player) => { return(
            player.name.toLowerCase().includes( event.target.value.toLowerCase() ) ||
            player.score.toString().includes(event.target.value) ||
            player.id.toString().includes(event.target.value) ||﻿
            player.level.toLowerCase().includes( event.target.value.toLowerCase() ||
            player.level.toLowerCase().includes(level)  )
          )

          }
        ),
        total:Math.round(this.state.allPlayers.filter(
          (player) => { return(
            player.name.toLowerCase().includes( event.target.value.toLowerCase() ) ||
            player.score.toString().includes(event.target.value) ||
            player.id.toString().includes(event.target.value) ||﻿
            player.level.toLowerCase().includes( event.target.value.toLowerCase() )
          )

          }
        ).length / 5)

    })
  }



  handleLevelChange(event,index, level){

    if(level === "all"){
      this.setState({
        levelFilter:level,
        players:this.state.allPlayers,
        total: Math.round(this.state.allPlayers.length / 5)
      });
    }else{
        this.setState({
          levelFilter:level,
          players: this.state.allPlayers.filter((player) =>
          player.level.includes(level)),
          currentIndex:this.state.allPlayers.filter((player) =>
            player.level.includes(level)).length - 5,
          total:Math.round(this.state.allPlayers.filter((player) =>
          player.level.includes(level)).length / 5)
        });

    }
  }

  render(){
    if (!this.state.players) {
      return <div>Loading</div>;
    }

    let filteredPlayers = this.state.players.slice(this.state.currentIndex, this.state.currentIndex + 5);


    let suspected = this.state.suspected;
    let levelFilter = this.state.levelFilter;
    return (

          <div style={styles.root}>
            <div style={styles.title}>Tournament 101 - Final Results</div>


                <TextField style={styles.search} fullWidth={false} underlineShow={true} hintText="Search..."
                  value={this.state.search}
                  onChange={this.updateSearch.bind(this)}/>



                <Table
                    height={'40vh'}
                    bodyStyle={{overflow:'visible'}}
                    style={{backgroundColor:'rgba(255, 255, 255,0.8)'}}

                >
                  <TableHeader
                  adjustForCheckbox={false}
                  displaySelectAll={false}
                >
                      <TableRow>
                        <TableHeaderColumn style={styles.header}>Id</TableHeaderColumn>
                        <TableHeaderColumn style={styles.header}>Name</TableHeaderColumn>
                        <TableHeaderColumn style={styles.header}>
                          <DropDownMenu value={levelFilter} underlineStyle={styles.dropMenuLine} style={styles.level} iconStyle={styles.errow} onChange={this.handleLevelChange.bind(this)}>
                           <MenuItem value={"all"} primaryText="Level : all"></MenuItem>
                           <MenuItem value={"pro"} primaryText="pro" />
                           <MenuItem value={"amateur"} primaryText="amateur" />
                           <MenuItem value={"rookie"} primaryText="rookie" />
                          </DropDownMenu>
                        </TableHeaderColumn>
                        <TableHeaderColumn style={styles.header}>Score</TableHeaderColumn>
                      </TableRow>
                  </TableHeader>

                  <TableBody displayRowCheckbox={false} showRowHover={false} stripedRows={false}>
                    {filteredPlayers.map((player) =>
                      suspected.includes(player.id) ? (
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
