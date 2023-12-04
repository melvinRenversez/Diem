canvas = document.querySelector('canvas');
ctx = canvas.getContext('2d');

const content = document.getElementById("content")
const info = document.getElementById("OkValue")
const infoShape = document.getElementById("shapeValue")
const infoVisibility = document.getElementById("visibilityValue")
const infoExplosion = document.getElementById("explosionValue")

const nomberStart = 20;
const nomberClone = 50;
const maxSize = 30;

var explosionForce = 20
var view = false
var OK = true;
var shape = "cube"

function Particle(x, y, speedX, speedY, size, color, type, intervalReproducrion, lifeTime) {

    this.x = x
    this.y = y
    this.speedX = speedX
    this.speedY = speedY
    this.size = size
    this.color = color
    this.lifeTime = lifeTime
    this.type = type
    this.intervalReproducrion = intervalReproducrion
    this.lastReproduction = new Date().getTime()

    this.draw = function(){
        if (shape == "cube"){
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size)
        }else{
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    this.move = function(){
        this.x += this.speedX
        this.y += this.speedY


        if (this.x < 0 || this.x + this.size > canvas.width){
            this.speedX *= -1
        }
        if (this.y < 0 || this.y + this.size > canvas.height) {
            this.speedY *= -1
        }


    }

    this.life = function(){
        if (this.type == "clone"){
            this.lifeTime -= 1
            if (this.lifeTime <= 0){
                const index = Particles.indexOf(this)
                if (index !== -1) {
                    Particles.splice(index, 1)
                    ctx.clearRect(this.x, this.y, this.size, this.size)
                }
            }
        }
    }

    this.reproduction = function(){
        if (OK == true){
            if ( this.type === "parent"){
                date = new Date().getTime()
                if (date - this.lastReproduction > this.intervalReproducrion){
                    this.lastReproduction = date
                    for (var i = 0; i < nomberClone; i++){
                        newParticle(this.x, this.y)
                    }
                }
            }
        }
    }
}


function newParticle(x, y){

    const speedX = (Math.random() - 0.5) * explosionForce
    const speedY = (Math.random() - 0.5) * explosionForce

    const lifetime = Math.random() * 100

    color = Math.random() < 0.5 ? "red" : "white"

    const size = Math.random() * maxSize

    Particles.push(new Particle(x, y, speedX, speedY, size, color, "clone", NaN, lifetime))

    
}


const Particles = []

for (var i = 0; i < nomberStart; i++){

    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height

    const speedX = (Math.random() - 0.5) * 10
    const speedY = (Math.random() - 0.5) * 10
    
    const intervalReproduction = 5000 * (Math.random() + 0.5)
    
    Particles.push(new Particle(x, y, speedX, speedY, 10, "blue", "parent", intervalReproduction))
    
}

function loop(){
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    for (var i = 0; i < Particles.length; i++){
        Particles[i].move()
        Particles[i].draw()
        Particles[i].reproduction()
        Particles[i].life()
    }
    
    if (view == true){
        content.style.visibility = "visible"
        t = new Date().getTime()
        if (t - affichageTime > 1000){
            view = false
            content.style.visibility = "hidden"
        }
    }

    requestAnimationFrame(loop);

}

var affichageTime;

document.addEventListener("keydown", function(e){

    affichageTime = new Date().getTime()
    console.log(e.keyCode)
    if (e.keyCode === 68){
        if (OK == true){
            OK = false
            info.innerHTML = "False"
            view = true
        }else{
            OK = true
            info.innerHTML = "True"
            view = true
        }
    }
    
    if (e.keyCode == 86){
        for (i = 0; i < Particles.length; i++) {
            if (Particles[i].type == "parent"){
                if (Particles[i].color == "blue"){
                    Particles[i].color = "black"
                    infoVisibility.innerHTML = "unvisible"
                    view = true
                }else{
                    Particles[i].color = "blue"
                    infoVisibility.innerHTML = "visible"
                    view = true
                }
            }
        }
    }
    
    if (e.keyCode === 83){
        if (shape == "cube"){
            shape = "circle"
            infoShape.innerHTML = "circle"
            view = true
        }else{
            shape = "cube"  
            infoShape.innerHTML = "cube"
            view = true
        }
    }

    if (e.keyCode === 38){
        explosionForce++
        view = true
        infoExplosion.innerHTML = explosionForce
    }

    if (e.keyCode === 40){
        explosionForce--
        view = true
        infoExplosion.innerHTML = explosionForce
    }
})

info.innerHTML = "True"
infoShape.innerHTML = "cube"
infoVisibility.innerHTML = "visible"
infoExplosion.innerHTML = explosionForce

loop()
console.log(Particles)