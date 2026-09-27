let drink;
let cupContents = [];
let hasPouredTea = false;
let hasPouredCoffee = false;
let hasPouredMilk = false;
let score = 0;
let loss = 0;

const recipes = [
    { name: 'Black Coffee', need: ['coffee'] },
    { name: 'Milk Tea', need: ['tea', 'milk'] },
    { name: 'Lemon Tea', need: ['tea', 'milk', 'lemon'] },
    { name: 'Coffee with Marshmallows', need: ['coffee', 'marshmallow']},
    { name: 'Berry Tea', need: ['tea', 'milk', 'raspberry', 'marshmallow']}
];

const customers = [
    { animal: 'Frog', link: 'Assets/frog.png' },
    { animal: 'Satyr', link: 'Assets/satyr.png' }
]

function chooseCustomer() {
    const c = customers[Math.floor(Math.random() * customers.length)];
    document.getElementById("customer").src = c.link;
}

chooseCustomer();

// dragging/dropping

let draggedRasp = null;

function isOverlapping(a, b) {
    const rectA = a.getBoundingClientRect();
    const rectB = b.getBoundingClientRect();
    return !(
        rectA.right < rectB.left ||
        rectA.left > rectB.right ||
        rectA.bottom < rectB.top ||
        rectA.top > rectB.bottom
    );
}

function attachToCup(item) {
    const cupRect = cup.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    const relativeLeft = itemRect.left - cupRect.left;
    const relativeTop = itemRect.top - cupRect.top;

    item.style.width = `${itemRect.width}px`;
    item.style.height = `${itemRect.height}px`;

    cup.appendChild(item);
    item.style.position = 'absolute';
    item.style.left = `${relativeLeft}px`;
    item.style.top = `${relativeTop}px`;

}



//water
const kettle = document.getElementById("water");
let kettleDragging = false;
let offsetX, offsetY;
const kettleHome = { left: kettle.style.left || getComputedStyle(kettle).left, top: kettle.style.top || getComputedStyle(kettle).top };

kettle.addEventListener("pointerdown", (e) => {
    kettleDragging = true;
    const rect = kettle.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    kettle.setPointerCapture(e.pointerId);
});

kettle.addEventListener("pointermove", (e) => {
    if (!kettleDragging) return;
    const workspace = document.getElementById("workspace").getBoundingClientRect();
    kettle.style.left = `${e.clientX - workspace.left - offsetX}px`;
    kettle.style.top = `${e.clientY - workspace.top - offsetY}px`;
});

kettle.addEventListener("pointerup", () => kettleDragging = false);

let angle = 0;

function startPour() {
    if (hasPouredTea) return;
    hasPouredTea = true;
    cupContents.push('tea');
    console.log('Cup now has:', cupContents);
    cup.style.backgroundPosition = `-132px 0px`
}

document.addEventListener("keydown", (e) => {
    if (kettleDragging) {
        if (e.key === "ArrowRight") angle += 10;
        if (e.key === "ArrowLeft") angle -= 10;
        kettle.style.transform = `rotate(${angle}deg)`;
        if (Math.abs(angle) > 30 && isOverlapping(kettle, cup)) {
            startPour();
        }
    }
});


//move cup
const cup = document.getElementById("cup");
let cupDragging = false;

cup.addEventListener("pointerdown", (e) => {
    cupDragging = true;
    const rect = cup.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    cup.setPointerCapture(e.pointerId);
});

cup.addEventListener("pointermove", (e) => {
    if (!cupDragging) return;
    const workspace = document.getElementById("workspace").getBoundingClientRect();
    cup.style.left = `${e.clientX - workspace.left - offsetX}px`;
    cup.style.top = `${e.clientY - workspace.top - offsetY}px`;
});

cup.addEventListener("pointerup", () => cupDragging = false);

// add marshmallows
const marshmallowBowl = document.getElementById("mashmallowBowl");
const mashmallow = document.getElementById("mashmallow");
let mashDraggable = false;

