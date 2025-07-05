let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do or do not. There is no try.", category: "Motivation" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categorySelect = document.getElementById('categorySelect');

function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  let filteredQuotes = quotes;

  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerText = 'No quotes available in this category.';
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerText = `"${quote.text}" - [${quote.category}]`;
}


function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert('Please enter both quote and category.');
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  updateCategoryOptions(category);

  textInput.value = '';
  categoryInput.value = '';
  alert('Quote added successfully!');
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

newQuoteBtn.addEventListener('click', showRandomQuote);

showRandomQuote();

