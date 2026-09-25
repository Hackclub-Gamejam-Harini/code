const kettle = document.getElementById("water");
let dragging = false;
let offsetX, offsetY;

kettle.addEventListener("pointerdown", (e) => {
    dragging = true;
    const rect = kettle.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    kettle.setPointerCapture(e.pointerId);
});

kettle.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const workspace = document.getElementById("workspace").getBoundingClientRect();
    kettle.style.left = `${e.clientX - workspace.left - offsetX}px`;
    kettle.style.top = `${e.clientY - workspace.top - offsetY}px`;
});

kettle.addEventListener("pointerup", () => dragging = false);

let angle = 0;

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") angle += 10;
    if (e.key === "ArrowLeft") angle -= 10;
    kettle.style.transform = `rotate(${angle}deg)`;

    if (Math.abs(angle) > 30) {
        startPour();
    } else {
        stopPour();
    }
});