marshmallowBowl.addEventListener("pointerdown", (e) => {
    const newMash = mashmallow.cloneNode(true);
    newMash.style.visibility = 'visible';
    document.getElementById("workspace").appendChild(newMash);

    let marshAttached = false;

    newMash.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        if (marshAttached) return;
        draggedMash = newMash;
        const rect = newMash.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        newMash.setPointerCapture(e.pointerId);
    });

    newMash.addEventListener("pointermove", (e) => {
        if (marshAttached || draggedMash !== newMash) return;
        const workspace = document.getElementById("workspace").getBoundingClientRect();
        newMash.style.left = `${e.clientX - workspace.left - offsetX}px`;
        newMash.style.top = `${e.clientY - workspace.top - offsetY}px`;
    });

    newMash.addEventListener("pointerup", () => {
        if (marshAttached) return;
        draggedMash = null;

        if (isOverlapping(newMash, cup)) {
            attachToCup(newMash);
            marshAttached = true;
            cupContents.push('marshmallow');
        }
    });
});

// Raspberries
const raspBowl = document.getElementById("raspberryBowl");
const rasp = document.getElementById("raspberry");
let raspDraggable = false;

raspBowl.addEventListener("pointerdown", (e) => {
    const newRasp = rasp.cloneNode(true);
    newRasp.style.visibility = 'visible';
    document.getElementById("workspace").appendChild(newRasp);

    let attached = false;

    newRasp.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        if (attached) return;
        draggedRasp = newRasp;
        const rect = newRasp.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        newRasp.setPointerCapture(e.pointerId);
    });

    newRasp.addEventListener("pointermove", (e) => {
        if (attached || draggedRasp !== newRasp) return;
        const workspace = document.getElementById("workspace").getBoundingClientRect();
        newRasp.style.left = `${e.clientX - workspace.left - offsetX}px`;
        newRasp.style.top = `${e.clientY - workspace.top - offsetY}px`;
    });

    newRasp.addEventListener("pointerup", () => {
        if (attached) return;
        draggedRasp = null;

        if (isOverlapping(newRasp, cup)) {
            attachToCup(newRasp);
            attached = true;
            cupContents.push('raspberry');
        }
    });
});

// lemon
const lemonBowl = document.getElementById("lemonBowl");
const lemon = document.getElementById("lemon");
let lemonDraggable = false;

lemonBowl.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    const newLemon = lemon.cloneNode(true);
    newLemon.style.visibility = 'visible';
    document.getElementById("workspace").appendChild(newLemon);

    let lemonAttached = false;

    newLemon.addEventListener("pointerdown", (e) => {
        if (lemonAttached) return;
        draggedLemon = newLemon;
        const rect = newLemon.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        newLemon.setPointerCapture(e.pointerId);
    });

    newLemon.addEventListener("pointermove", (e) => {
        if (lemonAttached || draggedLemon !== newLemon) return;
        const workspace = document.getElementById("workspace").getBoundingClientRect();
        newLemon.style.left = `${e.clientX - workspace.left - offsetX}px`;
        newLemon.style.top = `${e.clientY - workspace.top - offsetY}px`;
    });

    newLemon.addEventListener("pointerup", () => {
        if (lemonAttached) return;
        draggedLemon = null;

        if (isOverlapping(newLemon, cup)) {
            attachToCup(newLemon);
            lemonAttached = true;
            cupContents.push('lemon');
        }
    });
});

// adding coffee
const coffee = document.getElementById("coffeePot");
let coffeeDragging = false;
const coffeeHome = { left: coffee.style.left || getComputedStyle(coffee).left, top: coffee.style.top || getComputedStyle(coffee).top };

coffee.addEventListener("pointerdown", (e) => {
    coffeeDragging = true;
    const rect = coffee.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    coffee.setPointerCapture(e.pointerId);
});

let coffeeAngle = 0;

function startPourCoffee() {
    if (hasPouredCoffee) return;
    hasPouredCoffee = true;
    cup.style.backgroundPosition = `-66px 0px`
    cupContents.push('coffee');
    console.log('Cup now has:', cupContents);
}


document.addEventListener("keydown", (e) => {
    if (coffeeDragging) {
        if (e.key === "ArrowRight") coffeeAngle += 10;
        if (e.key === "ArrowLeft") coffeeAngle -= 10;
        coffee.style.transform = `rotate(${coffeeAngle}deg)`;

        if (Math.abs(coffeeAngle) > 30 && isOverlapping(coffee, cup)) {
            startPourCoffee();
        }
    }
});

coffee.addEventListener("pointermove", (e) => {
    if (!coffeeDragging) return;
    const workspace = document.getElementById("workspace").getBoundingClientRect();
    coffee.style.left = `${e.clientX - workspace.left - offsetX}px`;
    coffee.style.top = `${e.clientY - workspace.top - offsetY}px`;
});

