// script.js
const cards = [
    { name: "卡牌A", description: "這是一張強力卡牌", image: "cardA.jpg" },
    { name: "卡牌B", description: "這是一張普通卡牌", image: "cardB.jpg" }
];

function searchCard() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const result = cards.filter(card => card.name.toLowerCase().includes(searchQuery));

    const resultDiv = document.getElementById('card-result');
    resultDiv.innerHTML = "";  // 清空上次查詢的結果

    if (result.length > 0) {
        result.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.innerHTML = `
                <h2>${card.name}</h2>
                <p>${card.description}</p>
                <img src="${card.image}" alt="${card.name}" width="200">
            `;
            resultDiv.appendChild(cardElement);
        });
    } else {
        resultDiv.innerHTML = "未找到相關卡牌";
    }
}
