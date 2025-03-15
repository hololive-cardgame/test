let cards = [];  // 存放卡牌資料的陣列
let currentPage = 1;
const cardsPerPage = 30;  // 每頁顯示 30 張卡牌
let currentCardIndex = 0;  // 當前顯示的卡牌索引

// 讀取卡牌資料
fetch('cards.json')
    .then(response => response.json())
    .then(data => {
        cards = data;
        displayCards();
    })
    .catch(error => {
        console.error('讀取卡牌資料失敗:', error);
    });

// 顯示卡牌
function displayCards() {
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const currentCards = cards.slice(startIndex, endIndex);

    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';

    currentCards.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.innerHTML = `
            <img src="${card.image}" alt="${card.name}" onclick="showCardDetail(${startIndex + index})">
            <h3>${card.name}</h3>
        `;
        cardContainer.appendChild(cardDiv);
    });

    displayPagination();
}

// 顯示分頁
function displayPagination() {
    const totalPages = Math.ceil(cards.length / cardsPerPage);
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.toggle('active', i === currentPage);
        pageButton.onclick = () => {
            currentPage = i;
            displayCards();
        };
        paginationDiv.appendChild(pageButton);
    }
}

// 顯示卡牌詳細資料
function showCardDetail(index) {
    currentCardIndex = index;

    const card = cards[currentCardIndex];
    document.getElementById('modal-image').src = card.image;
    document.getElementById('modal-name').textContent = card.name;
    document.getElementById('modal-description').textContent = card.description;

    document.getElementById('card-modal').style.display = 'block';
}

// 關閉彈窗
document.getElementById('close-modal').onclick = () => {
    document.getElementById('card-modal').style.display = 'none';
};

// 點擊空白處關閉彈窗
window.onclick = (event) => {
    if (event.target == document.getElementById('card-modal')) {
        document.getElementById('card-modal').style.display = 'none';
    }
};

// 切換到上一張卡牌
document.getElementById('prev-card').onclick = () => {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        showCardDetail(currentCardIndex);
    }
};

// 切換到下一張卡牌
document.getElementById('next-card').onclick = () => {
    if (currentCardIndex < cards.length - 1) {
        currentCardIndex++;
        showCardDetail(currentCardIndex);
    }
};
