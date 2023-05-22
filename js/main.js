class Player {
    constructor() {
        this.width = 4;
        this.height = 8;
        this.positionX = 50 - this.width/2;
        this.positionY = 50;

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

    moveForward () {
        this.positionY++;
        this.domElement.style.bottom = this.positionY +"vh"
    }

    moveBackwards () {
        this.positionY--;
        this.domElement.style.bottom = this.positionY +"vh"
    }

    // shootObstacles () {
    // }
}


class Obstacle {
    constructor () {
        this.width = 2;
        this.height = 2;
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
 
// Commands general 
const player = new Player();
const obstacleArr = [];


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
}, 5000);





