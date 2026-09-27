const score = localStorage.getItem('finalScore') || 0;
const loss = localStorage.getItem('finalLoss') || 0;

document.getElementById("endStats").textContent =
    `Score: ${score} — Customers lost: ${loss}`;