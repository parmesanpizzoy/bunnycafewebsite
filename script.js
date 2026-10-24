// Bunny Pink Cafe - random dessert picker (vanilla JavaScript)

const desserts = [
    {
        name: "Strawberry Cheesecake 🍓",
        img: "https://i.pinimg.com/1200x/ce/18/2e/ce182e0263bacdd3729f93d7b1c41442.jpg",
        imgAlt: "Creamy strawberry cheesecake with fresh strawberries and mint garnish on a white plate",
        desc: "Our signature cheesecake with a buttery biscuit base, topped with fresh strawberries and a drizzle of homemade strawberry sauce. The perfect balance of sweet and tangy flavors."
    },
    {
        name: "Chocolate Lava Cake 🍫",
        img: "https://i.pinimg.com/736x/24/f1/74/24f174777c64b612e88dc3b5f99204bf.jpg",
        imgAlt: "Warm chocolate lava cake with melting center, dusted with powdered sugar and served with vanilla ice cream",
        desc: "Indulge in this warm chocolate cake with a molten center that oozes out when you cut into it. Served with a scoop of vanilla bean ice cream for the ultimate chocolate experience."
    },
    {
        name: "Matcha Tiramisu 🍵",
        img: "https://i.pinimg.com/736x/cc/54/39/cc54399dec601b321fc643188ffea700.jpg",
        imgAlt: "Layers of matcha green tea mascarpone cream and ladyfinger biscuits in a glass dessert cup",
        desc: "A Japanese twist on the Italian classic. Layers of matcha-infused mascarpone cream and soft ladyfingers create a delicate balance of bitter and sweet flavors."
    },
    {
        name: "Red Velvet Cupcake 🧁",
        img: "https://i.pinimg.com/736x/71/af/91/71af91914a93f5c6e342ae47e22134bc.jpg",
        imgAlt: "Moist red velvet cupcake with swirl of cream cheese frosting and red velvet crumbles",
        desc: "Classic red velvet cupcake with our special cream cheese frosting. The perfect blend of cocoa and buttermilk makes this treat moist and delicious."
    },
    {
        name: "Mango Mousse 🥭",
        img: "https://i.pinimg.com/1200x/3e/fb/a5/3efba528c890a72c63c676f02fd56e79.jpg",
        imgAlt: "Light and airy mango mousse in a glass dessert cup with fresh mango cubes and mint leaf garnish",
        desc: "Light and refreshing mango mousse made with fresh mango puree. Topped with fresh mango cubes for an extra tropical flavor burst."
    }
];

const generateBtn = document.getElementById('generate-btn');
const againBtn = document.getElementById('again-btn');
const hint = document.getElementById('hint');
const dessertContainer = document.getElementById('dessert-container');
const dessertName = document.getElementById('dessert-name');
const dessertImg = document.getElementById('dessert-img');
const dessertDesc = document.getElementById('dessert-desc');

let lastIndex = -1;

// Pick a random dessert, never the same one twice in a row
function pickDessert() {
    let index;
    do {
        index = Math.floor(Math.random() * desserts.length);
    } while (index === lastIndex && desserts.length > 1);
    lastIndex = index;
    return desserts[index];
}

const dessertCard = dessertContainer.querySelector('.dessert-card');
const SWAP_MS = 300;
let busy = false;

// Preload the photo so the card never shows a half-loaded image
function preload(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = img.onerror = resolve; // continue even if the image fails
        img.src = src;
    });
}

function fillCard(dessert) {
    dessertName.textContent = dessert.name;
    dessertImg.src = dessert.img;
    dessertImg.alt = dessert.imgAlt;
    dessertDesc.textContent = dessert.desc;
}

async function showDessert() {
    if (busy) return; // ignore rapid double-clicks while animating
    busy = true;

    const dessert = pickDessert();

    // Little bounce on the bunny
    generateBtn.classList.remove('pop');
    void generateBtn.offsetWidth; // restart the animation
    generateBtn.classList.add('pop');
    hint.textContent = 'Tap again for another treat! 🎀';

    const firstTime = dessertContainer.hidden;

    if (firstTime) {
        // Prepare the card while invisible, then let it pop up smoothly
        await preload(dessert.img);
        fillCard(dessert);
        dessertContainer.classList.add('is-hidden');
        dessertContainer.hidden = false;
        void dessertContainer.offsetWidth; // make sure the start state is painted
        dessertContainer.classList.remove('is-hidden');
    } else {
        // Fade the old content out, swap it, fade the new content in
        dessertCard.classList.add('swapping');
        await Promise.all([
            preload(dessert.img),
            new Promise((resolve) => setTimeout(resolve, SWAP_MS))
        ]);
        fillCard(dessert);
        dessertCard.classList.remove('swapping');
    }

    // Bring the card into view on small screens
    dessertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => { busy = false; }, 350);
}

generateBtn.addEventListener('click', showDessert);
againBtn.addEventListener('click', showDessert);