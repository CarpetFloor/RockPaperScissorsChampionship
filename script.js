let c = document.getElementById("canvas");
let r = c.getContext("2d");
let margin = 20;
let w = window.innerWidth - margin;
let h = window.innerHeight - margin;
c.width = w;
c.height = h;

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function distance(x1, y1, x2, y2) {
    let a = Math.abs(x1 - x2);
    let b = Math.abs(y1 - y2);
    
    return Math.sqrt((a * a) + (b * b));
}

// init data stuff
const TYPES = ["Rock", "Scissors", "Paper"];
let typeEmojis = new Map();
typeEmojis.set("Rock", "🌑");
typeEmojis.set("Scissors", "✂");
typeEmojis.set("Paper", "📃");
let typeImgs = new Map();
for(let i = 0; i < TYPES.length; i++) {
    let img = new Image();
    img.src = "Assets/" + TYPES[i] + ".png";
    typeImgs.set(TYPES[i], img);
}
const THING_SIZE = 16 * 1;
let things = [];
const SPEED = 2;
let imgRender = false;

// object for each rock, paper, or scissors
function Thing() {
    this.type = TYPES[random(0, 3)];
    this.img = typeImgs.get(this.type);
    this.emoji = typeEmojis.get(this.type);
    this.x = random(0 + (THING_SIZE / 2), w - (THING_SIZE / 2));
    this.y = random(0 + (THING_SIZE / 2), h - (THING_SIZE / 2));
}

// generate rocks, papers, and scissors
let count = 2;
count *= 3;
for(let i = 0; i < count; i++) {
    things.push(new Thing());
}

r.fillStyle = "black";
r.font = THING_SIZE + "px Arial";
function loop() {
    r.clearRect(0, 0, w, h);

    update();

    // render
    for(let thing of things) {
        if(imgRender) {
            r.drawImage(thing.img, thing.x - (THING_SIZE / 2), thing.y - (THING_SIZE / 2));
        }
        else {
            r.fillText(thing.emoji, thing.x - (THING_SIZE / 2), thing.y - (THING_SIZE / 2))
        }
    }
}
window.setInterval(loop, 1000 / 30);

function update() {
    for(let thing of things) {
        // randomly move a bit
        thing.x += random(0 - (SPEED / 2), (SPEED / 2));
        thing.y += random(0 - (SPEED / 2), (SPEED / 2));
        
        // find the thing current thing can beat
        let canBeatIndex = TYPES.indexOf(thing.type) + 1;
        if(canBeatIndex > (TYPES.length - 1)) {
            canBeatIndex = 0;
        }
        let canBeat = TYPES[canBeatIndex];


        // find closest thing current thing will beat
        // seek behavior
        let closest = null;
        let dist = 123454321;

        for(let check of things) {
            if(check.type == canBeat) {
                let distanceCheck = distance(thing.x, thing.y, check.x, check.y);

                if(distanceCheck < dist) {
                    closest = check;
                    dist = distanceCheck;
                }
            }
        }

        if(closest != null) {
            let SPEED_RANDOM = SPEED / 4;
            // actually move towards closest target
            
            if(closest.x > thing.x) {
                thing.x += SPEED;
            }
            else {
                thing.x -= SPEED;
            }
    
            if(closest.y > thing.y) {
                thing.y += SPEED;
            }
            else {
                thing.y -= SPEED;
            }
    
            // check for collision
            let distanceCheck = distance(thing.x, thing.y, closest.x, closest.y);
            if(distanceCheck < (THING_SIZE * 1)) {
                closest.type = thing.type;
                closest.img = typeImgs.get(closest.type);
                closest.emoji = typeEmojis.get(closest.type);
            }
        }

        // don't allow moving out of bounds

        if(thing.x < 0 + (THING_SIZE / 2)) {
            thing.x = 0 + (THING_SIZE);
        }
        if(thing.x > w - (THING_SIZE / 2)) {
            thing.x = w - (THING_SIZE);
        }

        if(thing.y < 0 + (THING_SIZE / 2)) {
            thing.y = 0 + (THING_SIZE);
        }
        if(thing.y > h - (THING_SIZE / 2)) {
            thing.y = h - (THING_SIZE);
        }
    }
}