/*global Phaser Pacmaze*/

Pacmaze.Input = function (game)
{
    this.game = game;
    
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
};

Pacmaze.Input.prototype.setupInput = function ()
{
    var leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    leftKey.onDown.add(this.leftDown, this);
    leftKey.onUp.add(this.leftUp, this);
    
    var rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    rightKey.onDown.add(this.rightDown, this);
    rightKey.onUp.add(this.rightUp, this);
    
    var upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    upKey.onDown.add(this.upDown, this);
    upKey.onUp.add(this.upUp, this);
    
    var downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    downKey.onDown.add(this.downDown, this);
    downKey.onUp.add(this.downUp, this);
};

Pacmaze.Input.prototype.leftDown = function ()
{
    this.left = true;
};

Pacmaze.Input.prototype.leftUp = function ()
{
    this.left = false;
};

Pacmaze.Input.prototype.rightDown = function ()
{
    this.right = true;
};

Pacmaze.Input.prototype.rightUp = function ()
{
    this.right = false;
};

Pacmaze.Input.prototype.upDown = function ()
{
    this.up = true;
};

Pacmaze.Input.prototype.upUp = function ()
{
    this.up = false;
};

Pacmaze.Input.prototype.downDown = function ()
{
    this.down = true;
};

Pacmaze.Input.prototype.downUp = function ()
{
    this.down = false;
};