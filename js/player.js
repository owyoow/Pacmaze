/*global Phaser Pacmaze*/

Pacmaze.Player = function (game, x, y)
{
    Phaser.Sprite.call(this, game, x, y, 'player');
    this.game.add.existing(this);
    
    this.anchor.setTo(0.5);
    this.moveTarget = new Phaser.Point();

    this.currentDirection =Pacmaze.DIRECTIONS.none;
    this.desiredDirection = Pacmaze.DIRECTIONS.none;
    
     this.speed = 2;
     this.hasMoved = false;
};

Pacmaze.Player.prototype = Object.create(Phaser.Sprite.prototype);
Pacmaze.Player.prototype.constructor = Pacmaze.Player;

Pacmaze.Player.prototype.update = function ()
{
    this.game.foodGroup.forEachAlive(function(food)
    {
        if(Pacmaze.RECTSOVERLAP(this, food) && this.hasMoved)
        {
            food.kill();
        }
    }, this);
    
    
    if(this.game.gameInput.left)
    {
        if(this.currentDirection === Pacmaze.DIRECTIONS.right) this.moveTarget.setTo(0, 0);
        this.desiredDirection = Pacmaze.DIRECTIONS.left;
    }
    else if(this.game.gameInput.right)
    {
        if(this.currentDirection === Pacmaze.DIRECTIONS.left) this.moveTarget.setTo(0, 0);
        this.desiredDirection = Pacmaze.DIRECTIONS.right;
    }
    else if(this.game.gameInput.up)
    {
        if(this.currentDirection === Pacmaze.DIRECTIONS.down) this.moveTarget.setTo(0, 0);
        this.desiredDirection = Pacmaze.DIRECTIONS.up;
    }
    else if(this.game.gameInput.down)
    {
        if(this.currentDirection === Pacmaze.DIRECTIONS.up) this.moveTarget.setTo(0, 0);
        this.desiredDirection = Pacmaze.DIRECTIONS.down;
    }
    
    if(this.moveTarget.isZero())
    {
        var target = null;
        if(this.currentDirection !== Pacmaze.DIRECTIONS.none)
        {
            if(this.desiredDirection === this.currentDirection)
            {
                
                target = this.getNextMoveTarget(this.game.map, this.currentDirection);
                if(target !== null)
                {
                    this.moveTarget = target;
                }
                else
                {
                    this.currentDirection = Pacmaze.DIRECTIONS.none;
                    this.desiredDirection = Pacmaze.DIRECTIONS.none;
                }
            }
            else
            {
                target = this.getNextMoveTarget(this.game.map, this.desiredDirection);
                if(target !== null)
                {
                    this.moveTarget = target;
                    this.currentDirection = this.desiredDirection;
                }
                else
                {
                    target = this.getNextMoveTarget(this.game.map, this.currentDirection);
                    
                    if(target !== null)
                    {
                        this.moveTarget = target;
                        this.desiredDirection = this.currentDirection;
                    }
                    else
                    {
                        this.currentDirection = Pacmaze.DIRECTIONS.none;
                        this.desiredDirection = Pacmaze.DIRECTIONS.none;
                    }
                }
            }
        }
        else
        {
            if(this.desiredDirection ===Pacmaze.DIRECTIONS.none) return;
            
            target = this.getNextMoveTarget(this.game.map, this.desiredDirection);
            if(target !== null)
            {
                if(!this.hasMoved) this.hasMoved = true;
                
                this.moveTarget = target;
                this.currentDirection = this.desiredDirection;
            }
            else
            {
                this.desiredDirection = Pacmaze.DIRECTIONS.none;
            }
        }
    }
    else
    {
        this.x += this.currentDirection.x * this.speed;
        this.y += this.currentDirection.y * this.speed;

        var distance = Phaser.Point.distance(this.position, this.moveTarget);

        if(distance < this.speed)
        {
            this.x = this.moveTarget.x;
            this.y = this.moveTarget.y;
            this.moveTarget.setTo(0, 0);
        }
    }
};

Pacmaze.Player.prototype.canMove = function (map, currentTile, direction)
{
    var canMove = false;
    var targetTile = map.getTile(currentTile.x + direction.x, currentTile.y + direction.y);
    
    if(targetTile && targetTile.index === 0)
    {
        canMove = true;
    }
    
    return canMove;
};

Pacmaze.Player.prototype.getNextMoveTarget = function (map, direction)
{
    var nextTarget = null;
    var currentTile = map.getTileWorldXY(this.x, this.y);
    
    if(this.canMove(map, currentTile, direction))
    {
        nextTarget = Pacmaze.TILETOWORLDPOS(currentTile.x + direction.x, currentTile.y + direction.y);
    }
    
    return nextTarget;
};