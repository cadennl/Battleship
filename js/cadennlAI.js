


var DumbAI = function(game, is_player_one, delay) {
    if (is_player_one) {
  var key = game.registerPlayerOne();
    } else {
  key = game.registerPlayerTwo();
    }
   var count =0;
    var turn_delay = 0;
    if (delay != undefined) {
  turn_delay = delay;
    }
    
  var eventHandler = function(e) {
  switch (e.event_type) {
  case SBConstants.TURN_CHANGE_EVENT:
      if (((e.who == SBConstants.PLAYER_ONE) && is_player_one) ||
    ((e.who == SBConstants.PLAYER_TWO) && (!is_player_one))) {
    {
        count++;

        //shoot at upper half of board in beginning of game
        var x = Math.floor(Math.random() * (game.getBoardSize()/2)+1);
        var y = Math.floor(Math.random() * game.getBoardSize());
        if(count < Math.floor(game.getBoardSize()*2.5))
        {
            game.shootAt(key, x, y);
        }

        //a % of the time shoot in middle of the board
        if(count %10 == 0|| count %6 ==0)
        {
          x = Math.floor(Math.random() * (30-20+1))+20;
          y = Math.floor(Math.random() * game.getBoardSize());
          var decision = Math.floor(Math.random() * 1);
          if(decision < 5)
           {
            game.shootAt(key, x, y);
           }
        }

        //after enough turns have been had, shoot at the bottom of the board because the AI ships probably havent moved much so
        //thats probably where the opponent is
        if(count > game.getBoardSize()*6 && count %2 == 0 )
        {
          x = Math.floor(Math.random() * (50-30+1))+30;
          y = Math.floor(Math.random() * game.getBoardSize());
          game.shootAt(key,x,y);
        }

        //random moves/rotates
        var shiptoOperate;
        var commandtoUse;
        var ships = ["Carrier","Submarine", "Destroyer", "Battleship", "Cruiser"];
        var randIndex = Math.floor(Math.random() * 4);
        var commands = ["rotateCW", "rotateCCW", "moveForward", "moveBackward"];
        if(x%2 ==0)
        {
            commandtoUse = commands[randIndex];
            shiptoOperate = game.getShipByName(key, ships[randIndex]);
            console.log(ships[randIndex]);
            switch(commandtoUse)
            {
              case "rotateCW":
              game.rotateShipCW(key,shiptoOperate);
              break;
              case "rotateCCW":
              game.rotateShipCCW(key,shiptoOperate);
              break;
              case "moveForward":
              game.moveShipForward(key,shiptoOperate);
              break;
              case "moveBackward":
              game.moveShipBackward(key,shiptoOperate);
              break;
            }
        }
        else
        {
             commandtoUse = commands[(commands.length-1)-randIndex];
             shiptoOperate = game.getShipByName(key, ships[(ships.length-1)-randIndex]);
              switch(commandtoUse)
            {
              case "rotateCW":
              game.rotateShipCW(key,shiptoOperate);
              break;
              case "rotateCCW":
              game.rotateShipCCW(key,shiptoOperate);
              break;
              case "moveForward":
              game.moveShipForward(key,shiptoOperate);
              break;
              case "moveBackward":
              game.moveShipBackward(key,shiptoOperate);
              break;
            }
        }
         setTimeout(function () {game.shootAt(key, x, y);}, turn_delay);
    }

      }
  }
    }

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
            eventHandler);

    this.giveUpKey = function() {
  return key;
    }
  
}