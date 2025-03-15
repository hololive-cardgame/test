// 讀取 JSON 卡牌資料
fetch('cards.json')
    .then(response => response.json())  // 解析 JSON
    .then(data => {
        // 一旦資料讀取完成，就呼叫 displayCards 顯示卡牌
        const cards = data;
        displayCards(cards);

        // 進行篩選
        document.getElementById('filter-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const type = document.getElementById('type').value;
            const filteredCards = cards.filter(card => {
                return !type || card.type === type;
            });
            displayCards(filteredCards);
        });
    })
    .catch(error => console.error('讀取卡牌資料失敗:', error));


// 顯示卡牌的函數
function displayCards(cards) {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';  // 清空之前顯示的卡牌

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('data-id', card.id);  // 保存卡牌 ID，稍後用於彈窗顯示

        const imgElement = document.createElement('img');
        imgElement.src = card.imageUrl;
        imgElement.alt = card.name;

        // 在卡牌上附加圖片
        cardElement.appendChild(imgElement);

        // 當卡牌被點擊時，顯示彈窗
        cardElement.addEventListener('click', () => openModal(card.id));

        // 把卡牌添加到容器中
        cardContainer.appendChild(cardElement);
    });
}

// 顯示彈窗，顯示卡牌詳細資料
function openModal(cardId) {
    const card = cards.find(card => card.id === cardId);
    const modal = document.getElementById('card-modal');
    const modalImage = document.getElementById('modal-image');
    const modalName = document.getElementById('modal-name');
    const modalDescription = document.getElementById('modal-description');

    // 更新彈窗內容
    modalImage.src = card.imageUrl;
    modalName.textContent = card.name;
    modalDescription.textContent = card.description;

    modal.style.display = 'block';
}

// 關閉彈窗
document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('card-modal').style.display = 'none';
});
