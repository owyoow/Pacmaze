/*global Phaser Pacmaze*/

var Pacmaze = {
    
    TILESIZE: 32,
    SEED: 0,
    
    // this function converts the center of a tile position to a world position
    TILETOWORLDPOS: function(x, y)
    {
        return new Phaser.Point(x * this.TILESIZE + this.TILESIZE * 0.5, y * this.TILESIZE + this.TILESIZE * 0.5);
    },
    
    RECTSOVERLAP: function (spriteA, spriteB)
    {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
    
        return Phaser.Rectangle.intersects(boundsA, boundsB);  
    },
    
    DIRECTIONS: {
        none: new Phaser.Point(0, 0),
        left: new Phaser.Point(-1, 0),
        right: new Phaser.Point(1, 0),
        up: new Phaser.Point(0, -1),
        down: new Phaser.Point(0, 1)
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