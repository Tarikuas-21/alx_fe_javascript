let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Life" },
    { text: "You only live once, but if you do it right, once is enough.", category: "Life" },
    { text: "The best way to predict your future is to create it.", category: "Motivation" }
];

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" - ${quote.category}`;
}

function createAddQuoteForm() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        document.getElementById("newQuoteText").value = '';
        document.getElementById("newQuoteCategory").value = '';
        alert("Quote added!");
    } else {
        alert("Please fill in both fields.");
    }
}
function updateCategoryOptions(newCategory) {
  const lowerCaseOptions = Array.from(categorySelect.options).map(opt => opt.value.toLowerCase());
  if (!lowerCaseOptions.includes(newCategory.toLowerCase())) {
    const option = document.createElement('option');
    option.value = newCategory;
    option.textContent = newCategory;
    categorySelect.appendChild(option);
  }
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
