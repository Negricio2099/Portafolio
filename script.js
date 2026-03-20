let currentWindow = null;
let offsetX = 0;
let offsetY = 0;
let zIndexCounter = 100;
let videoHistory = [];
let currentVideoIndex = -1;

/* =========================
   🪟 VENTANAS
========================= */

function openWindow(id) {
    const win = document.getElementById(id);
    win.style.display = "block";
    win.style.zIndex = ++zIndexCounter;

    if (id === "explorer") {
        currentPath = ["root"]; // reinicia navegación
        renderExplorer();
    }

    addTaskItem(id, id.toUpperCase());
}

function closeWindow(id) {
    const win = document.getElementById(id);
    win.style.display = "none";

    removeTaskItem(id);

    if (id === "player") {
        document.getElementById("video-frame").src = "";
    }
}

/* =========================
   🧩 TASKBAR
========================= */

function addTaskItem(id, name) {
    const container = document.getElementById("task-icons");

    if (document.getElementById("task-" + id)) return;

    const item = document.createElement("div");
    item.className = "task-item";
    item.id = "task-" + id;
    item.textContent = name;

    item.onclick = () => openWindow(id);

    container.appendChild(item);
}

function removeTaskItem(id) {
    const task = document.getElementById("task-" + id);
    if (task) task.remove();
}

/* =========================
   🌐 LINKS / MEDIA
========================= */

function openProject(url) {
    window.open(url, "_blank");
}

function openImage(src) {
    const viewer = document.getElementById("viewer");
    const content = document.getElementById("viewer-content");

    content.innerHTML = `<img src="${src}">`;

    viewer.style.display = "block";
    viewer.style.zIndex = ++zIndexCounter;

    addTaskItem("viewer", "VISOR");
}

function openVideo(id) {
    const player = document.getElementById("player");
    const frame = document.getElementById("video-frame");

    if (!frame) return;

    // cortar historial si vienes de atrás
    if (currentVideoIndex < videoHistory.length - 1) {
        videoHistory = videoHistory.slice(0, currentVideoIndex + 1);
    }

    videoHistory.push(id);
    currentVideoIndex++;

    frame.src = `https://www.youtube.com/embed/${id}?autoplay=1`;

    player.style.display = "block";
    player.style.zIndex = ++zIndexCounter;

    addTaskItem("player", "PLAYER");
}
/* =========================
   🖱️ DRAG (con límites)
========================= */

function dragStart(e, element) {
    currentWindow = element;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;

    element.style.zIndex = ++zIndexCounter;

    document.onmousemove = dragMove;
    document.onmouseup = dragEnd;
}

function dragMove(e) {
    if (!currentWindow) return;

    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    // límites de pantalla
    x = Math.max(0, Math.min(window.innerWidth - 320, x));
    y = Math.max(0, Math.min(window.innerHeight - 100, y));

    currentWindow.style.left = x + "px";
    currentWindow.style.top = y + "px";
}

function dragEnd() {
    currentWindow = null;
    document.onmousemove = null;
}

/* =========================
   🕒 RELOJ + FECHA
========================= */

function updateClock() {
    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString();

    document.getElementById("date").textContent =
        now.toLocaleDateString();
}

setInterval(updateClock, 1000);
updateClock();

/* =========================
   🟢 MENÚ INICIO
========================= */

function toggleStart() {
    const menu = document.getElementById("start-menu");
    menu.style.display =
        menu.style.display === "block" ? "none" : "block";
}

// cerrar menú al hacer click fuera
document.addEventListener("click", (e) => {
    const menu = document.getElementById("start-menu");
    const btn = document.querySelector(".start-btn");

    if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.style.display = "none";
    }
});

/* =========================
   📁 SISTEMA DE ARCHIVOS
========================= */

const fileSystem = {
    root: {
        "Multimedia": {
            "reel.mp4": { type: "video", src: "dQw4w9WgXcQ" },
            "preview.png": { type: "image", src: "assets/img/proyecto1.jpg" }
        },
        "Videos": {
            "video1.mp4": { type: "video", src: "dQw4w9WgXcQ" }
        },
        "Fotografías": {
            "Flores.jpg": { type: "image", src: "assets/img/DSC_0084.jpg" },
            "Ojos.jpg": { type: "image", src: "assets/img/Ojiito.jpg" },
            "Figura Blasphemous.jpg": { type: "image", src: "assets/img/Penitente.jpg" },
            "persona Enojada.jpg": { type: "image", src: "assets/img/Enojo.jpg" },
            "Cosplay Berserk.jpg": { type: "image", src: "assets/img/DSC_0027.JPG" },
            "Figura Hollow Knight.jpg": { type: "image", src: "assets/img/la cuarta traicion.jpg" },
        },
        "Diseño": {
            "Diseño Caballero Deltarune.jpg": { type: "image", src: "assets/img/Exportado2.png" },
            "Diseño Berserk.jpg": { type: "image", src: "assets/img/Panel Manga Berserk.png" },
            "Diseño carta de tarot.jpg": { type: "image", src: "assets/img/LOS AMANTES IV.png" },
        },
        "Ilustraciones": {
            "Ilustración Mecha.jpg": { type: "image", src: "assets/img/Ilustración definitiva.jpg" },
            "Personaje Kiki.jpg": { type: "image", src: "assets/img/SOLO KIKI.jpg" },
            "Fanart Silksong.jpg": { type: "image", src: "assets/img/Hornet nd the moorwing.jpg" },
            "Pixelart Sukuna.jpg": { type: "image", src: "assets/img/SukunA final.png" },
        }
    }
};

let currentPath = ["root"];

function getCurrentFolder() {
    let folder = fileSystem;

    for (let p of currentPath) {
        folder = folder[p];
    }

    return folder;
}

/* =========================
   📂 EXPLORADOR
========================= */

function renderExplorer() {
    const container = document.getElementById("explorer-content");
    const pathDisplay = document.getElementById("path");

    container.innerHTML = "";
    pathDisplay.textContent = currentPath.join(" / ");

    const folder = getCurrentFolder();

    for (let name in folder) {
        const item = folder[name];
        const div = document.createElement("div");

        div.className = "file";

        if (typeof item === "object" && !item.type) {
            div.textContent = "📁 " + name;
            div.ondblclick = () => openFolder(name);
        } else {
            div.textContent = "📄 " + name;
            div.ondblclick = () => openFile(item);
        }

        container.appendChild(div);
    }
}

function openFolder(name) {
    currentPath.push(name);
    renderExplorer();
}

function goBack() {
    if (currentPath.length > 1) {
        currentPath.pop();
        renderExplorer();
    }
}

function openFile(file) {
    if (file.type === "image") openImage(file.src);
    if (file.type === "video") openVideo(file.src);
    if (file.type === "link") openProject(file.src);
}
function prevVideo() {
    if (currentVideoIndex > 0) {
        currentVideoIndex--;

        const id = videoHistory[currentVideoIndex];
        document.getElementById("video-frame").src =
            `https://www.youtube.com/embed/=Zho3MPLGUfc`;
    }
}

function nextVideo() {
    if (currentVideoIndex < videoHistory.length - 1) {
        currentVideoIndex++;

        const id = videoHistory[currentVideoIndex];
        document.getElementById("video-frame").src =
            `https://www.youtube.com/embed/=CYzXToS1S5Q`;
    }
}
function centerWindow(id) {
    const win = document.getElementById(id);

    win.style.left = (window.innerWidth - win.offsetWidth) / 2 + "px";
    win.style.top = (window.innerHeight - win.offsetHeight) / 2 + "px";
}