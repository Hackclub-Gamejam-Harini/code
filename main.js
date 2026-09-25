let drink;
let cupContents = [];
let hasPoured = false;

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

const kettle = document.getElementById("water");
let kettleDragging = false;
let offsetX, offsetY;

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
    // TODO: Animation
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
            cupContents.push(newRasp);
        }
    });
});

const milk = document.getElementById("milk");
let milkDragging = false;

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
    cupContents.push('milk');
    console.log('Cup now has:', cupContents);
    // TODO: Animation
    //Animation
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
