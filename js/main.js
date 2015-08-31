/*global Phaser Pacmaze*/

window.onload = function ()
{
    var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'gameContainer');
    
    // load all gamestates
    game.state.add('boot', Pacmaze.Boot);
    game.state.add('preload', Pacmaze.Preload);
    game.state.add('game', Pacmaze.Game);
    
    game.state.start('boot');
};