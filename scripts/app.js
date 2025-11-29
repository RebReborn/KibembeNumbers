// ----------------------------
// UI INTERACTION & HISTORY MANAGEMENT
// ----------------------------

// DOM Elements
let translateBtn, clearBtn, clearHistoryBtn, numberInput, resultDiv, resultSection, historyList, exampleItems;

// Translation history
let translationHistory = [];

/**
 * Initialize the application
 */
function initApp() {
    // Cache DOM elements
    translateBtn = document.getElementById('translate-btn');
    clearBtn = document.getElementById('clear-btn');
    clearHistoryBtn = document.getElementById('clear-history');
    numberInput = document.getElementById('number-input');
    resultDiv = document.getElementById('result');
    resultSection = document.getElementById('result-section');
    historyList = document.getElementById('history-list');
    exampleItems = document.querySelectorAll('.example-card');
    
    // Load translation history from localStorage
    loadTranslationHistory();
    
    // Set up event listeners
    setupEventListeners();
    
    // Focus on input when page loads
    numberInput.focus();
}

/**
 * Load translation history from localStorage
 */
function loadTranslationHistory() {
    const savedHistory = localStorage.getItem('kibembeTranslationHistory');
    translationHistory = savedHistory ? JSON.parse(savedHistory) : [];
    renderHistory();
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Translate button click handler
    translateBtn.addEventListener('click', performTranslation);

    // Clear button click handler
    clearBtn.addEventListener('click', clearInput);

    // Clear history button click handler
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Example items click handler
    exampleItems.forEach(item => {
        item.addEventListener('click', handleExampleClick);
    });

    // Allow translation on pressing Enter
    numberInput.addEventListener('keypress', handleKeyPress);
}

/**
 * Handle example item clicks
 * @param {Event} event - Click event
 */
function handleExampleClick(event) {
    const input = this.getAttribute('data-input');
    numberInput.value = input;
    performTranslation();
}

/**
 * Handle keyboard events
 * @param {Event} event - Key press event
 */
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        performTranslation();
    }
}

/**
 * Perform the translation
 */
function performTranslation() {
    const inputValue = numberInput.value.trim();
    
    if (!inputValue) {
        showResult('Please enter a number', 'error');
        return;
    }

    try {
        const translation = translateToKibembe(inputValue);
        showResult(translation, 'success');
        addToHistory(inputValue, translation);
    } catch (error) {
        showResult(`Error: ${error.message}`, 'error');
    }
}

/**
 * Show translation result with animation
 * @param {string} text - Result text
 * @param {string} type - Result type ('success' or 'error')
 */
function showResult(text, type) {
    resultDiv.textContent = text;
    
    // Update text color based on type
    if (type === 'success') {
        resultDiv.classList.remove('error');
    } else {
        resultDiv.classList.add('error');
    }
    
    // Add highlight animation
    highlightResultSection();
}

/**
 * Add highlight animation to result section
 */
function highlightResultSection() {
    resultSection.classList.remove('highlight');
    void resultSection.offsetWidth; // Trigger reflow
    resultSection.classList.add('highlight');
}

/**
 * Clear input field
 */
function clearInput() {
    numberInput.value = '';
    resultDiv.textContent = '';
    resultDiv.classList.remove('error');
    numberInput.focus();
}

/**
 * Add translation to history
 * @param {string} input - Input text
 * @param {string} output - Output translation
 */
function addToHistory(input, output) {
    // Check if this translation already exists in history
    const existingIndex = translationHistory.findIndex(
        item => item.input === input && item.output === output
    );
    
    // If it exists, remove it so we can add it to the top
    if (existingIndex !== -1) {
        translationHistory.splice(existingIndex, 1);
    }
    
    // Add new translation to the beginning of the history array
    translationHistory.unshift({
        input: input,
        output: output,
        timestamp: new Date().toLocaleString()
    });
    
    // Keep only the last 10 translations
    if (translationHistory.length > 10) {
        translationHistory = translationHistory.slice(0, 10);
    }
    
    // Save to localStorage and render
    saveTranslationHistory();
    renderHistory();
}

/**
 * Save translation history to localStorage
 */
function saveTranslationHistory() {
    localStorage.setItem('kibembeTranslationHistory', JSON.stringify(translationHistory));
}

/**
 * Render translation history
 */
function renderHistory() {
    if (translationHistory.length === 0) {
        historyList.innerHTML = `
            <div class="history-empty">
                No translations yet
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = translationHistory.map(item => `
        <div class="history-item">
            <div class="history-item-content">
                <span class="history-input">${item.input}</span>
                <span class="history-arrow">→</span>
                <span class="history-output">${item.output}</span>
            </div>
            <div class="history-timestamp">
                ${item.timestamp}
            </div>
        </div>
    `).join('');
}

/**
 * Clear translation history
 */
function clearHistory() {
    translationHistory = [];
    saveTranslationHistory();
    renderHistory();
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
