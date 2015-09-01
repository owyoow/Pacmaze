/*global Phaser Pacmaze*/

Pacmaze.EBlue = function (game, x, y, delay)
{
    Phaser.Sprite.call(this, game, x, y, 'eBlue');
    this.game.add.existing(this);
    
    this.anchor.setTo(0.5);
    
    // direction 0 = none, 2 = up, 4 = left, 6 = right, 8 = down
    this.directions = [2, 4, 6, 8];
    this.currentDirection = 0;
    this.inCage = true;
    
    this.goal = Pacmaze.TILETOWORLDPOS(this.game.mapGen.cageRect.x + 3, this.game.mapGen.cageRect.y);
    this.moveTarget = new Phaser.Point();
    
    this.speed = 2;
    
    this.delay = this.game.time.now + delay;
    
    // state 0 = seeking, state 1 = cornder, state 2 = scared
    this.state = 0;
    
    this.stateChangeTime = this.game.time.now + this.game.rnd.between(5000, 10000);
};

Pacmaze.EBlue.prototype = Object.create(Phaser.Sprite.prototype);
Pacmaze.EBlue.prototype.constructor = Pacmaze.EBlue;

Pacmaze.EBlue.prototype.update = function ()
{
    if(this.delay > this.game.time.now) return;
    
    if(this.stateChangeTime < this.game.time.now)
    {
        if(this.state === 0)
        {
            this.state = 1; 
            this.stateChangeTime = this.game.time.now + this.game.rnd.between(3000, 5000);
        }
        else
        {
            this.state = 0;
            this.stateChangeTime = this.game.time.now + this.game.rnd.between(5000, 10000);
        }
        
    }
    if(this.moveTarget === null || this.moveTarget.isZero())
    {
        if(this.inCage)
        {
            if(this.game.mapGen.map[Math.floor(this.y / Pacmaze.TILESIZE)][Math.floor(this.x / Pacmaze.TILESIZE)] === 0)
            {
                this.inCage = false;
                // if(this.game.player.isMoving)
                // {
                //     this.goal = this.game.player.moveTarget;
                // }
                // else
                // {
                //     this.goal = this.game.player.position;
                // }
                this.goal = this.game.player.position;
            }
        }
        else
        {
            if(this.state === 0)
            {
                this.goal = this.game.player.position;
            }
            else if(this.state === 1)
            {
                this.goal = Pacmaze.TILETOWORLDPOS(1, 1);
            }
            // if(this.game.player.isMoving)
            // {
            //     this.goal = this.game.player.moveTarget;
            // }
            // else
            // {
            //     this.goal = this.game.player.position;
            // }
        }
        var target = null;
        var newDir = this.currentDirection;
        var test = 0;
        for(var i = 0; i < this.directions.length; i++)
        {
            var dir = this.directions[i];
            
            if((this.currentDirection === 4 && dir === 6) || (this.currentDirection === 6 && dir === 4) ||
              (this.currentDirection === 2 && dir === 8) || (this.currentDirection === 8 && dir === 2)) continue;
            
            var pos = this.getNextMoveTarget(dir);
            if(pos === null) continue;
            test++;
            if(target === null)
            {
                target = pos;
                newDir = dir;
            }
            else
            {
                var distance1 = Phaser.Point.distance(this.goal, target);
                var distance2 = Phaser.Point.distance(this.goal, pos);
                
                if(distance2 < distance1)
                {
                    target = pos;
                    newDir = dir;
                }
            }
        }
        
        this.moveTarget = target;
        this.currentDirection = newDir;
    }
    else
    {
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

Pacmaze.EBlue.prototype.getNextMoveTarget = function (direction)
{
    var tile = this.game.map.getTileWorldXY(this.x, this.y);

    var nextTarget = null;
    var nextTile;
    if(direction === 4)
    {
        nextTile = this.game.map.getTileLeft(0, tile.x, tile.y);
        if(nextTile.index === 0 || (nextTile.index === 2 && this.inCage))
        {
            nextTarget = Pacmaze.TILETOWORLDPOS(nextTile.x, nextTile.y);
        }
    }
    else if(direction === 6)
    {
        nextTile = this.game.map.getTileRight(0, tile.x, tile.y);
        if(nextTile.index === 0 || (nextTile.index === 2 && this.inCage))
        {
            nextTarget = Pacmaze.TILETOWORLDPOS(nextTile.x, nextTile.y);
        }
    }
    else if(direction === 2)
    {
        nextTile = this.game.map.getTileAbove(0, tile.x, tile.y);
        if(nextTile.index === 0 || (nextTile.index === 2 && this.inCage))
        {
            nextTarget = Pacmaze.TILETOWORLDPOS(nextTile.x, nextTile.y);
        }
    }
    else if(direction === 8)
    {
        nextTile = this.game.map.getTileBelow(0, tile.x, tile.y);
        if(nextTile.index === 0 || (nextTile.index === 2 && this.inCage))
        {
            nextTarget = Pacmaze.TILETOWORLDPOS(nextTile.x, nextTile.y);
        }
    }
    
    return nextTarget;
};