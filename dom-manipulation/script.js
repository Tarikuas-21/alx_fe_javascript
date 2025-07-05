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
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API
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
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.innerText = category;
        categoryFilter.appendChild(option);
    });
}

function filterByCategory(quotes, category) {
    return category === 'all' ? quotes : quotes.filter(quote => quote.category === category);
}

document.getElementById('newQuoteBtn').addEventListener('click', function() {
    const newQuoteText = prompt("Enter a new quote:");
    const newQuoteCategory = prompt("Enter the category for this quote:");
    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes();
        populateCategories();
        displayQuote();
        syncWithServer(); // Sync after adding new quote
    }
});

function fetchQuotesFromServer() {
    // Simulate fetching data from the server
    fetch(SERVER_URL)
        .then(response => response.json())
        .then(serverQuotes => {
            resolveConflicts(serverQuotes);
            notifyUser("Data synced with server.");
            saveQuotes(); // Update local storage
            displayQuote();
        })
        .catch(error => console.error('Error syncing with server:', error));
}
async function fetchServerQuotes() {
  // Simulated fetch from server
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  const serverQuotes = await response.json();

  // Convert to our quote format
  return serverQuotes.map(post => ({
    text: post.title,
    category: 'server'
  }));
}
setInterval(syncWithServer, 10000); // every 10 seconds

async function syncWithServer() {
  const serverQuotes = await fetchServerQuotes();
  resolveConflicts(serverQuotes);
}



function resolveConflicts(serverQuotes) {
    // Simple conflict resolution strategy
    serverQuotes.forEach(serverQuote => {
        const localQuote = quotes.find(q => q.text === serverQuote.title); // Assuming title as text
        if (!localQuote) {
            quotes.push({ text: serverQuote.title, category: "Imported" }); // Add new quotes from server
        }
        // Optionally, handle updates or conflicts here
    });
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
    setInterval(syncWithServer, 60000); // Fetch from server every minute
    window.addEventListener('beforeunload', function() {
        sessionStorage.setItem('lastViewedQuoteIndex', lastViewedQuoteIndex);
    });
});

function notifyUser(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    setTimeout(() => {
        notification.innerText = "";
    }, 5000);
}
