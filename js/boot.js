/*global Phaser Pacmaze*/

var Pacmaze = {
    
    TILESIZE: 32,
    SEED: 0
    
};

Pacmaze.Boot = function (game)
{
    
};

Pacmaze.Boot.prototype.preload = function ()
{
    this.scale.pageAlignHorizontally = true;
        
    // using the arcade physics system
    this.physics.startSystem(Phaser.Physics.ARCADE);
};
    
Pacmaze.Boot.prototype.create = function ()
{
    this.state.start('preload');
};