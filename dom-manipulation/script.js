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
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
let lastViewedQuoteIndex = sessionStorage.getItem('lastViewedQuoteIndex') || 0;
let lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';

function displayQuote() {
    const filteredQuotes = filterByCategory(quotes, lastSelectedCategory);
    if (filteredQuotes.length === 0) {
        document.getElementById('quoteDisplay').innerText = "No quotes available.";
        return;
    }
    const quote = filteredQuotes[lastViewedQuoteIndex % filteredQuotes.length];
    document.getElementById('quoteDisplay').innerText = quote.text;
}

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function populateCategories() {
    const categories = new Set(quotes.map(quote => quote.category));
    const categoryFilter = document.getElementById('categoryFilter');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.innerText = category;
        categoryFilter.appendChild(option);
    });
}

function selectedCategory(quotes, category) {
    return category === 'all' ? quotes : quotes.filter(quote => quote.category === category);
}

document.getElementById('newQuoteBtn').addEventListener('click', function() {
    const newQuoteText = prompt("Enter a new quote:");
    const newQuoteCategory = prompt("Enter the category for this quote:");
    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes();
        populateCategories(); // Update categories
        displayQuote();
    }
});

document.getElementById('exportBtn').addEventListener('click', function() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories(); // Update categories
        displayQuote();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

function filterQuotes() {
    lastSelectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastSelectedCategory', lastSelectedCategory);
    displayQuote();
}

function loadLastViewedQuote() {
    populateCategories();
    document.getElementById('categoryFilter').value = lastSelectedCategory;
    displayQuote();
}

window.addEventListener('load', function() {
    loadLastViewedQuote();
    window.addEventListener('beforeunload', function() {
        sessionStorage.setItem('lastViewedQuoteIndex', lastViewedQuoteIndex);
    });
});
