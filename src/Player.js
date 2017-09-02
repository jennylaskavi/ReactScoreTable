import React from 'react';

const Player = ({player}) =>
        <li>
          {player.id} {player.name} {player.level} {player.score}
        </li>




export default Player;
