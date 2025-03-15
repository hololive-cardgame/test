// 假設的卡牌資料（通常會從 API 或 JSON 讀取資料）
const cards = [
    { name: "卡牌A", description: "這是一張強力卡牌", image: "cardA.jpg" },
    { name: "卡牌B", description: "這是一張普通卡牌", image: "cardB.jpg" },
    { name: "卡牌C", description: "這是一張強力卡牌", image: "cardC.jpg" },
    { name: "卡牌D", description: "這是一張普通卡牌", image: "cardD.jpg" },
    { name: "卡牌E", description: "這是一張強力卡牌", image: "cardE.jpg" },
    { name: "卡牌F", description: "這是一張強力卡牌", image: "cardF.jpg" },
    { name: "卡牌G", description: "這是一張普通卡牌", image: "cardG.jpg" },
    { name: "卡牌H", description: "這是一張強力卡牌", image: "cardH.jpg" },
    { name: "卡牌I", description: "這是一張強力卡牌", image: "cardI.jpg" },
    { name: "卡牌J", description: "這是一張普通卡牌", image: "cardJ.jpg" },
    { name: "卡牌K", description: "這是一張強力卡牌", image: "cardK.jpg" },
    { name: "卡牌L", description: "這是一張普通卡牌", image: "cardL.jpg" },
    { name: "卡牌M", description: "這是一張強力卡牌", image: "cardM.jpg" },
    { name: "卡牌N", description: "這是一張普通卡牌", image: "cardN.jpg" },
    { name: "卡牌O", description: "這是一張強力卡牌", image: "cardO.jpg" },
    { name: "卡牌P", description: "這是一張強力卡牌", image: "cardP.jpg" },
    { name: "卡牌Q", description: "這是一張普通卡牌", image: "cardQ.jpg" },
    { name: "卡牌R", description: "這是一張強力卡牌", image: "cardR.jpg" },
    { name: "卡牌S", description: "這是一張強力卡牌", image: "cardS.jpg" },
    { name: "卡牌T", description: "這是一張普通卡牌", image: "cardT.jpg" },
    { name: "卡牌U", description: "這是一張強力卡牌", image: "cardU.jpg" },
    { name: "卡牌V", description: "這是一張普通卡牌", image: "cardV.jpg" },
    { name: "卡牌W", description: "這是一張強力卡牌", image: "cardW.jpg" },
    { name: "卡牌X", description: "這是一張普通卡牌", image: "cardX.jpg" },
    { name: "卡牌Y", description: "這是一張強力卡牌", image: "cardY.jpg" },
    { name: "卡牌Z", description: "這是一張普通卡牌", image: "cardZ.jpg" }
];

let currentPage = 1;
const cardsPerPage = 30; // 每頁顯示 30 張卡牌

function displayCards() {
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const currentCards = cards.slice(startIndex, endIndex);
    
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = ''; // 清空現有卡牌

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
    paginationDiv.innerHTML = ''; // 清空現有頁碼

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

// 初次載入頁面
displayCards();
