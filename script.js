let cards = [];  // 存放卡牌資料的陣列
let currentPage = 1;
const cardsPerPage = 30;  // 每頁顯示 30 張卡牌

// 使用 fetch 讀取 JSON 資料
fetch('cards.json')
    .then(response => response.json())  // 解析 JSON 資料
    .then(data => {
        cards = data;  // 將卡牌資料存到 cards 陣列中
        displayCards();  // 載入卡牌並顯示
    })
    .catch(error => {
        console.error('讀取卡牌資料失敗:', error);
    });

function displayCards() {
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const currentCards = cards.slice(startIndex, endIndex);
    
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';  // 清空現有卡牌

    currentCards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.innerHTML = `
            <img src="${card.image}" alt="${card.name}">
            <h3>${card.name}</h3>
            <p>${card.description}</p>
        `;
        cardContainer.appendChild(cardDiv);
    });

    displayPagination();
}

function displayPagination() {
    const totalPages = Math.ceil(cards.length / cardsPerPage);
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';  // 清空現有頁碼

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
