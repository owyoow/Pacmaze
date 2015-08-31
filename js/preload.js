/*global Phaser Pacmaze*/

Pacmaze.Preload = function (game)
{
    
};

Pacmaze.Preload.prototype.preload = function ()
{
    
    // this is used for the framerate counter
    this.time.advancedTiming = true;
};

Pacmaze.Preload.prototype.create = function ()
{
    this.state.start('game');  
};