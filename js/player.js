/*global Phaser Pacmaze*/

Pacmaze.Player = function (game, x, y)
{
    Phaser.Sprite.call(this, game, x, y, 'player');
    this.game.add.existing(this);
    
    this.anchor.setTo(0.5);

    this.moveTarget = new Phaser.Point();
    this.isMoving = false;
    
    // direction 0 = none, 2 = up, 4 = left, 6 = right, 8 = down
    this.currentDirection = 0;
    this.desiredDirection = 0;
    
     this.speed = 2;
};

Pacmaze.Player.prototype = Object.create(Phaser.Sprite.prototype);
Pacmaze.Player.prototype.constructor = Pacmaze.Player;

Pacmaze.Player.prototype.update = function ()
{
    this.game.foodGroup.forEach(function(food)
    {
        if(this.checkOverlap(this, food))
        {
            food.kill();
        }
    }, this);
    
    
    if(this.game.gameInput.left)
    {
        if(this.currentDirection === 6) this.moveTarget.setTo(0, 0);
        this.desiredDirection = 4;
    }
    else if(this.game.gameInput.right)
    {
        if(this.currentDirection === 4) this.moveTarget.setTo(0, 0);
        this.desiredDirection = 6;
    }
    else if(this.game.gameInput.up)
    {
        if(this.currentDirection === 8) this.moveTarget.setTo(0, 0);
        this.desiredDirection = 2;
    }
    else if(this.game.gameInput.down)
    {
        if(this.currentDirection === 2) this.moveTarget.setTo(0, 0);
        this.desiredDirection = 8;
    }
    
    if(this.moveTarget.isZero())
    {
        this.isMoving = false;
        var target = null;
        if(this.currentDirection !== 0)
        {
            
            if(this.desiredDirection === this.currentDirection)
            {
                target = this.getNextMoveTarget(this.currentDirection);
                
                if(target !== null)
                {
                    this.moveTarget = target;
                }
                else
                {
                    this.currentDirection = 0;
                    this.desiredDirection = 0;
                }
            }
            else
            {
                target = this.getNextMoveTarget(this.desiredDirection);
                
                if(target !== null)
                {
                    this.moveTarget = target;
                    this.currentDirection = this.desiredDirection;
                }
                else
                {
                    target = this.getNextMoveTarget(this.currentDirection);
                    
                    if(target !== null)
                    {
                        this.moveTarget = target;
                        this.desiredDirection = this.currentDirection;
                    }
                    else
                    {
                        this.currentDirection = 0;
                        this.desiredDirection = 0;
                    }
                }
            }
        }
        else
        {
            if(this.desiredDirection === 0) return;
            
            target = this.getNextMoveTarget(this.desiredDirection);
            if(target !== null)
            {
                this.moveTarget = target;
                this.currentDirection = this.desiredDirection;
            }
            else
            {
                this.desiredDirection = 0;
            }
        }
    }
    else
    {
        this.isMoving = true;
        if(this.currentDirection === 4)
        {
            this.x -= this.speed;
        }
        else if(this.currentDirection === 6)
        {
            this.x += this.speed;
        }
        else if(this.currentDirection === 2)
        {
            this.y -= this.speed;
        }
        else if(this.currentDirection === 8)
        {
            this.y += this.speed;
        }
        var distance = Phaser.Point.distance(this.position, this.moveTarget);

        if(distance < this.speed)
        {
            this.x = this.moveTarget.x;
            this.y = this.moveTarget.y;
            this.moveTarget.setTo(0, 0);
        }
    }
};

Pacmaze.Player.prototype.getNextMoveTarget = function (direction)
{
    var tile = this.game.map.getTileWorldXY(this.x, this.y);

    var nextTarget = null;
    var nextTile;
    if(direction === 4)
    {
        if(this.game.mapGen.map[tile.y][tile.x - 1] === 0)
        {
            nextTile = this.game.map.getTileLeft(0, tile.x, tile.y);
            nextTarget = Pacmaze.TILETOWORLDPOS(nextTile.x, nextTile.y);
        }
    }
    else if(direction === 6)
    {
        if(this.game.mapGen.map[tile.y][tile.x + 1] === 0)
        {
            nextTile = this.game.map.getTileRight(0, tile.x, tile.y);
            nextTarget = Pacmaze.TILETOWORLDPOS(nextTile.x, nextTile.y);
        }
    }
    else if(direction === 2)
    {
        if(this.game.mapGen.map[tile.y - 1][tile.x] === 0)
        {
            nextTile = this.game.map.getTileAbove(0, tile.x, tile.y);
            nextTarget = Pacmaze.TILETOWORLDPOS(nextTile.x, nextTile.y);
        }
    }
    else if(direction === 8)
    {
        if(this.game.mapGen.map[tile.y + 1][tile.x] === 0)
        {
            nextTile = this.game.map.getTileBelow(0, tile.x, tile.y);
            nextTarget = Pacmaze.TILETOWORLDPOS(nextTile.x, nextTile.y);
        }
    }
    
    return nextTarget;
};

Pacmaze.Player.prototype.checkOverlap = function (spriteA, spriteB)
{
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);  
};