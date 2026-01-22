const canvas = document.getElementById('canvas');
let zIndexCounter = 10;
let isDragging = false;
let currentCard = null;
let offsetX, offsetY;

const memories = [
    { image: 'pc-birthday-night.png' },
    { image: 'pc-charlotte-n-i.png' },
    { image: 'pc-gathering.png' },
    { image: 'pc-gianna-birthday.png' },
    { image: 'pc-halloween.PNG' },
    { image: 'pc-linhui-karaoke.png' },
    { image: 'pc-long-island-gianna.png' },
    { image: 'pc-matilda.png' },
    { image: 'pc-max-art.png' },
    { image: 'pc-moma-joseph.png' },
    { image: 'pc-siblings.png' },
    { image: 'pc-summer-at-werable.png' },
    { image: 'pc-upstate-with-gianna.png' },
    { image: 'PC-vietnam-with-girls.PNG' },
    { image: 'pc-thailand-coconut.png' }
];

function getRandomPosition() {
    const margin = 50;
    const cardWidth = 180;
    const x = margin + Math.random() * (window.innerWidth - cardWidth - margin * 2);
    const y = margin + Math.random() * (window.innerHeight - cardWidth - margin * 2);
    return { x, y };
}

function getRandomRotation() {
    return (Math.random() - 0.5) * 20; // -10 to +10 degrees
}

function createMemoryCard(memory, index) {
    const card = document.createElement('div');
    card.className = 'memory-card';
    
    const pos = getRandomPosition();
    const rotation = getRandomRotation();
    
    card.style.left = pos.x + 'px';
    card.style.top = pos.y + 'px';
    card.style.transform = `rotate(${rotation}deg)`;
    card.style.animationDelay = (index * 0.1) + 's';
    
    // Just the image, no polaroid wrapper
    card.innerHTML = `<img src="${memory.image}">`;
    
    card.addEventListener('mousedown', startDrag);
    card.addEventListener('touchstart', startDrag);
    
    return card;
}

function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    currentCard = e.currentTarget;
    
    currentCard.style.zIndex = ++zIndexCounter;
    currentCard.classList.add('dragging');
    
    const rect = currentCard.getBoundingClientRect();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
}

function drag(e) {
    if (!isDragging || !currentCard) return;
    e.preventDefault();
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - offsetX;
    const y = clientY - offsetY;
    
    const maxX = window.innerWidth - currentCard.offsetWidth;
    const maxY = window.innerHeight - currentCard.offsetHeight;
    
    currentCard.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
    currentCard.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
}

function stopDrag() {
    if (currentCard) {
        currentCard.classList.remove('dragging');
    }
    isDragging = false;
    currentCard = null;
    
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
}

function init() {
    memories.forEach((memory, index) => {
        const card = createMemoryCard(memory, index);
        canvas.appendChild(card);
    });
}

init();

document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
});