if (annyang) {
    const commands = {
        'hello': function() {
            alert('Hello World!');
        },
        'change the color to *color': function(color) {
            document.body.style.backgroundColor = color;
        },
        'navigate to *page': function(page) {
            const pageName = page.toLowerCase();
            if (pageName === 'home') {
                window.location.href = 'index.html';
            } else if (pageName === 'stocks') {
                window.location.href = 'stocks.html';
            } else if (pageName === 'dogs') {
                window.location.href = 'dogs.html';
            }
        }
    };

    annyang.addCommands(commands);

    document.getElementById('audio-on').addEventListener('click', function() {
        annyang.start();
    });

    document.getElementById('audio-off').addEventListener('click', function() {
        annyang.abort();
    });
} else {
    console.log('Annyang not supported in this browser');
} 