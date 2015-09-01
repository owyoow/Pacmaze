/*global Phaser Pacmaze*/

Pacmaze.Preload = function (game)
{
    
};

Pacmaze.Preload.prototype.preload = function ()
{
    //this.load.image('tiles', 'assets/images/smallTiles.png');
    this.load.image('tiles', 'assets/images/tiles32px.png');
    this.load.image('eBlue', 'assets/images/eBlue.png');
    this.load.image('eCyan', 'assets/images/eCyan.png');
    this.load.image('ePink', 'assets/images/ePink.png');
    this.load.image('eRed', 'assets/images/eRed.png');
    this.load.image('food', 'assets/images/food.png');
    this.load.image('player', 'assets/images/player.png');
    
    // getting a random seed, but also use a variable to set the seed yourself if you want
    // has to be moved to the menu in the future
    Pacmaze.SEED = this.rnd.integerInRange(0, 9999999999);
    //Pacmaze.SEED = 5255887299;
    this.rnd.sow([(Pacmaze.SEED).toString()]);
    
    // this is used for the framerate counter
    this.time.advancedTiming = true;
};

Pacmaze.Preload.prototype.create = function ()
{
    this.state.start('game');  
};