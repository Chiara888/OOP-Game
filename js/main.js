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
    constructor () {
        this.width = 2;
        this.height = 6;
        this.positionX = 50 - this.width/2;
        this.positionY = 80;

        this.domElement = null;
        this.createDomElement();
    }

    createDomElement () {
        this.domElement = document.createElement("div");

        this.domElement.className = "obstacle";
        this.domElement.style.width = this.width + "vw";
        this.domElement.style.height = this.height + "vh";
        this.domElement.style.left = this.positionX + "vw";
        this.domElement.style.bottom = this.positionY + "vh";

        const parentElm = document.getElementById("board");
        parentElm.appendChild(this.domElement);
    }
    
    randomPosition (min, max) {
        return Math.floor(Math.random() * (max-min)+min); 
    }

    appearRandom () {
        this.domElement.style.left = this.randomPosition(20,98) + "vw";
        this.domElement.style.bottom = this.randomPosition(20,98) + "vh";
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

    createDomElement () {
        this.domElement = document.createElement("div");

        this.domElement.className = "bullets";
        this.domElement.style.width = this.width + "vw";
        this.domElement.style.height = this.height + "vh";
        this.domElement.style.left = this.positionX + "vw";
        this.domElement.style.bottom = this.positionY + "vh";

        const parentElm = document.getElementById("board");
        parentElm.appendChild(this.domElement);
    }

    shootBullet () {
        this.positionY++;
        this.domElement.style.bottom = this.positionY +"vh";
    }

    hitObstacles () {
        this.getEnergy += 5;
        document.getElementById("score").innerText = this.getEnergy;
    }
}
 
// Commands general 
const player = new Player();
const obstacleArr = [];
const bulletsArr = [];


// Commands for the player
document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft") {
        player.moveLeft();
    } else if (event.code === "ArrowRight") {
        player.moveRight();
    } else if (event.code === "ArrowDown") {
        player.moveBackwards();
    } else if (event.code === "ArrowUp") {
        player.moveForward();
    }
})


// Commands for the obstacles
setInterval(() => {
    const createObstacle = new Obstacle();
    obstacleArr.push(createObstacle);
    obstacleArr.forEach((obstacleElm) => {
        obstacleElm.appearRandom();
    })}, 4000); 

setInterval(() => {
    const obstacleone = obstacleArr.shift();
    obstacleone.domElement.remove();
}, 7000); 


// Commands to shoot
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        const createBullet = new Bullets(player.positionX);
        bulletsArr.push(createBullet);
    }
})  


// check if collision. if so, delete obstacle and bullet.
setInterval(() => {
    bulletsArr.forEach((bulletElm, bulletIndex) => {
        bulletElm.shootBullet();
        // this.COLLISION(bulletElm, index)

        // collision{

       // }
        obstacleArr.forEach((obstacleElm, obstacleIndex) => {

            if (obstacleElm.positionX < bulletElm.positionX + bulletElm.width &&
                obstacleElm.positionX + obstacleElm.width > bulletElm.positionX &&
                obstacleElm.positionY < bulletElm.positionY + bulletElm.height &&
                obstacleElm.height + obstacleElm.positionY > bulletElm.positionY) {

                console.log('hidden obstacle!');

                obstacleElm.domElement.remove();
                obstacleArr.splice(obstacleIndex, 1);

                bulletElm.domElement.remove();
                bulletsArr.splice(bulletIndex, 1);

                bulletElm.hitObstacles();
            }
        });

        if (bulletElm.positionY > 100 - bulletElm.height) {
            bulletElm.domElement.remove();
            bulletsArr.splice(bulletIndex, 1);
            console.log('bullet gone')
        }
    });
}, 10); 



