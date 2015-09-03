/*global Phaser Pacmaze*/

Pacmaze.ERed = function (game, x, y)
{
    Pacmaze.Enemy.call(this, game, x, y, 'eRed');
    
    console.log('eRed postion: ' + this.x + ', ' + this.y);
};

Pacmaze.ERed.prototype = Object.create(Pacmaze.Enemy.prototype);
Pacmaze.ERed.prototype.constructor = Pacmaze.eRed;

Pacmaze.ERed.prototype.update = function ()
{
    //console.log('eRed');
};