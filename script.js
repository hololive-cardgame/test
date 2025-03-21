// 取得所有的篩選選單元素
const clearFiltersBtn = document.getElementById('clear-filters');
const cardContainer = document.getElementById('card-container');
const keywordSelect = document.getElementById('keyword');
const typeSelect = document.getElementById('type');
const attributeSelect = document.getElementById('attribute');
const tagSelect = document.getElementById('tag');
const setSelect = document.getElementById('set');
const clearKeywordBtn = document.getElementById('clear-keyword');
// 彈窗
const cardModal = document.getElementById('card-modal');
const closeModal = document.getElementById('close-modal');

let filteredCards = [];  // 篩選後的卡牌資料

// 使用 fetch 從 JSON 檔案載入資料
fetch('cards.json')
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
    const keywords = new Set();  // 這是用來儲存卡牌名稱的集合

    cardsData.forEach(card => {
        attributes.add(card.attribute);
        types.add(card.type);
        if (card.tag) {
            card.tag.split(' / ').forEach(tag => tags.add(tag));
        }
        if (card.set) {
            sets.add(card.set);
        }
        // 填充關鍵字（卡牌名稱）
        keywords.add(card.name);
    });

    // 填充關鍵字選項
    keywords.forEach(keyword => {
        const option = document.createElement('option');
        option.value = keyword;
        option.textContent = keyword;
        keywordSelect.appendChild(option);  // 假設你有關鍵字選單的 DOM 元素
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
        // 處理 tag 的篩選
        const matchesTag = tag ? card.tag && card.tag.split(' / ').includes(tag) : true;
        const matchesSet = set ? card.set === set : true;

        return matchesKeyword && matchesType && matchesAttribute && matchesTag && matchesSet;
    });

    // 去重邏輯：基於卡牌的所有篩選條件去重
    const uniqueCards = removeDuplicates(filteredCards);
    
    displayCards(filteredCards);
}

// 去重函數，根據所有篩選條件（包括名稱、類型、屬性、tag、id等）進行去重
function removeDuplicates(cards) {
    const seen = new Set();
    const uniqueCards = [];

    cards.forEach(card => {
        // 使用一個唯一的識別符來檢查是否已經處理過該卡牌
        const uniqueKey = `${card.name}-${card.type}-${card.attribute}-${card.tag || ''}`;
        
        if (!seen.has(uniqueKey)) {
            seen.add(uniqueKey);
            uniqueCards.push(card);
        }
    });

    return uniqueCards;
}

// 顯示卡牌
function displayCards(cards) {
    cardContainer.innerHTML = ''; // 清空現有卡牌

    // 如果沒有卡牌，顯示提示訊息
    if (cards.length === 0) {
        cardContainer.innerHTML = '<p>沒有符合的卡牌。</p>';
        return;
    }

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.innerHTML = `
            <img src="${card.image}" alt="${card.name}">
        `;
        // 點擊卡牌展示詳細資訊
        cardElement.addEventListener('click', () => {
            showCardModal(card);
        });
        cardContainer.appendChild(cardElement);
    });
}

// 清除篩選條件
clearFiltersBtn.addEventListener('click', () => {
    // 檢查是否有任何篩選條件被選擇
    const isAnyFilterSelected = keywordSelect.value ||
                                typeSelect.value ||
                                attributeSelect.value ||
                                tagSelect.value ||
                                setSelect.value;
    if (isAnyFilterSelected) {
        // 如果有篩選條件被選擇，則清除所有篩選條件
        keywordSelect.value = '';
        typeSelect.value = '';
        attributeSelect.value = '';
        tagSelect.value = '';
        setSelect.value = '';
        clearKeywordBtn.style.display = 'none'; // 隱藏 "X"
    
        // 顯示所有卡牌
        displayCards(cardsData);
    }
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

// 監聽篩選條件變動，觸發篩選
keywordSelect.addEventListener('change', (e) => {
    // 顯示/隱藏 "X" 按鈕
    if (e.target.value !== '') {
        clearKeywordBtn.style.display = 'inline-block'; // 顯示 "X"
    } else {
        clearKeywordBtn.style.display = 'none'; // 隱藏 "X"
    }
    filterCards(); // 每次篩選條件改變後觸發篩選
});

// 清除關鍵字篩選
clearKeywordBtn.addEventListener('click', () => {
    keywordSelect.value = ''; // 清空選擇
    clearKeywordBtn.style.display = 'none'; // 隱藏 "X" 按鈕
    filterCards(); // 清除後重新篩選卡牌
});
typeSelect.addEventListener('change', filterCards);
attributeSelect.addEventListener('change', filterCards);
tagSelect.addEventListener('change', filterCards);
setSelect.addEventListener('change', filterCards);

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
