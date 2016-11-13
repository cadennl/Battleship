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
            
    };

})();


var getID = function(x,y) {
  
  return locationMatrix[x][y];

};
        
function createGrid() {

    for (var x = 0; x < boardSize; x++){
    
    for (var y = 0; y < boardSize; y++){

     $('#map').append(function(){

           var newSqr = document.createElement('div');

           //fills in spot for current div in the location matrix
           
            setID(x,y);
            newSqr.setAttribute('id', getID(x,y));
            newSqr.setAttribute('class', 'box');
           
           return newSqr;
         });
    } 
} 
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
        break;
    case SBConstants.MISS_EVENT:
    if(game.isPlayerTwoKey(key) && game.getStatus() == SBConstants.PLAYER_TWO)
    {
        cli_msg.text("A miss, almost seems like your opponent is shooting at random places");
        setTimeout(function(){
            cli_msg.text("");
          }
          ,2000); 
    }
    else if (game.isPlayerOneKey(key) && game.getStatus() == SBConstants.PLAYER_ONE)
    {
        cli_msg.text("A miss, keep your head up captain ");
        cli_msg.append('<img src = https://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-0536d670860bf733-24x18.png>');
        setTimeout(function(){
            cli_msg.empty();
          }
          ,2000); 
        
    }
        break;
    case SBConstants.HIT_EVENT:

    if(e.ship.isMine(key))
    {
        cli_msg.addClass('bigevent');
        cli_msg.text("There was a hit captain ");
        cli_msg.append("<img src = https://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-ae4e17f5b9624e2f-24x18.png>");
         setTimeout(function(){
            cli_msg.empty();
          }
          ,2000); 
    } 
    else if (game.isPlayerOneKey(key))
    {
      cli_msg.addClass('bigevent');
      cli_msg.text("Nice hit captain ");
      cli_msg.append('<img src = https://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-0536d670860bf733-24x18.png>');
         setTimeout(function(){
            cli_msg.empty();
          }
          ,2000); 
    }
        break;
    case SBConstants.SHIP_SUNK_EVENT:
        var ship = e.ship;
        if (ship.isMine(key)) {

        cli_msg.addClass('bigevent');
        cli_msg.append('<img src = https://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-0536d670860bf733-24x18.png>');
        cli_msg.text("Foe sunk your " + ship.getName());
         setTimeout(function(){
            cli_msg.empty();
          }
          ,2000);  
         
        } else {
      
        cli_msg.addClass('bigevent');
        cli_msg.text("You sunk their " + ship.getName() + " ");
        cli_msg.append('<img src = https://static-cdn.jtvnw.net/emoticons/v1/116625/1.0>');
         setTimeout(function(){
            cli_msg.empty();
          }
          ,2000);  
       
        }
        break;
    case SBConstants.GAME_OVER_EVENT:
        if (is_player_one && e.winner == SBConstants.PLAYER_ONE) {
        cli_msg.text("Game over. You are the victor. Go home and enjoy your spoils");
        
        } else {
        cli_msg.text("Game over. You are a fledgling in the world of Battleship. git gud");

        }
        break;
    }

    cli_output.append(cli_msg);
    };

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
                  eventLogHandler);
    game.registerEventHandler(SBConstants.MISS_EVENT,
                  eventLogHandler);
    game.registerEventHandler(SBConstants.HIT_EVENT,
                  eventLogHandler);
    game.registerEventHandler(SBConstants.SHIP_SUNK_EVENT,
                  eventLogHandler);
    game.registerEventHandler(SBConstants.GAME_OVER_EVENT,
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
            else{
              $(currentElement).removeClass('active');
              $(currentElement).addClass('hit');
            }
            break;
        case "p2":
            if (sqr.state == SBConstants.OK) {
            $(currentElement).removeClass();
            $(currentElement).addClass('active');
            }
            else{
              $(currentElement).removeClass('active');
              $(currentElement).addClass('hit');
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
        }
        }
    }
  };

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
                  mapDrawHandler);



  var keys = {};
  var buttonHide = 0;

       $('.comm-options').append('<button type="button" class="btn btn-info rotatecw">Rotate CW</button>');
       $('.comm-options').append('<button type="button" class="btn btn-info rotateccw">Rotate CCW</button>');
       $('.comm-options').append('<button type="button" class="btn btn-info moveforward">Move Forward</button>');
       $('.comm-options').append('<button type="button" class="btn btn-info movebackward">Move Backward</button>');

        $('.fleetinfo').click(function(){
         buttonHide++;
         console.log(buttonHide);
         var fleet = game.getFleetByKey(key);
         var fleet_ul = $('<ul></ul>');
          fleet.forEach(function (s) {
              var ship_str = "<li class = 'shipname'>" + s.getName() + "</li>" ;
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

          
          $('.fleetinfo').click(function(){
            if(buttonHide%2==0)
            {
            $('.fleet-output').empty();
            }
          });
        });


    
        $('.rotatecw').click(function(){
           $(document).unbind('keydown');
           $(document).keydown(function (e) {
              keys[e.which] = true;

          if (keys[67])
          {
            console.log("cw");
            var ship = game.getShipByName(key, "Carrier");
            if (ship != null) {
              game.rotateShipCW(key, ship);
            }
           
          }  

          if(keys[83])
          {
            var ship = game.getShipByName(key, "Submarine");
            if (ship != null)
            {
              game.rotateShipCW(key, ship);
            }
          } 

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

        });
    });  


        $('.rotateccw').click(function(){
            $(document).unbind('keydown');
            $(document).keydown(function (e) {
              keys[e.which] = true;

          if (keys[67])
          {
            console.log("ccw");
            var ship = game.getShipByName(key, "Carrier");
            if (ship != null) {
              game.rotateShipCCW(key, ship);
            }
          }  

          if(keys[83])
          {
            var ship = game.getShipByName(key, "Submarine");
            if (ship != null)
            {
              game.rotateShipCCW(key, ship);
            }
          } 

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
         $(document).unbind('keydown');
            $(document).keydown(function (e) {
              keys[e.which] = true;

          if (keys[67])
          {
            console.log("ccw");
            var ship = game.getShipByName(key, "Carrier");
            if (ship != null) {
              game.moveShipForward(key, ship);
            }
          }  //keys[67]

          if(keys[83])
          {
            var ship = game.getShipByName(key, "Submarine");
            if (ship != null)
            {
              game.moveShipForward(key, ship);
            }
          } 

          if(keys[75])
          {
            var ship = game.getShipByName(key, "Cruiser");
            if (ship != null) 
            {
              game.moveShipForward(key, ship);
            }
          }

          if(keys[68])
          {
            var ship = game.getShipByName(key, "Destroyer");
            if (ship != null) 
            {
              game.moveShipForward(key, ship);
            }
          }
          
          if(keys[66])
          {
            var ship = game.getShipByName(key, "Battleship");
            if (ship != null) 
            {
              game.moveShipForward(key, ship);
            }
          }
     
          $(document).keyup(function (e) {
             delete keys[e.which];
              });
        }); 
       
      });


          $('.movebackward').click(function(){
            $(document).unbind('keydown');
            $(document).keydown(function (e) {
              keys[e.which] = true;

          if (keys[67])
          {
            console.log("ccw");
            var ship = game.getShipByName(key, "Carrier");
            if (ship != null) {
              game.moveShipBackward(key, ship);
            }
          }  
          if(keys[83])
          {
            var ship = game.getShipByName(key, "Submarine");
            if (ship != null)
            {
              game.moveShipBackward(key, ship);
            }
          } 

          if(keys[75])
          {
            var ship = game.getShipByName(key, "Cruiser");
            if (ship != null) 
            {
              game.moveShipBackward(key, ship);
            }
          }

          if(keys[68])
          {
            var ship = game.getShipByName(key, "Destroyer");
            if (ship != null) 
            {
              game.moveShipBackward(key, ship);
            }
          }
          
          if(keys[66])
          {
            var ship = game.getShipByName(key, "Battleship");
            if (ship != null) 
            {
              game.moveShipBackward(key, ship);
            }
          }
     
          $(document).keyup(function (e) {
             delete keys[e.which];
              });
        });
       
      });

      $('div').click(function(){
          if($(this).hasClass('white') || $(this).hasClass('nolook') || $(this).hasClass('active'))
          {
            var x;
            var y;
            var id = $(this).attr('id');
            if(id[1] == "-")
            {
              x = parseInt(id[0]);
              y = parseInt(id[2]+id[3]);
            }
            else if(id[3] == "-")
            {
              x = parseInt(id[0]+id[1]);
              y = parseInt(id[2]);
            }
            else
            {
              x = parseInt(id[0]+id[1]);
              y= parseInt(id[2]+id[3]);
            }
            game.shootAt(key, x, y);
          }
      })
    
};


var ai_player_two = new DumbAI(game, false);
var cli_player_one = new CLIPlayer(game, $('.form-control'),
               $('.fleet-output'), $('#map'), true);

game.startGame();



});