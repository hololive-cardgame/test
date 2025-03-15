document.getElementById('filter-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // 篩選邏輯：根據表單選擇的條件來篩選卡牌
    const type = document.getElementById('type').value;
    
    // 根據 type 篩選資料
    const filteredCards = cards.filter(card => {
        return !type || card.type === type;
    });

    // 顯示篩選後的卡牌
    displayCards(filteredCards);
});
