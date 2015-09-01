/*global Phaser Pacmaze*/

Pacmaze.Game = function (game)
{
    
};

Pacmaze.Game.prototype.create = function ()
{
    console.log('seed: ' + Pacmaze.SEED);
    
    this.mapGen = new Pacmaze.MapGen(this);
    var mapString = this.mapGen.createMaze(25, 17);
    this.load.tilemap('map', null, mapString, Phaser.Tilemap.CSV);
    
    this.map = this.add.tilemap('map', Pacmaze.TILESIZE, Pacmaze.TILESIZE);
    this.map.addTilesetImage('tiles');
    
    this.mapLayer = this.map.createLayer(0);
    this.mapLayer.y = 20;
    //this.mapLayer.resizeWorld();
    this.world.setBounds(0, -60, 800, 600);
};

Pacmaze.Game.prototype.update = function ()
{
    
};

Pacmaze.Game.prototype.render = function ()
{
    this.game.debug.text(this.time.fps || '--', 2, 14, '#00ff00');
};