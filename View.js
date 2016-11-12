$(document).ready(function() {

    //keep at 50 for now, may change;may not, would have to access game object to access boardsize if not always default
const boardSize = 50;
 //var view  = mapDrawHandler();

var extendArray = function(){

   Array.matrix = function(numrows, numcols, initial){
   var arr = [];
   for (var i = 0; i < numrows; ++i){
      var columns = [];
      for (var j = 0; j < numcols; ++j){
         columns[j] = initial;
      }
      arr[i] = columns;
    }
    return arr;
    };
};

extendArray();
var locationMatrix = Array.matrix(boardSize,boardSize,0);

var setID = (function() {
   return function (x,y){ 
            var xLoca;
            var yLoca;
            if(x<10)
            {
              xLoca = x.toString() +'-';
            }
            else
            {
              xLoca = x.toString();
            }
            if(y<10)
            {
              yLoca = y.toString() +'-';
            }
            else
            {
              yLoca = y.toString();
            }
            
            var blockID = xLoca + yLoca;
            locationMatrix[x][y] = blockID;
            //console.log(locationMatrix[x][y]);
            
    };

})();



var getID = function(x,y) {
  
  return locationMatrix[x][y];

};
        
function createGrid() {

    for (var x = 0; x < 50; x++){
    
    for (var y = 0; y < 50; y++){

     $('#map').append(function(){

           var newSqr = document.createElement('div');

           //fills in spot for current div in the location matrix
           
            setID(x,y);
            newSqr.setAttribute('id', getID(x,y));
            newSqr.setAttribute('class', 'box');
           
           return newSqr;
         });
    } //for y
} //for x
}


   
    createGrid();
    var game = new SuperBattleship();
    

   var CLIPlayer = function(game, cli_input, cli_output, map, is_player_one) {
    
    if (is_player_one) {
    var key = game.registerPlayerOne();
    } else {
    key = game.registerPlayerTwo();
    }
   

    cli_output = $(cli_output);
    cli_input = $(cli_input);
    map = $(map);
    
    var eventLogHandler = function(e) {
    var cli_msg = $('<div class="cli_msg"></div>');
    switch (e.event_type) {
    case SBConstants.TURN_CHANGE_EVENT:
        
        if (e.who == SBConstants.PLAYER_ONE) {
        // cli_msg.text("Player one's turn");

        } else {
        // cli_msg.text("Player two's turn " );
        }
        break;
    case SBConstants.MISS_EVENT:
        // cli_msg.text("Miss event at (" + e.x + ", " + e.y + ")");

        break;
    case SBConstants.HIT_EVENT:

        // cli_msg.text("Hit event at (" + e.x + ", " + e.y + ")");
        break;
    case SBConstants.SHIP_SUNK_EVENT:
        var ship = e.ship;
        if (ship.isMine(key)) {
        var pos = ship.getPosition(key);
        // cli_msg.text("Foe sunk your " + ship.getName() + " at (" + pos.x + ", " + pos.y + ")");
        } else {
        var pos = ship.getPosition(null); // This works because ship is dead.
        // cli_msg.text("You sunk their " + ship.getName() + " at (" + pos.x + ", " + pos.y + ")");
        }
        break;
    case SBConstants.GAME_OVER_EVENT:
        if (is_player_one && e.winner == SBConstants.PLAYER_ONE) {
        // cli_msg.text("Game over. You win!");
        } else {
        // cli_msg.text("Game over. You lose!");
        }
        break;
    }

    cli_output.prepend(cli_msg);
    };

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
                  eventLogHandler);
    game.registerEventHandler(SBConstants.MISS_EVENT,
                  eventLogHandler);
    game.registerEventHandler(SBConstants.HIT_EVENT,
                  eventLogHandler);
    game.registerEventHandler(SBConstants.SHIP_SUNK_EVENT,
                  eventLogHandler);



   var mapDrawHandler = function(e) {
   
   for (var y=0; y<boardSize; y++) {
  
   for (var x=0; x<boardSize; x++) {

   var elementID = locationMatrix[x][y];

   var sqr = game.queryLocation(key, x, y);
   var currentElement = document.getElementById(elementID);
        switch (sqr.type) {
        case "miss":
            $(currentElement).removeClass();
            $(currentElement).addClass('miss');
            break;
        case "p1":
            if (sqr.state == SBConstants.OK) {

            $(currentElement).removeClass();
            $(currentElement).addClass('active');
            }
            break;
        case "p2":
            if (sqr.state == SBConstants.OK) {
            $(currentElement).removeClass();
            $(currentElement).addClass('active');
            }
            break;
        case "empty":
            $(currentElement).removeClass();
            $(currentElement).addClass('white');
            break;
        case "invisible":
            $(currentElement).removeClass();
            $(currentElement).addClass('nolook');
            break;
        // });
        }
        }
    }

  };

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
                  mapDrawHandler);




  var keys = {};
  //var flag = false;

  // $(document).keydown(function (e) {
  //     if(!flag)
  //     {
  //      keys[e.which] = true;
  //      $('h5.actual-input').removeClass('actual-input');
  //      $('#friends').remove();
       $('.comm-options').append('<button type="button" class="btn btn-info rotatecw">Rotate CW</button>');
       $('.comm-options').append('<button type="button" class="btn btn-info rotateccw">Rotate CCW</button>');
       $('.comm-options').append('<button type="button" class="btn btn-info moveforward">Move Forward</button>');
       $('.comm-options').append('<button type="button" class="btn btn-info movebackward">Move Backward</button>');


        $('.fleetinfo').click(function(){

         var fleet = game.getFleetByKey(key);
         var fleet_ul = $('<ul></ul>');

          fleet.forEach(function (s) {
              var ship_str = "<li>" + s.getName();
              var ship_pos = s.getPosition(key);
              ship_str += "<ul>";
              ship_str += "<li>Position: " + ship_pos.x + ", " + ship_pos.y + "</li>";
              ship_str += "<li>Direction: " + ship_pos.direction + "</li>";
              ship_str += "<li>Size: " + s.getSize() + "</li>";
              if (s.getStatus() == SBConstants.ALIVE) {
            ship_str += "<li>Status: ALIVE</li>";
              } else {
            ship_str += "<li>Status: DEAD</li>";
              }
              ship_str += "</ul></li>";
              fleet_ul.append(ship_str);
          })

          $('.fleet-output').append(fleet_ul);
        });


    
        $('.rotatecw').click(function(){
           $(document).keydown(function (e) {
              keys[e.which] = true;

          if (keys[67])
          {
            
            var ship = game.getShipByName(key, "Carrier");
            if (ship != null) {
              game.rotateShipCW(key, ship);
            }
          }  //keys[67]


          if(keys[83])
          {
            var ship = game.getShipByName(key, "Submarine");
            if (ship != null)
            {
              game.rotateShipCW(key, ship);
            }
          } //keys[83]

          if(keys[75])
          {
            var ship = game.getShipByName(key, "Cruiser");
            if (ship != null) 
            {
              game.rotateShipCW(key, ship);
            }
          }

          if(keys[68])
          {
            var ship = game.getShipByName(key, "Destroyer");
            if (ship != null) 
            {
              game.rotateShipCW(key, ship);
            }
          }
          
          if(keys[66])
          {
            var ship = game.getShipByName(key, "Battleship");
            if (ship != null) 
            {
              game.rotateShipCW(key, ship);
            }
          }
     
          $(document).keyup(function (e) {
             delete keys[e.which];
              });
        }); //keydown
      

    });  //rotatecw


        $('.rotateccw').click(function(){
            $(document).keydown(function (e) {
              keys[e.which] = true;

          if (keys[67])
          {
            
            var ship = game.getShipByName(key, "Carrier");
            if (ship != null) {
              game.rotateShipCCW(key, ship);
            }
          }  //keys[67]


          if(keys[83])
          {
            var ship = game.getShipByName(key, "Submarine");
            if (ship != null)
            {
              game.rotateShipCCW(key, ship);
            }
          } //keys[83]

          if(keys[75])
          {
            var ship = game.getShipByName(key, "Cruiser");
            if (ship != null) 
            {
              game.rotateShipCCW(key, ship);
            }
          }

          if(keys[68])
          {
            var ship = game.getShipByName(key, "Destroyer");
            if (ship != null) 
            {
              game.rotateShipCCW(key, ship);
            }
          }
          
          if(keys[66])
          {
            var ship = game.getShipByName(key, "Battleship");
            if (ship != null) 
            {
              game.rotateShipCCW(key, ship);
            }
          }
     
          $(document).keyup(function (e) {
             delete keys[e.which];
              });
        }); 
      });

        $('.moveforward').click(function(){
        
       
      });
          $('.movebackward').click(function(){
        
       
      });
    

       // if(keys[37]&& keys[83])
       // {
       //  cli_input.removeClass('actual-input');
       //   cli_input.on('keypress', function(e){
       //      if(e.which == 13)
       //      {
       //        var cmd_str = $(this).val();
       //        var cmd_array = cmd_str.split(' ');
       //        var ship_name = cmd_array[0];
       //        var ship = game.getShipByName(key, ship_name);
       //        if (ship != null) {
       //        //console.log(count++);
       //        game.rotateShipCCW(key, ship);
       //        break;
       //        }
       //      }
       //   });

       // }
       // if(keys[38])
       // {
       //   cli_input.removeClass('actual-input');
  
       //   cli_input.on('keypress', function(e){
       //      if(e.which == 13)
       //      {
       //        var cmd_str = $(this).val();
       //        var cmd_array = cmd_str.split(' ');
       //        var ship_name = cmd_array[0];
       //        var ship = game.getShipByName(key, ship_name);
       //        if (ship != null) {
       //        //console.log(count++);
       //        break;
       //        }
       //      }
       //   });
       // }
       // if(keys[40])
       // {
        
       //   cli_input.removeClass('actual-input');
  
       //   cli_input.on('keypress', function(e){
       //      if(e.which == 13)
       //      {
       //        var cmd_str = $(this).val();
       //        var cmd_array = cmd_str.split(' ');
       //        var ship_name = cmd_array[0];
       //        var ship = game.getShipByName(key, ship_name);
       //        if (ship != null) {
       //        game.moveShipBackward(key, ship);
       //        }
       //        break;
       //      }
       //   });



$(document).keyup(function (e) {
             delete keys[e.which];
             });

//    cli_input.on('keypress', function (e) {
//   if (e.keyCode == 13) {
//       var cmd_str = $(this).val();
// //      $(this).val('');
//       var cmd_array = cmd_str.split(' ');
//       if (cmd_array[0] == "shootAt") {
//     var x = parseInt(cmd_array[1]);
//     var y = parseInt(cmd_array[2]);
//     game.shootAt(key, x, y);
//       } else if (cmd_array[0] == "fleetInfo") {


//     var fleet = game.getFleetByKey(key);
//     var fleet_ul = $('<ul></ul>');

//     fleet.forEach(function (s) {
//         var ship_str = "<li>" + s.getName();
//         var ship_pos = s.getPosition(key);
//         ship_str += "<ul>";
//         ship_str += "<li>Position: " + ship_pos.x + ", " + ship_pos.y + "</li>";
//         ship_str += "<li>Direction: " + ship_pos.direction + "</li>";
//         ship_str += "<li>Size: " + s.getSize() + "</li>";
//         if (s.getStatus() == SBConstants.ALIVE) {
//       ship_str += "<li>Status: ALIVE</li>";
//         } else {
//       ship_str += "<li>Status: DEAD</li>";
//         }
//         ship_str += "</ul></li>";
//         fleet_ul.append(ship_str);
//     })
    // cli_output.prepend($('<div class="cli_msg"></div>').append(fleet_ul));



//       } else if (cmd_array[0] == "moveForward") {
//     var ship_name = cmd_array[1];
//     var ship = game.getShipByName(key, ship_name);
//     if (ship != null) {
//         game.moveShipForward(key, ship);
//     }
//       } else if (cmd_array[0] == "moveBackward") {
//     var ship_name = cmd_array[1];
//     var ship = game.getShipByName(key, ship_name);
//     if (ship != null) {
//         game.moveShipBackward(key, ship);
//     }
//       } else if (cmd_array[0] == "rotateCW") {
//     var ship_name = cmd_array[1];
//     var ship = game.getShipByName(key, ship_name);
//     if (ship != null) {
//         game.rotateShipCW(key, ship);
//     }
//       } else if (cmd_array[0] == "rotateCCW") {
//     var ship_name = cmd_array[1];
//     var ship = game.getShipByName(key, ship_name);
//     if (ship != null) {
//         game.rotateShipCCW(key, ship);
//     }
//       }
//   }
//     });
};

var DumbAI = function(game, is_player_one, delay) {
    if (is_player_one) {
  var key = game.registerPlayerOne();
    } else {
  key = game.registerPlayerTwo();
    }

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
        var x = Math.floor(Math.random() * game.getBoardSize());
        var y = Math.floor(Math.random() * game.getBoardSize());
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



var ai_player_one = new DumbAI(game, false);
var cli_player_two = new CLIPlayer(game, $('.form-control'),
               $('.fleet-output'), $('#map'), true);

game.startGame();






});