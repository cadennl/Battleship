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


var setID = (function() {
   extendArray();
   var locationMatrix = Array.matrix(boardSize,boardSize,0);
   return function(x,y){ 
            var xLoca = x.toString();
            var yLoca = y.toString();
            var blockID = xLoca + yLoca;
            locationMatrix[x][y] = blockID;
            console.log(locationMatrix[x][y]);
            var location = locationMatrix[x][y];
    };

})();


var getID = function(location){
  
  return setID.location;

};
        
function createGrid() {

    for (var x = 0; x < 50; x++){
    
    for (var y = 0; y < 50; y++){

    $('#map').append(function(){

           var newSqr = document.createElement('div');

           //fills in location spot for current div in the location matrix
           console.log(x);
           console.log(y);
           setID(x, y);
           newSqr.setAttribute('id', x.toString() + y.toString());
           newSqr.setAttribute('class', 'box');
           return newSqr;

        });
    } //for y
} //for x
}


    $('#p1_view_btn').click(function () {
	$('#p2_view').hide();
	$('#p1_view').show();
    });

    $('#p2_view_btn').click(function () {
	$('#p1_view').hide();
	$('#p2_view').show();
    });

    var game = new SuperBattleship();

    createGrid();
    var cli_player_one = new CLIPlayer(game, $('#p1_cli_input'),
				       $('#p1_cli_output'), $('#p1_view'), true);
    var cli_player_two = new CLIPlayer(game, $('#p2_cli_input'),
				       $('#p2_cli_output'), $('#p2_view'), false);
    game.startGame();

});