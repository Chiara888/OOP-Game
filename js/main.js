class Game {
    constructor() {
        this.player = null
        this.obstacleArr = [];
        this.bulletsArr = [];  
    }

    startGame() {
        this.player = new Player();
        this.createEventListeners();

        // Commands for obstacles (appear + disappear random)
        setInterval(() => {
            const createObstacle = new Obstacle();
            this.obstacleArr.push(createObstacle);
            this.obstacleArr.forEach((obstacleElm) => {
                obstacleElm.appearRandom();
            })
        }, 4000);

        setInterval(() => {
            if (this.obstacleArr.length > 0) {
                console.log(this.obstacleArr);
                this.obstacleArr[0].domElement.remove();
                this.obstacleArr.shift();
            }
        }, 5000);

        // Commands for collision of obstacle & bullet after shooting 
        setInterval(() => {
            this.bulletsArr.forEach((bulletElm, bulletIndex) => {
                bulletElm.shootBullet();
                this.obstacleArr.forEach((obstacleElm, obstacleIndex) => {
                    this.detectCollision(bulletElm, bulletIndex, obstacleElm, obstacleIndex);
                    this.removeObstacleOutsideBoard(bulletElm, bulletIndex);
                })
            });
        }, 10);
    };
    
    createEventListeners() {
        // Commands for the player
        document.addEventListener("keydown", (event) => {
            if (event.code === "ArrowLeft") {
                this.player.moveLeft();
            } else if (event.code === "ArrowRight") {
                this.player.moveRight();
            } else if (event.code === "ArrowDown") {
                this.player.moveBackwards();
            } else if (event.code === "ArrowUp") {
                this.player.moveForward();
            }
        });

        // Commands to shoot bullets
        document.addEventListener("keydown", (event) => {
            if (event.code === "Space") {
                const createBullet = new Bullets(this.player.positionX);
                this.bulletsArr.push(createBullet);
            }
        });
    };

    detectCollision(bulletElm, bulletIndex, obstacleElm, obstacleIndex) {
        if (obstacleElm.positionX < bulletElm.positionX + bulletElm.width &&
            obstacleElm.positionX + obstacleElm.width > bulletElm.positionX &&
            obstacleElm.positionY < bulletElm.positionY + bulletElm.height &&
            obstacleElm.height + obstacleElm.positionY > bulletElm.positionY) {

            console.log('hidden obstacle!');

            obstacleElm.domElement.remove();
            this.obstacleArr.splice(obstacleIndex, 1);

            bulletElm.domElement.remove();
            this.bulletsArr.splice(bulletIndex, 1);

            bulletElm.hitObstablesGetEnergy();
        }
    };

    removeObstacleOutsideBoard (bulletElm, bulletIndex) {
        if (bulletElm.positionY > 100 - bulletElm.height) {
            bulletElm.domElement.remove();
            this.bulletsArr.splice(bulletIndex, 1);
            console.log('bullet gone')
        }
    }

    
class Timer {
    constructor() {
        this.timer = null
        this.timeLeft = 30;
    }
    
    // document.addEventListener("click", (event) => {
    //     if (event.code === "onclick") {
    //         this.startTimer()
    //     }
    // })

    startTimer() {
        this.timer = setInterval(updateTimer, 1000);
        this.updateTimer();

        // We don't want the to be able to restart the timer while it is running,
        // so hide the button.
        // $('#playAgainButton').hide();
    };

    updateTimer() {
        this.timeLeft -= 1
        if (this.timeLeft >= 0) {
            document.getElementById("timer").innerText = this.timeLeft 
        } else {
            this.gameOver();
        }
    };

    gameOver() {
        clearInterval(this.timer);
        const displayButtonStart = document.getElementById("startAgain");
        if (displayButtonStart.style.display === '0') {
            displayButtonStart.style.display = "block"
        }
        }
}


class Player {
    constructor() {
        this.width = 4;
        this.height = 10;
        this.positionX = 50 - this.width/2;
        this.positionY = 15;

        this.domElement = null;
        this.createDomElement();
    }

    createDomElement () {
        this.domElement = document.createElement("div");
        this.domElement.id = "player";
        this.domElement.style.width = this.width + "vw";
        this.domElement.style.height = this.height + "vh";
        this.domElement.style.left = this.positionX + "vw";
        this.domElement.style.bottom = this.positionY + "vh";

        const parentElm = document.getElementById("board");
        parentElm.appendChild(this.domElement);
    }

    moveLeft () {
        this.positionX--;
        this.domElement.style.left = this.positionX +"vw";
    }

    moveRight () {
        this.positionX++;
        this.domElement.style.left = this.positionX +"vw";
    }

    // moveForward () {
    //     this.positionY++;
    //     this.domElement.style.bottom = this.positionY +"vh"
    // }

    // moveBackwards () {
    //     this.positionY--;
    //     this.domElement.style.bottom = this.positionY +"vh"
    // }
}


class Obstacle {
    constructor() {
        this.width = 2;
        this.height = 6;
        this.positionX = 50 - this.width/2;
        this.positionY = 80;

        this.domElement = null;
        this.createDomElement();
    }

    createDomElement() {
        this.domElement = document.createElement("div");

        this.domElement.className = "obstacle";
        this.domElement.style.width = this.width + "vw";
        this.domElement.style.height = this.height + "vh";
        this.domElement.style.left = this.positionX + "vw";
        this.domElement.style.bottom = this.positionY + "vh";
        this.domElement.style.position = 'absolute'


        const parentElm = document.getElementById("board");
        parentElm.appendChild(this.domElement);
    }
    
    randomPosition(min, max) {
        return Math.floor(Math.random() * (max-min)+min); 
    }

    appearRandom() {
        this.positionX = this.randomPosition(20,98)
        this.positionY = this.randomPosition(20,98)
        this.domElement.style.left = this.positionX + "vw";
        this.domElement.style.bottom = this.positionY + "vh";
    }
}

class Bullets {
    constructor (positionX) { 
        this.width = 5;
        this.height = 5;
        this.positionX = positionX;
        this.positionY = 20; 
        this.getEnergy = 0;
        
        this.domElement = null;
        this.createDomElement();
    }

    createDomElement() {
        this.domElement = document.createElement("div");

        this.domElement.className = "bullets";
        this.domElement.style.width = this.width + "vw";
        this.domElement.style.height = this.height + "vh";
        this.domElement.style.left = this.positionX + "vw";
        this.domElement.style.bottom = this.positionY + "vh";
        this.domElement.style.position = 'absolute'

        const parentElm = document.getElementById("board");
        parentElm.appendChild(this.domElement);
    }

    shootBullet() {
        this.positionY++;
        this.domElement.style.bottom = this.positionY +"vh";
    }
 
    hitObstablesGetEnergy() {
        this.getEnergy += 1;
        document.getElementById("score").innerText = Number(this.getEnergy);
    }
}
 

const letsStartGame = new Game();
letsStartGame.startGame();


