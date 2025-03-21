// 取得所有的篩選選單元素
const keywordSelect = document.getElementById('keyword');
const typeSelect = document.getElementById('type');
const attributeSelect = document.getElementById('attribute');
const tagSelect = document.getElementById('tag');
const setSelect = document.getElementById('set');
const cardContainer = document.getElementById('card-container');
// 彈窗
const cardModal = document.getElementById('card-modal');
const closeModal = document.getElementById('close-modal');

let cardData = [];  // 儲存所有卡牌資料
let filteredCards = [];  // 篩選後的卡牌資料

// 使用 fetch 從 JSON 檔案載入資料
fetch('data/cards.json')
    .then(response => response.json())  // 解析 JSON 資料
    .then(data => {
        cardsData = data;
        generateFilterOptions();  // 生成篩選選項
        displayCards(cardsData);  // 顯示所有卡牌
    })
    .catch(error => {
        console.error('Error loading the card data:', error);
    });

// 根據 JSON 資料生成篩選選項
function generateFilterOptions() {
    const attributes = new Set();
    const types = new Set();
    const tags = new Set();  // 假設你的卡牌資料裡會有標籤
    const sets = new Set();  // 假設你的卡牌資料裡會有卡包

    cardsData.forEach(card => {
        attributes.add(card.attribute);
        types.add(card.type);
        if (card.tag) {
            card.tag.split(' / ').forEach(tag => tags.add(tag));
        }
        if (card.set) {
            sets.add(card.set);
        }
    });

    // 填充屬性選項
    attributes.forEach(attr => {
        const option = document.createElement('option');
        option.value = attr;
        option.textContent = attr;
        attributeSelect.appendChild(option);
    });

    // 填充類型選項
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
    });

    // 填充標籤選項
    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagSelect.appendChild(option);
    });

    // 填充卡包選項
    sets.forEach(set => {
        const option = document.createElement('option');
        option.value = set;
        option.textContent = set;
        setSelect.appendChild(option);
    });
}

// 根據篩選條件顯示卡牌
function filterCards() {
    const keyword = keywordSelect.value.toLowerCase();
    const type = typeSelect.value;
    const attribute = attributeSelect.value;
    const tag = tagSelect.value;
    const set = setSelect.value;

    const filteredCards = cardsData.filter(card => {
        const matchesKeyword = card.name.toLowerCase().includes(keyword);
        const matchesType = type ? card.type === type : true;
        const matchesAttribute = attribute ? card.attribute === attribute : true;
        const matchesTag = tag ? card.tag && card.tag.includes(tag) : true;
        const matchesSet = set ? card.set === set : true;

        return matchesKeyword && matchesType && matchesAttribute && matchesTag && matchesSet;
    });

    displayCards(filteredCards);
}

// 顯示卡牌
function displayCards(cards) {
    cardContainer.innerHTML = ''; // 清空現有卡牌

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.innerHTML = `
            <img src="${card.image}" alt="${card.name}">
            <h3>${card.name}</h3>
            <p>${card.skill}</p>
        `;

        // 點擊卡牌展示詳細資訊
        cardElement.addEventListener('click', () => {
            showCardModal(card);
        });

        cardContainer.appendChild(cardElement);
    });
}

    // 清除篩選條件
    clearFiltersButton.addEventListener('click', function() {
        keywordSelect.value = '';
        typeSelect.value = '';
        attributeSelect.value = '';
        tagSelect.value = '';
        setSelect.value = '';
        filteredCards = cardData;  // 恢復所有卡牌
        renderCards(filteredCards);
    });

// 顯示卡牌詳細資訊
function showCardModal(card) {
    const modal = document.getElementById('card-modal');
    document.getElementById('card-image').src = card.image;
    document.getElementById('card-name').textContent = card.name;
    document.getElementById('card-description').textContent = `Life: ${card.life}\nSkill: ${card.skill}\nSpecial Skill: ${card.spSkill}`;

    modal.style.display = 'block';
}

// 關閉彈窗
document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('card-modal').style.display = 'none';
});

// 初始時生成篩選選項並顯示所有卡牌
// (這部分會在 fetch 成功後自動執行)
document.getElementById('filter-form').addEventListener('change', filterCards);

// 監聽清除篩選條件按鈕
document.getElementById('clear-filters').addEventListener('click', () => {
    keywordSelect.value = '';
    typeSelect.value = '';
    attributeSelect.value = '';
    tagSelect.value = '';
    setSelect.value = '';
    filterCards();
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
