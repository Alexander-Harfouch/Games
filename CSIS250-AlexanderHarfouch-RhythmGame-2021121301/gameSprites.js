class Sprite{
    constructor(x, y, velocityX, velocityY){
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }

    update(){
        console.log("Sprite updated");
    }

    draw(){
        console.log("Sprite drawn");
    }
}

class HitCircle{
    constructor(x, y, radius){
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    draw(){
        game.ctx.beginPath();
        game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        game.ctx.stroke();
    }
}

var isHolding = false;
var isHoldingPause = false;
var isPaused = false;
var keysDown = {};
addEventListener("keydown", function(e){
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e){
    delete keysDown[e.keyCode];
    isHolding = false;
    isHoldingPause = false;
}, false);

class Player extends Sprite{
    constructor(circleTop, circleBottom){
        super(10, 470, 0, 0);
        this.width = 700 / 6;
        this.height = 135;
        this.health = 6;
        this.circleTop = circleTop;
        this.circleBottom = circleBottom;
        this.hitCircle = new HitCircle(this.x + this.width / 2, this.y + this.height / 2, this.width / 2);
        this.image = new Image();
        this.image.src = "images/player.png";
        this.audio = new Audio();
        this.audio.src = "music/hitSound.mp3";
        this.sx = 0;
        this.sy = 0;
        this.currentFrame = 0;
        this.frameLimiter = 0;
        this.jumpingState = false;
    }
    update(){
        if(this.health <= 0){
            loser = true;
            game.addSprite(new Loser());
        }
        if(38 in keysDown){
            if(!isHolding){
                isHolding = true;
                this.jumpingState = true;
                this.y = 250;
                this.hitCircle.y = 250 + this.height / 2;
                this.currentFrame = 0;
                this.sy = (500 * 2) / 3;
                this.sx = 0;

                for(let i = 0; i < game.spritesArray.length; i++){
                    if(game.spritesArray[i] instanceof EnemyTop){
                        if(isOnBeat(game.spritesArray[i], this.circleTop)){
                            removeSprites.push(game.spritesArray[i]);
                            this.audio.currentTime = 0;
                            this.audio.play();
                        }
                    }
                }
            }
        }
                       
        if(40 in keysDown){
            if(!isHolding){
                isHolding = true;
                this.y = 470;
                this.hitCircle.y = 470 + this.height / 2;
                this.currentFrame = 0;
                this.sy = 500 / 3;
                this.sx = 0;

                for(let i = 0; i < game.spritesArray.length; i++){
                    if(game.spritesArray[i] instanceof EnemyBottom){
                        if(isOnBeat(game.spritesArray[i], this.circleBottom)){
                            removeSprites.push(game.spritesArray[i]);
                            this.audio.currentTime = 0;
                            this.audio.play();
                        }
                    }
                }
            }
        }

        for(let i = 0; i < game.spritesArray.length; i++){
            if(game.spritesArray[i] instanceof Spike){
                if(isCollide(game.spritesArray[i], this)){
                    removeSprites.push(game.spritesArray[i]);
                    this.health--;
                }
            }
        }

        if(this.frameLimiter >= 3){  
            this.sx += this.width;
            if(this.sx >= this.width * 6){
                this.sx = 0;
            }
            this.frameLimiter = 0;      
            if(this.currentFrame >= 6){
                this.currentFrame = 0;
                this.sy = 0;
                if(this.jumpingState){
                    this.y = 470;
                    this.hitCircle.y = 470 + this.height / 2;
                    this.jumpingState = false;
                }  
            }
            else{
                this.currentFrame++;
            }              
        }
        this.frameLimiter++;
    }
    draw(){
        game.ctx.drawImage(this.image, this.sx, this.sy, this.width, this.height, this.x, this.y, this.width, this.height);
        //this.hitCircle.draw();
    }
}

class EnemyTop extends Sprite{
    constructor(timing){
        super(600 * timing + 180, 300, 10, 0);
        this.width = 642 / 3;
        this.height = 100;
        this.hitCircle = new HitCircle((this.x + this.width / 2) - 47, this.y + this.height / 2, 45);
        this.image = new Image();
        this.image.src = "images/enemy1.png";
        this.sx = 0;
        this.frameLimiter = 0;
    }
    update(){
        if(this.x + this.width <= 0){
            removeSprites.push(this);
            for(let i = 0; i < game.spritesArray.length; i++){
                if(game.spritesArray[i] instanceof Player){
                    game.spritesArray[i].health--;
                    break;
                }
            }
        }

        this.x -= this.velocityX;
        this.hitCircle.x -= this.velocityX;
        if(this.frameLimiter >= 5){
            this.sx += this.width;
            if(this.sx >= this.width * 3){
                this.sx = 0;
            }
            this.frameLimiter = 0;
        }
        this.frameLimiter++;
    }
    draw(){
        game.ctx.drawImage(this.image, this.sx, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        //this.hitCircle.draw();
    }
}

class EnemyBottom extends Sprite{
    constructor(timing){
        super(600 * timing + 180, 470, 10, 0);
        this.width = 720 / 6;
        this.height = 138;
        this.hitCircle = new HitCircle(this.x + this.width / 2, this.y + this.height / 2, 45);
        this.image = new Image();
        this.image.src = "images/enemy2.png";
        this.sx = 0;
        this.frameLimiter = 0;
    }
    update(){
        if(this.x + this.width <= 0){
            removeSprites.push(this);
            for(let i = 0; i < game.spritesArray.length; i++){
                if(game.spritesArray[i] instanceof Player){
                    game.spritesArray[i].health--;
                    break;
                }
            }
        }

        this.x -= this.velocityX;
        this.hitCircle.x -= this.velocityX;
        if(this.frameLimiter >= 5){
            this.sx += this.width;
            if(this.sx >= this.width * 6){
                this.sx = 0;
            }
            this.frameLimiter = 0;
        }
        this.frameLimiter++;
    }
    draw(){
        game.ctx.drawImage(this.image, this.sx, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        //this.hitCircle.draw();
    }
}

class Spike extends Sprite{
    constructor(timing){
        super(600 * timing + 180, 550, 10, 0);
        this.width = 501 / 5;
        this.height = 50;
        this.hitCircle = new HitCircle((this.x + this.width / 2), this.y + this.height / 2 + 60, this.width / 2);
        this.image = new Image();
        this.image.src = "images/spikes.png";
        this.sx = 0;
        this.frameLimiter = 0;
    }
    update(){
        this.x -= this.velocityX;
        this.hitCircle.x -= this.velocityX;
        if(this.frameLimiter >= 5){
            this.sx += this.width;
            if(this.sx >= this.width * 5){
                this.sx = 0;
            }
            this.frameLimiter = 0;
        }
        this.frameLimiter++;
    }
    draw(){
        game.ctx.drawImage(this.image, this.sx, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        //this.hitCircle.draw();
    }
}

class CircleTop extends Sprite{
    constructor(){
        super(200, 320, 0, 0);
        this.image = new Image();
        this.image.src = "images/CircleTop.png"
        this.width = 300 / 6;
        this.height = 50;
        this.hitCircle = new HitCircle(this.x + this.width / 2, this.y + this.height / 2, this.width / 2);
        this.frameLimiter = 0;
        this.currentRow = 1;
        this.sx = 0;
        this.sy = 0;
    }
    update(){
        if(this.frameLimiter >= 3){
            this.sx += this.width;
            if(this.sx >= this.width * 6){
                this.sx = 0;
                if(this.currentRow == 1){
                    this.currentRow = 2;
                    this.sy = 50;
                }
                else{
                    this.currentRow = 1;
                    this.sy = 0;
                }
            }
            this.frameLimiter = 0;
        }
        else
            this.frameLimiter++;
    }   
    draw(){
        game.ctx.drawImage(this.image, this.sx, this.sy, this.width, this.height, this.x, this.y, this.width, this.height);
        //this.hitCircle.draw();
    }
}

class CircleBottom extends Sprite{
    constructor(){
        super(200, 510, 0, 0);
        this.image = new Image();
        this.image.src = "images/CircleBottom.png"
        this.width = 300 / 6;
        this.height = 50;
        this.hitCircle = new HitCircle(this.x + this.width / 2, this.y + this.height / 2, this.width / 2);
        this.frameLimiter = 0;
        this.currentRow = 1;
        this.sx = 0;
        this.sy = 0;
    }
    update(){
        if(this.frameLimiter >= 3){
            this.sx += this.width;
            if(this.sx >= this.width * 6){
                this.sx = 0;
                if(this.currentRow == 1){
                    this.currentRow = 2;
                    this.sy = 50;
                }
                else{
                    this.currentRow = 1;
                    this.sy = 0;
                }
            }
            this.frameLimiter = 0;
        }
        else
            this.frameLimiter++;
    }   
    draw(){
        game.ctx.drawImage(this.image, this.sx, this.sy, this.width, this.height, this.x, this.y, this.width, this.height);
        //this.hitCircle.draw();
    }
}

class Background extends Sprite{
    constructor(){
        super();
        this.image = new Image();
        this.image.src = "images/background.png"
        this.width = game.width;
        this.height = game.height;
        this.sx = 0;
    }
    update(){
        if(this.sx >= this.width)
            this.sx = 0;
        this.sx += 4;
    }
    draw(){
        game.ctx.drawImage(this.image, this.sx, 0, this.width, this.height, 0, 0, this.width, this.height);
    }
}

class HealthBar extends Sprite{
    constructor(player){
        super(0, 10, 0, 0);
        this.width = 200;
        this.height = 268 / 6;
        this.image = new Image();
        this.image.src = "images/healthBar.png"
        this.player = player;
        this.sy = 268 * 5 / 6;
    }
    update(){
        this.sy = (this.player.health - 1) * 268 / 6;
    }
    draw(){
        game.ctx.drawImage(this.image, 0, this.sy, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}

class BGMusic extends Sprite{
    constructor(){
        super();
        //enjoy this array
        this.timings = [3.229, 3.479, 3.679, 3.912, 4.562, 5.546, 5.962, 6.212, 6.445, 7.645, 8.129, 8.629,
        9.112, 9.346, 9.779, 10.012, 11,195, 11.429, 11.795, 12.145, 12.595, 13.062, 13.529, 13.729, 14.945,
        15.162, 15.612, 15.862, 16.345, 16.512, 17.229, 17.695, 18.195, 18.395, 18.879, 21.712, 21.929, 21.179,
        22.429, 22.695, 22.895, 23.129, 23.329, 23.812, 24.279, 24.712, 25.162, 25.628, 26.112, 26.362, 26.628,
        26.862, 27.112, 27.545, 27.995, 28.412, 28.912, 29.412, 29.679, 30.149, 30.362, 30.612, 30.812, 31.345,
        31.812, 32.278, 32.795, 33.262, 33.878, 34.095, 34.378, 34.595, 35.078, 35.528, 36.462, 36.712, 36.962,
        37.179, 37.412, 37.645, 38.112, 38.312, 38.845, 39.295, 40.012, 40.245, 40.962, 41.178, 41.428, 41.911,
        42.128, 42.595, 43.078, 43.578, 43.812, 44.695, 45.178, 45.678, 45.878, 46.378, 46.828, 47.312, 47.528,
        47.778, 48.478, 48.678, 48.945, 49.595, 50.061, 50.528, 51.028, 51.278, 51.495, 51.728, 52.211, 52.678,
        53.361, 53.845, 54.095, 54.261, 54.511, 54.945, 55.378, 55.945, 56.428, 56.911, 57.111, 57.661, 58.095,
        58.545, 58.978, 60.628, 60.828, 61.378, 61.811, 62.311, 62.711, 63.295, 63.728, 64.228, 64.678, 65.345,
        65.561, 66.061, 66.528, 66.978, 67.511, 68.078, 68.545, 69.028, 69.528, 69.861, 70.211, 70.444, 70.711,
        70.945, 71.178, 71.428, 72.094, 73.078, 73.478, 73.728, 73.978, 75.194, 75.628, 76.061, 76.561, 76.794,
        76.294, 77.511, 78.678, 78.894, 79.228, 79.578, 80.011, 80.528, 80.994, 81.211, 82.428, 82.644, 83.128,
        83.361, 83.794, 84.011, 84.761, 85.194, 85.694, 85.961, 86.444, 86.644, 86.894, 87.094, 87.568, 88.061,
        88.528, 88.978, 89.428, 89.911, 90.144, 90.477, 90.628, 90.844, 91.327, 91.827, 92.261, 92.694, 93.177,
        93.444, 93.927, 94.144, 94.394, 94.611, 95.044, 95.511, 95.977, 96.427, 96.911, 97.211, 97.411, 97.677,
        97.894, 98.161, 98.394, 98.827, 99.261, 99.727, 100.211, 100.444, 100.694, 100.944, 101.177, 101.427];
        this.audio = new Audio();
        this.audio.src = "music/bgMusic.mp3";
        this.audio.play();
    }
    update(){
        if(loser){
            this.audio.pause();
            isPaused = true;
        }
        this.audio.addEventListener("ended", function(){
            game.addSprite(new Winner());
        });
    }
    draw(){

    }
}

class Rules extends Sprite{
    constructor(){
        super(0, 0, 0, 0);
        this.canvasRules = document.getElementById("rules");
        this.canvasRules.style = "position: absolute; top: 50px; left: 0px; border:2px solid blue"
        this.ctxRules = this.canvasRules.getContext("2d");
        this.width = this.canvasRules.width;
        this.height = this.canvasRules.height;
        this.image = new Image();
        this.image.src = "images/rules.png"
    }
    update(){
        
    }
    draw(){
        this.ctxRules.drawImage(this.image, this.x, this.y);
    }
}

class Winner extends Sprite{
    constructor(){
        super(game.width / 2, game.height / 2 - 200, 0, 0);
        this.width = 357;
        this.height = 201;
        this.image = new Image();
        this.image.src = "images/winner.png"
    }
    update(){
        if(13 in keysDown){
            resetGame();
        }
    }
    draw(){
        game.ctx.drawImage(this.image, this.x - this.width / 2, this.y);
    }
}

class Loser extends Sprite{
    constructor(){
        super(game.width / 2, game.height / 2 - 200, 0, 0);
        this.width = 338;
        this.height = 338;
        this.image = new Image();
        this.image.src = "images/loser.png"
    }
    update(){

    }
    draw(){
        game.ctx.drawImage(this.image, this.x - this.width / 2, this.y);
    }
}