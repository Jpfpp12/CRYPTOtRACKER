const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

let coinsData = [];

function fetchWithThen() {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      coinsData = data;
      renderTable(coinsData);
    })
    .catch(err => console.error("Error fetching with .then:", err));
}

fetchWithThen();

function renderTable(data) {
  const tbody = document.querySelector("#cryptoTable tbody");
  let rows = "";

  data.forEach(coin => {
    const percentChange = coin.price_change_percentage_24h !== null && coin.price_change_percentage_24h !== undefined
      ? `${coin.price_change_percentage_24h.toFixed(2)}%`
      : "N/A";
    rows += `
      <tr>
        <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24"/></td>
        <td>${coin.name}</td>
        <td>${coin.symbol.toUpperCase()}</td>
        <td>$${coin.current_price.toLocaleString()}</td>
        <td>${coin.total_volume.toLocaleString()}</td>
        <td>${percentChange}</td>
        <td>$${coin.market_cap.toLocaleString()}</td>
      </tr>
    `;
  });
  tbody.innerHTML = rows;
}

function searchCoins() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const filteredData = coinsData.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm) ||
    coin.symbol.toLowerCase().includes(searchTerm)
  );
  renderTable(filteredData);
}

function sortByMarketCap() {
  const sorted = [...coinsData].sort((a, b) => b.market_cap - a.market_cap);
  renderTable(sorted);
}

function sortByPercentageChange() {
  const sorted = [...coinsData].sort((a, b) => {
    const aVal = a.price_change_percentage_24h ?? -Infinity;
    const bVal = b.price_change_percentage_24h ?? -Infinity;
    return bVal - aVal;
  });
  renderTable(sorted);
}

// Attach event listeners after DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  document.querySelector('button[onclick="sortByMarketCap()"]').addEventListener("click", sortByMarketCap);
  document.querySelector('button[onclick="sortByPercentageChange()"]').addEventListener("click", sortByPercentageChange);
  document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchCoins();
  });
});
