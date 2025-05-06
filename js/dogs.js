async function fetchDogImages() {
    try {
        const images = [];
        for (let i = 0; i < 10; i++) {
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await response.json();
            images.push(data.message);
        }
        return images;
    } catch (error) {
        console.error('Error fetching dog images:', error);
        return [];
    }
}

async function fetchDogBreeds() {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/list/all');
        const data = await response.json();
        return Object.keys(data.message);
    } catch (error) {
        console.error('Error fetching dog breeds:', error);
        return [];
    }
}

async function fetchBreedInfo(breed) {
    try {
        const response = await fetch(`https://api.api-ninjas.com/v1/dogs?name=${breed}`, {
            headers: {
                'X-Api-Key': 'YOUR_API_NINJAS_KEY'
            }
        });
        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error('Error fetching breed info:', error);
        return null;
    }
}

function createBreedButtons(breeds) {
    const container = document.getElementById('breed-buttons');
    container.innerHTML = '';

    breeds.forEach(breed => {
        const button = document.createElement('button');
        button.className = 'custom-button';
        button.textContent = breed;
        button.addEventListener('click', () => loadBreedInfo(breed));
        container.appendChild(button);
    });
}

async function loadBreedInfo(breed) {
    const info = await fetchBreedInfo(breed);
    const container = document.getElementById('breed-info');
    
    if (info) {
        container.style.display = 'block';
        document.getElementById('breed-name').textContent = info.name;
        document.getElementById('breed-description').textContent = info.description || 'No description available';
        document.getElementById('breed-life-span').textContent = `${info.min_life_expectancy} - ${info.max_life_expectancy} years`;
    } else {
        container.style.display = 'block';
        document.getElementById('breed-name').textContent = breed;
        document.getElementById('breed-description').textContent = 'Information not available';
        document.getElementById('breed-life-span').textContent = 'N/A';
    }
}

async function initializeCarousel() {
    const images = await fetchDogImages();
    const slider = document.getElementById('slider');
    
    images.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = 'Random dog';
        slider.appendChild(img);
    });

    const mySlider = new SimpleSlider({
        container: slider,
        transitionTime: 1,
        delay: 3
    });
}

if (annyang) {
    annyang.addCommands({
        'load dog breed *breed': function(breed) {
            loadBreedInfo(breed);
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await initializeCarousel();
    const breeds = await fetchDogBreeds();
    createBreedButtons(breeds);
}); 