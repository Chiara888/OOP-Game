class Player {
    constructor() {
        this.width = 8;
        this.height = 10;
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

    shootObstacles () {
    }
}

const player = new Player();
player.createDomElement();