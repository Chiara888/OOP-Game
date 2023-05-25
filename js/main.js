class Game {
    constructor() {
        this.player = null;
        this.obstacleArr = [];
        this.bulletsArr = [];

        this.timeLeft = 40;
        this.timer = null;
        this.getEnergy = 20;
    }

    startGame() {
        this.player = new Player();
        this.createEventListeners();
        this.startTimer();

        // Commands for obstacles (appear + disappear random)
        setInterval(() => {
            const createObstacle = new Obstacle();
            this.obstacleArr.push(createObstacle);
            this.obstacleArr.forEach((obstacleElm) => {
                obstacleElm.appearRandom();
            })
        }, 2000);

        setInterval(() => {
            if (this.obstacleArr.length > 0) {
                console.log(this.obstacleArr);
                this.obstacleArr[0].domElement.remove();
                this.obstacleArr.shift();
            }
        }, 8000);

        // Commands for collision of obstacle & bullet after shooting 
        setInterval(() => {
            this.bulletsArr.forEach((bulletElm, bulletIndex) => {
                bulletElm.shootBullet();
                this.obstacleArr.forEach((obstacleElm, obstacleIndex) => {
                    // this.detectCollisionPlayer(obstacleElm, obstacleIndex);
                    this.detectCollision(bulletElm, bulletIndex, obstacleElm, obstacleIndex);
                    this.removeObstacleOutsideBoard(bulletElm, bulletIndex);
                })
            });
        }, 10);

        setInterval(() => {
            this.obstacleArr.forEach((obstacleElm, obstacleIndex) => {
                this.detectCollisionPlayer(obstacleElm, obstacleIndex);
            })
        }, 500);
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
                const createBullet = new Bullets(this.player.positionX, this.player.positionY);
                this.bulletsArr.push(createBullet);
            }
        });
    };

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft -= 1;
            document.getElementById("timer").innerText = `Seconds left: ${this.timeLeft}`
            if (this.timeLeft <= 0) {
                location.href = './gameover.html';
            } else if (this.getEnergy >= 100) {
                location.href = './gamewon.html';
            }
        }, 1000);
    };

    detectCollisionPlayer(obstacleElm, obstacleIndex) {
        if (obstacleElm.positionX < this.player.positionX + this.player.width &&
            obstacleElm.positionX + obstacleElm.width > this.player.positionX &&
            obstacleElm.positionY < this.player.positionY + this.player.height &&
            obstacleElm.height + obstacleElm.positionY > this.player.positionY) {

            console.log('hidden player!');

            obstacleElm.domElement.remove();
            this.obstacleArr.splice(obstacleIndex, 1);
            this.getEnergy -= 5;

            if (this.getEnergy > 0) {
                document.getElementById("energy-level").innerText = `Energy Level: ${this.getEnergy}/100`;
            } else {
                location.href = './gameover.html';
            }
        }
    };

    detectCollision(bulletElm, bulletIndex, obstacleElm, obstacleIndex) {
        if (obstacleElm.positionX < bulletElm.positionX + bulletElm.width &&
            obstacleElm.positionX + obstacleElm.width > bulletElm.positionX &&
            obstacleElm.positionY < bulletElm.positionY + bulletElm.height &&
            obstacleElm.height + obstacleElm.positionY > bulletElm.positionY) {

            console.log('hidden obstacle!');

            this.getEnergy += 10;
            document.getElementById("energy-level").innerText = `Energy Level: ${this.getEnergy}/100`;

            obstacleElm.domElement.remove();
            this.obstacleArr.splice(obstacleIndex, 1);

            bulletElm.domElement.remove();
            this.bulletsArr.splice(bulletIndex, 1);
        }
    };

    removeObstacleOutsideBoard(bulletElm, bulletIndex) {
        if (bulletElm.positionY > 100 - bulletElm.height) {
            bulletElm.domElement.remove();
            this.bulletsArr.splice(bulletIndex, 1);
            console.log('bullet gone')
        }
    }
}


class Player {
    constructor() {
        this.width = 6
        this.height = 12;
        this.positionX = 50 - this.width / 2;
        this.positionY = 5;

        this.domElement = null;
        this.createDomElement();
    }

    createDomElement() {
        this.domElement = document.createElement("div");
        this.domElement.id = "player";
        this.domElement.style.width = this.width + "vw";
        this.domElement.style.height = this.height + "vh";
        this.domElement.style.left = this.positionX + "vw";
        this.domElement.style.bottom = this.positionY + "vh";

        const parentElm = document.getElementById("board");
        parentElm.appendChild(this.domElement);
    }

    moveLeft() {
        this.positionX -= 4;
        this.domElement.style.left = this.positionX + "vw";
    }

    moveRight() {
        this.positionX += 4;
        this.domElement.style.left = this.positionX + "vw";
    }

    moveForward() {
        this.positionY += 4;
        this.domElement.style.bottom = this.positionY + "vh"
    }

    moveBackwards() {
        this.positionY -= 4;
        this.domElement.style.bottom = this.positionY + "vh"
    }
}


class Obstacle {
    constructor() {
        this.width = 3.5;
        this.height = 8;
        this.positionX = 50 - this.width / 2;
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
        return Math.floor(Math.random() * (max - min) + min);
    }

    appearRandom() {
        this.positionX = this.randomPosition(10, 98)
        this.positionY = this.randomPosition(10, 98)
        this.domElement.style.left = this.positionX + "vw";
        this.domElement.style.bottom = this.positionY + "vh";
    }
}

class Bullets {
    constructor(positionX, positionY) {
        this.width = 3;
        this.height = 3;
        this.positionX = positionX;
        this.positionY = positionY;

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
        this.domElement.style.bottom = this.positionY + "vh";
    }
}


const letsStartGame = new Game();
letsStartGame.startGame();


