/*global Phaser Pacmaze*/

/* This is the enemy base class that has all the properties and functions */
/* that every enemy will have so we can inherit these.                    */

Pacmaze.Enemy = function (game, x, y, sprite)
{
    Phaser.Sprite.call(this, game, x, y, sprite);
    
    this.game.add.existing(this);
    this.anchor.setTo(0.5);
    
    this.targetCorner = new Phaser.Point(0, 0);
    
    this.currentDirection = Pacmaze.DIRECTIONS.none;
    
    this.states = {
        Sleep: 1,
        Chase: 2,
        ToCorner: 3,
        Flee: 4
    };

    this.moveState = this.states.Sleep;
    
    this.goal = new Phaser.Point();
};

// inherit Phaser.Sprite so we can use all those functions properties including the update function
Pacmaze.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Pacmaze.Enemy.prototype.constructor = Pacmaze.Enemy;

Pacmaze.Enemy.prototype.setCorner = function (x, y)
{
    this.targetCorner.setTo(x, y);
};

Pacmaze.Enemy.prototype.setGoal = function (x, y)
{
    this.goal.setTo(x, y);
};

Pacmaze.Enemy.prototype.canMove = function (map, currentTile, direction)
{
    var canMove = false;
    var targetTile = map.getTile(currentTile.x + direction.x, currentTile.y + direction.y);
    
    if(targetTile && (targetTile.index === 0 || (targetTile.index === 2 && this.inCage)))
    {
        canMove = true;
    }
    
    return canMove;
};

Pacmaze.Enemy.prototype.getNextMoveTarget = function (map, direction)
{
    var nextTarget = null;
    var currentTile = map.getTileWorldXY(this.x, this.y);
    
    if(this.canMove(map, currentTile, direction))
    {
        nextTarget = Pacmaze.TILETOWORLDPOS(currentTile.x + direction.x, currentTile.y + direction.y);
    }
    
    return nextTarget;
};