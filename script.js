document.addEventListener('DOMContentLoaded', function() {
    const cardContainer = document.getElementById('card-container');
    const filterForm = document.getElementById('filter-form');
    const cardModal = document.getElementById('card-modal');
    const closeModal = document.getElementById('close-modal');

    let cardData = [];  // 儲存所有卡牌資料
    let filteredCards = [];  // 篩選後的卡牌資料

    // 假設從本地文件載入 JSON 資料
    fetch('cards.json')
        .then(response => response.json())
        .then(data => {
            cardData = data;
            filteredCards = cardData;  // 初始時顯示所有卡牌
            renderCards(filteredCards);
        });

    // 渲染卡牌
    function renderCards(cards) {
        cardContainer.innerHTML = '';  // 清空容器
        cards.forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');
            cardDiv.innerHTML = `<img src="${card.image}" alt="${card.name}">`;
            cardDiv.addEventListener('click', () => showCardDetails(card));
            cardContainer.appendChild(cardDiv);
        });
    }

    // 顯示卡牌詳細資料
    function showCardDetails(card) {
        document.getElementById('card-name').textContent = card.name;
        document.getElementById('card-image').src = card.image;
        document.getElementById('card-description').textContent = card.description;
        cardModal.style.display = 'block';
    }

    // 關閉彈窗
    closeModal.addEventListener('click', () => {
        cardModal.style.display = 'none';
    });

    // 篩選功能
    filterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const filterType = document.getElementById('type').value;
        if (filterType) {
            filteredCards = cardData.filter(card => card.type === filterType);
        } else {
            filteredCards = cardData;
        }
        renderCards(filteredCards);
    });
});

let currentPage = 1;
const cardsPerPage = 10;

function renderPagination(cards) {
    const totalPages = Math.ceil(cards.length / cardsPerPage);
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    prevBtn.onclick = () => changePage(currentPage - 1, cards);
    nextBtn.onclick = () => changePage(currentPage + 1, cards);
}

function changePage(page, cards) {
    currentPage = page;
    renderCards(cards.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage));
    renderPagination(cards);
}
