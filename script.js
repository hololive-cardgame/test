// 取得所有的篩選選單元素
const clearFiltersBtn = document.getElementById('clear-filters');  // 清除篩選條件按鈕
const cardContainer = document.getElementById('card-container');  // 卡牌展示區
const keywordSelect = document.getElementById('keyword');  // 關鍵字
const typeSelect = document.getElementById('type');  // 類型
const attributeSelect = document.getElementById('attribute');  // 屬性
const tagSelect = document.getElementById('tag');  // 標籤
const setSelect = document.getElementById('set');  // 卡包
const clearKeywordBtn = document.getElementById('clear-keyword');  // 關鍵字關閉按鈕

// 彈窗 先不看
const cardModal = document.getElementById('card-modal');
const closeModal = document.getElementById('close-modal');

// 篩選後的卡牌資料
let filteredCards = [];

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
    const keywords = new Set();
    const types = new Set();
    const attributes = new Set();
    const tags = new Set();
    const sets = {
        "起始牌組": new Set(),
        "補充包": new Set(),
        "其他": new Set()
    };
    
// 這是用來儲存卡牌名稱的集合
cardsData.forEach(card => {
    keywords.add(card.name);
    types.add(card.type);
    attributes.add(card.attribute);
    if (card.tag) {
        card.tag.split(' / ').forEach(tag => tags.add(tag));
    }
    if (card.set) {
        if (card.set.includes("起始牌組")) {
            sets["起始牌組"].add(card.set);
        }else if (card.set.includes("補充包")) {
            sets["補充包"].add(card.set);
        }else if (card.set === "配件" || card.set === "PR卡"){
            sets["其他"].add(card.set);
        }
    }
});

// 清空關鍵字下拉選單
keywordSelect.innerHTML = '';
    // 填充關鍵字選項
    keywords.forEach(keyword => {
        if (keyword) {
            const option = document.createElement('option');
            option.value = keyword;
            option.textContent = keyword;
            keywordSelect.appendChild(option);
        }
    });
    // 設定預設為空值（選單本身保持空）
    keywordSelect.value = "";

// 類型不用清空下拉選單
    // 填充類型選項
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
    });

// 清空屬性、多選框
    const attributeFilterContainer = document.getElementById('attribute-filters');
    attributeFilterContainer.innerHTML = '';
    attributes.forEach(attr => {
        if (attr) {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = attr;
            checkbox.name = 'attribute';
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(attr));
            attributeFilterContainer.appendChild(label);
        }
    });
    // 設定預設為空值（選單本身保持空）
    // attributeSelect.value = "";

// 清空標籤下拉選單
tagSelect.innerHTML = '';
    // 填充標籤選項
    tags.forEach(tag => {
        if (tag) {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagSelect.appendChild(option);
        }
    });
    // 設定預設為空值（選單本身保持空）
    tagSelect.value = "";

// 清空卡包下拉選單
setSelect.innerHTML = '';
    // 填充卡包選項
   Object.keys(sets).forEach(category => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = category; // 設置分組標籤
        
        // 添加該分類下的所有卡包選項
        sets[category].forEach(set => {
            const option = document.createElement('option');
            option.value = set;
            option.textContent = set;
            optgroup.appendChild(option);
        });

        // 把分組添加到 select 元素中
        setSelect.appendChild(optgroup);
    });
    // 設定預設為空值（選單本身保持空）
    setSelect.value = "";
}

// 根據篩選條件顯示卡牌
function filterCards() {
    const keyword = keywordSelect.value.toLowerCase();
    const type = typeSelect.value;
    const selectedAttributes = Array.from(document.querySelectorAll('input[name="attribute"]:checked')).map(checkbox => checkbox.value);
    const tag = tagSelect.value;
    const set = setSelect.value;

    const filteredCards = cardsData.filter(card => {
        const matchesKeyword = card.name.toLowerCase().includes(keyword);
        const matchesType = type ? card.type === type : true;
        const matchesAttribute = selectedAttributes.length === 0 || selectedAttributes.includes(card.attribute);
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
        const uniqueKey = `${card.name}-${card.type}-${card.attribute}-${card.tag}-${card.set}`;
        
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
                                Array.from(document.querySelectorAll('input[name="attribute"]')).some(checkbox => checkbox.checked);
                                tagSelect.value ||
                                setSelect.value;
    if (isAnyFilterSelected) {
        // 如果有篩選條件被選擇，則清除所有篩選條件
        keywordSelect.value = '';
        typeSelect.value = '';
        
        // 清除所有屬性篩選框的選擇
        const attributeCheckboxes = document.querySelectorAll('input[name="attribute"]');
        attributeCheckboxes.forEach(checkbox => {
            checkbox.checked = false;  // 取消選中所有 checkbox
        });
        
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
document.getElementById('attribute-filters').addEventListener('change', filterCards);
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
