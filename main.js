let drink;
let cupContents = [];
let hasPoured = false;
let score = 0;
let loss = 0;

const recipes = [
    { name: 'Black Coffee', need: ['water'] },
    { name: 'Milk Tea', need: ['water', 'milk'] },
    { name: 'Berry Milk', need: ['water', 'milk', 'raspberry'] },
];

const customers = [
    { animal: 'Frog', link: 'Assets/frog.png'},
    { animal: 'Satyr', link: 'Assets/satyr.png'}
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
    if (hasPoured) return;
    hasPoured = true;
    cupContents.push('water');
    console.log('Cup now has:', cupContents);
    cup.style.backgroundPosition = `-66px 0px`
}

document.addEventListener("keydown", (e) => {
    if (kettleDragging) {
        if (e.key === "ArrowRight") angle += 10;
        if (e.key === "ArrowLeft") angle -= 10;
        kettle.style.transform = `rotate(${angle}deg)`;
        if (Math.abs(angle) > 30 && isOverlapping(kettle, cup)) {
            startPour();
        }
        hasPoured = false;
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

// add raspberries
const raspBowl = document.getElementById("raspberryBowl");
const rasp = document.getElementById("raspberry");
let raspDraggable = false;

raspBowl.addEventListener("pointerdown", (e) => {
    const newRasp = rasp.cloneNode(true);
    newRasp.style.visibility = 'visible';
    document.getElementById("workspace").appendChild(newRasp);

    let attached = false;

    newRasp.addEventListener("pointerdown", (e) => {
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

// adding milk
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
    if (hasPoured) return;
    hasPoured = true;
    if (cup.style.backgroundPosition === `-66px 0px`) {
        cup.style.backgroundPosition = `-132px 0px`
        cupContents.push('milk');
        console.log('Cup now has:', cupContents);
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
            hasPoured = false;
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

const cream = document.getElementById("cream");
let creamDragging = false;
const creamHome = { left: cream.style.left || getComputedStyle(cream).left, top: cream.style.top || getComputedStyle(cream).top };

cream.addEventListener("pointerdown", (e) => {
    creamDragging = true;
    const rect = cream.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    cream.setPointerCapture(e.pointerId);
});

let creamAngle = 0;

function startPourCream() {
    if (hasPoured) return;
    hasPoured = true;
    if (cup.style.backgroundPosition === `-66px 0px`) {
        cup.style.backgroundPosition = `-0px -65px`
        cupContents.push('cream');
        console.log('Cup now has:', cupContents);
    } else {
        document.getElementById("message").innerText = `Something else needs to be in the cup`;
    }
}

document.addEventListener("keydown", (e) => {
    if (creamDragging) {
        if (e.key === "ArrowRight") creamAngle += 10;
        if (e.key === "ArrowLeft") creamAngle -= 10;
        cream.style.transform = `rotate(${creamAngle}deg)`;

        if (Math.abs(creamAngle) > 30 && isOverlapping(cream, cup)) {
            startPourCream();
            hasPoured = false;
        }
    }
});
cream.addEventListener("pointermove", (e) => {
    if (!creamDragging) return;
    const workspace = document.getElementById("workspace").getBoundingClientRect();
    cream.style.left = `${e.clientX - workspace.left - offsetX}px`;
    cream.style.top = `${e.clientY - workspace.top - offsetY}px`;
});

cream.addEventListener("pointerup", () => creamDragging = false)

// orders
let currentOrder = null;
let orderTimer = null;
let timeLeft = 0;

function newCustomer() {
    currentOrder = recipes[Math.floor(Math.random() * recipes.length)];
    cupContents = [];
    timeLeft = 20;

    cup.innerHTML = '';

    hasPoured = false;
    angle = 0;
    milkAngle = 0;
    kettle.style.transform = `rotate(0deg)`;
    milk.style.transform = `rotate(0deg)`;
    cream.style.transform = `rotate(0deg)`;

    document.getElementById("orderText").textContent =
        `Order: ${currentOrder.name} (${currentOrder.need.join(', ')})`;

    clearInterval(orderTimer);
    orderTimer = setInterval(() => {
        timeLeft -= 1;
        document.getElementById("timerText").textContent = `Time: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(orderTimer);
            document.getElementById("message").innerText = 'Times up';
            loss ++;
            newCustomer();
        }
    }, 1000);

    // resetting everything
    kettle.style.left = kettleHome.left;
    kettle.style.top = kettleHome.top;
    milk.style.left = milkHome.left;
    milk.style.top = milkHome.top;
    cream.style.left = creamHome.left;
    cream.style.top = creamHome.top;
    cup.style.backgroundPosition = `0px 0px`;
}

function serveDrink() {
    const made = [...cupContents].sort();
    const needed = [...currentOrder.need].sort();
    const isMatch = made.length === needed.length &&
        made.every((item, i) => item === needed[i]);

    clearInterval(orderTimer);

    if (isMatch) {
        document.getElementById("message").innerText = `Correct! Serving...`;
        score = score + (needed.length * 50);
        document.getElementById("score").innerText = `score: ` + score;
    } else {
        document.getElementById("message").innerText = 'Wrong order, made:' + made + 'needed:' + needed;
        loss ++;
    }

    setTimeout(newCustomer, 1000);
}

document.getElementById("serveBtn").addEventListener('click', serveDrink);

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