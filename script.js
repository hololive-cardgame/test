document.addEventListener('DOMContentLoaded', function() {
    const cardContainer = document.getElementById('card-container');    //卡牌展示
    const filterForm = document.getElementById('filter-form');    //篩選
    const keywordSelect = document.getElementById('keyword');
    const typeSelect = document.getElementById('type');
    const attributeSelect = document.getElementById('attribute');
    const tagSelect = document.getElementById('tag');
    const setSelect = document.getElementById('set');
    // 彈窗
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
            populateSelectOptions(cardData);  // 填充所有篩選選單
        });

    // 動態填充所有篩選選單（關鍵字、類型、屬性、標籤、卡包）
    function populateSelectOptions(cards) {
        const names = new Set();
        const types = new Set();
        const attributes = new Set();
        const tags = new Set();
        const sets = new Set();

        cards.forEach(card => {
            names.add(card.name);
            types.add(card.type);
            attributes.add(card.attribute);
            tags.add(card.tag));
            sets.add(card.set);
        });

        // 填充關鍵字選單
        populateSelect(keywordSelect, Array.from(names));

        // 填充類型選單
        populateSelect(typeSelect, Array.from(types));

        // 填充屬性選單
        populateSelect(attributeSelect, Array.from(attributes));

        // 填充標籤選單
        populateSelect(featureSelect, Array.from(tags));

        // 填充卡包選單
        populateSelect(setSelect, Array.from(sets));
    }

    // 通用函數，將一個數組的選項填充到下拉選單中
    function populateSelect(selectElement, options) {
        selectElement.innerHTML = '<option value="">選擇...</option>';  // 清空現有選項
        options.forEach(optionValue => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue;
            selectElement.appendChild(option);
        });
    }

    // 篩選功能
    function filterCards() {
        let filtered = cardData;

        // 關鍵字篩選
        const keyword = keywordSelect.value.toLowerCase();
        if (keyword) {
            filtered = filtered.filter(card =>
                card.name.toLowerCase().includes(keyword) ||
                card.description.toLowerCase().includes(keyword)
            );
        }

        // 類型篩選
        const type = typeSelect.value;
        if (type) {
            filtered = filtered.filter(card => card.type === type);
        }

        // 屬性篩選
        const attribute = attributeSelect.value;
        if (attribute) {
            filtered = filtered.filter(card => card.attribute === attribute);
        }

        // 標籤篩選
        const tag = tagSelect.value;
        if (tag) {
            filtered = filtered.filter(card => card.tag === tag);
        }

        // 卡包篩選
        const set = setSelect.value;
        if (set) {
            filtered = filtered.filter(card => card.set === set);
        }

        filteredCards = filtered;
        renderCards(filteredCards);
    }

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

    // 監聽篩選條件的改變，並動態更新卡牌
    keywordSelect.addEventListener('change', filterCards);
    typeSelect.addEventListener('change', filterCards);
    attributeSelect.addEventListener('change', filterCards);
    tagSelect.addEventListener('change', filterCards);
    setSelect.addEventListener('change', filterCards);

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