coffee.addEventListener("pointerup", () => coffeeDragging = false)

const milk = document.getElementById("milk");
let milkDragging = false;
const milkHome = { left: milk.style.left || getComputedStyle(milk).left, top: milk.style.top || getComputedStyle(milk).top };

milk.addEventListener("pointerdown", (e) => {
    milkDragging = true;
    const rect = milk.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    milk.setPointerCapture(e.pointerId);
});

let milkAngle = 0;

function startPourMilk() {
    if (hasPouredMilk) return;
    if (cup.style.backgroundPosition === `-132px 0px`) {
        cup.style.backgroundPosition = `0px -66px`
        cupContents.push('milk');
        console.log('Cup now has:', cupContents);
        hasPouredMilk = true;
    } else {
        document.getElementById("message").innerText = `Something else needs to be in the cup`;
    }
}

document.addEventListener("keydown", (e) => {
    if (milkDragging) {
        if (e.key === "ArrowRight") milkAngle += 10;
        if (e.key === "ArrowLeft") milkAngle -= 10;
        milk.style.transform = `rotate(${milkAngle}deg)`;

        if (Math.abs(milkAngle) > 30 && isOverlapping(milk, cup)) {
            startPourMilk();
        }
    }
});

milk.addEventListener("pointermove", (e) => {
    if (!milkDragging) return;
    const workspace = document.getElementById("workspace").getBoundingClientRect();
    milk.style.left = `${e.clientX - workspace.left - offsetX}px`;
    milk.style.top = `${e.clientY - workspace.top - offsetY}px`;
});

milk.addEventListener("pointerup", () => milkDragging = false)

// orders
let currentOrder = null;
let orderTimer = null;
let timeLeft = 0;

function newCustomer() {
    currentOrder = recipes[Math.floor(Math.random() * recipes.length)];
    cupContents = [];
    timeLeft = 25;

    cup.innerHTML = '';

    hasPouredTea = false;
    hasPouredMilk = false;
    hasPouredCoffee = false;
    angle = 0;
    milkAngle = 0;
    kettle.style.transform = `rotate(0deg)`;
    milk.style.transform = `rotate(0deg)`;
    coffee.style.transform = `rotate(0deg)`;

    document.getElementById("orderText").textContent = currentOrder.name;
    document.getElementById("ingredientsText").textContent = currentOrder.need;

    clearInterval(orderTimer);
    orderTimer = setInterval(() => {
        timeLeft -= 1;
        document.getElementById("timerText").textContent = `Time: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(orderTimer);
            document.getElementById("message").innerText = 'Times up';
            loss++;
            if (loss > 3) {
                clearInterval(orderTimer);
                localStorage.setItem('finalScore', score);
                localStorage.setItem('finalLoss', loss);
                window.location.href = "end.html";
            }
            newCustomer();
        }
    }, 1000);

    // resetting everything
    kettle.style.left = kettleHome.left;
    kettle.style.top = kettleHome.top;
    milk.style.left = milkHome.left;
    milk.style.top = milkHome.top;
    cup.style.backgroundPosition = `0px 0px`;
    coffee.style.left = coffeeHome.left;
    coffee.style.top = coffeeHome.top;
}

function serveDrink() {
    const made = [...cupContents];
    const needed = [...currentOrder.need];
    const isMatch = made.length === needed.length &&
        made.every((item, i) => item === needed[i]);

    clearInterval(orderTimer);

    if (isMatch) {
        document.getElementById("message").innerText = `Correct! Serving...`;
        score = score + (needed.length * 50);
        document.getElementById("score").innerText = `score: ` + score;
    } else {
        document.getElementById("message").innerText = 'Wrong order, needed:' + needed;
        loss++;
        if (loss > 3) {
            clearInterval(orderTimer);
            localStorage.setItem('finalScore', score);
            localStorage.setItem('finalLoss', loss);
            window.location.href = "end.html";
        }
    }

    setTimeout(newCustomer, 1000);
}

document.getElementById("serveBtn").addEventListener('click', () => {
    serveDrink();
});

newCustomer();

// audio
const bgMusic = document.getElementById('bgMusic');
const muteBtn = document.getElementById('musicBtn');

muteBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
    } else {
        bgMusic.pause();
    }
});