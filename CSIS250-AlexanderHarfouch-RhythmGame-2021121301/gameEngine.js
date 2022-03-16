let removeSprites = [];
let loser = false;
class Game{
    constructor(){
        this.canvas = document.getElementById("mainGame");
        document.body.style.backgroundColor = "pink";
        this.canvas.style = "position: absolute; top: 50px; left: 350px; border:2px solid blue"
        this.ctx = this.canvas.getContext("2d");
        this.spritesArray = [];
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    update(){
        if(loser){
            if(13 in keysDown){
                loser = false;
                isPaused = false;
                resetGame();
            }
        }
        if(32 in keysDown){
            if(!isHoldingPause){
                isHoldingPause = true;
                for(let i = 0; i < this.spritesArray.length; i++){
                    if(this.spritesArray[i] instanceof BGMusic){
                        if(isPaused){
                            isPaused = false;
                            this.spritesArray[i].audio.play();
                        }
                        else{
                            isPaused = true;
                            this.spritesArray[i].audio.pause();
                        }
                    }
                }
            }
        }

        if(!isPaused){
            for(let i = 0; i < this.spritesArray.length; i++){
                this.spritesArray[i].update();
            }
            for(let i = 0; i < removeSprites.length; i++){
                this.removeSprite(this.spritesArray.indexOf(removeSprites[i]));
            }
            removeSprites = [];
        }
    }

    draw(){
        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        for(let i = 0; i < this.spritesArray.length; i++){
            this.spritesArray[i].draw();           
        }
    }

    addSprite(sprite){
        this.spritesArray.push(sprite);
    }

    removeSprite(index){
        this.spritesArray.splice(index, 1);
    }
}

window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
});

function isCollide(sprite1, sprite2){
    let a = Math.abs(sprite1.hitCircle.x - sprite2.hitCircle.x);
    let b = Math.abs(sprite1.hitCircle.y - sprite2.hitCircle.y);
    let c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    if(c <= sprite1.hitCircle.radius + sprite2.hitCircle.radius)
        return true;
    return false;
}

function isOnBeat(sprite1, sprite2){
    let deltaX = Math.abs(sprite1.hitCircle.x - sprite2.hitCircle.x);
    if(deltaX <= sprite1.hitCircle.radius + sprite2.hitCircle.radius)
        return true;
    return false;
}

function animate(game){
    game.update();
    game.draw();

    requestAnimationFrame(function(){
        animate(game);
    })
}

function resetGame(){
    for(let i = 0; i < game.spritesArray.length; i++){
        if(game.spritesArray[i] instanceof BGMusic){
            game.spritesArray[i].audio.pause();
            break;
        }
    }
    game.spritesArray = [];
    removeSprites = [];
    let enemies = [];
    let bg = new Background();
    let music = new BGMusic();
    let circleTop = new CircleTop();
    let circleBottom = new CircleBottom();
    let player = new Player(circleTop, circleBottom);
    let healthBar = new HealthBar(player);
    let rules = new Rules();

    for(let i = 0; i < music.timings.length; i++){
        let randomValue = Math.random();
        if(randomValue >= 0 && randomValue < 0.475)
            enemies.push(new EnemyTop(music.timings[i]));
        else if(randomValue >= 0.475 && randomValue < 0.95){
            if(i > 3){
                if(!(enemies[i - 1] instanceof Spike) || !(enemies[i - 2] instanceof Spike) || !(enemies[i - 3] instanceof Spike))
                    enemies.push(new EnemyBottom(music.timings[i]));
            }
        }
        else{
            if(i > 3){
                if(!(enemies[i - 1] instanceof Spike) || !(enemies[i - 2] instanceof Spike) || !(enemies[i - 3] instanceof Spike)
                    || !(enemies[i - 1] instanceof EnemyBottom || !(enemies[i - 2] instanceof EnemyBottom) || !(enemies[i - 3] instanceof EnemyBottom))){
                    enemies.push(new EnemyBottom(music.timings[i]));
                }
            }
            enemies.push(new Spike(music.timings[i]));
        }
    }

    game.addSprite(music);
    game.addSprite(bg);
    for(let i = 0; i < enemies.length; i++){
        game.addSprite(enemies[i]);
    }
    game.addSprite(player);
    game.addSprite(circleTop);
    game.addSprite(circleBottom);
    game.addSprite(healthBar);
    game.addSprite(rules);
}