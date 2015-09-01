/*global Phaser Pacmaze*/

var Pacmaze = {
    
    TILESIZE: 32,
    SEED: 0,
    TILETOWORLDPOS: function(x, y)
    {
        return new Phaser.Point(x * this.TILESIZE + this.TILESIZE * 0.5, y * this.TILESIZE + this.TILESIZE * 0.5);
    }
    
};

Pacmaze.Boot = function (game)
{
    
};

Pacmaze.Boot.prototype.preload = function ()
{
    this.scale.pageAlignHorizontally = true;
};
    
Pacmaze.Boot.prototype.create = function ()
{
    this.state.start('preload');
};