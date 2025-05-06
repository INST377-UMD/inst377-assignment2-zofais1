
async function fetchQuote() {
    
        const response = await fetch('https://api.quotable.io/random', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });
        
        const data = await response.json();
        const quoteContainer = document.getElementById('quote-container');
        quoteContainer.innerHTML = `
            <p>"${data.content}"</p>
            <p>- ${data.author}</p>
        `;
    
}

document.addEventListener('DOMContentLoaded', fetchQuote); 