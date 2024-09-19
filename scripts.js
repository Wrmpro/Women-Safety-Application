// Initialize map variable
let map;
let triangleLayer;
let rotateAngle = 0; // Variable to track map rotation angle

// Handle Login
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // For simplicity, using hardcoded check (Replace with real authentication)
    if (username === 'shashankwrm@gmail.com' && password === 'Shan@7$') {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('homePage').style.display = 'block';
        initializeMap();  // Initialize the map once logged in
    } else {
        alert('Invalid username or password.');
    }
});

// Handle Create Account
document.getElementById('createAccountForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;

    // For simplicity, show a success message (Replace with real account creation logic)
    alert('Account created successfully! You can now log in.');
    showLogin(); // Return to login page
});

// Show Create Account page
function showCreateAccount() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('createAccountPage').style.display = 'block';
}

// Show Login page
function showLogin() {
    document.getElementById('createAccountPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
}

// Initialize the map
function initializeMap() {
    map = L.map('map').setView([20.5937, 78.9629], 5); // Centered on India

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
    }).addTo(map);
}

// Function to create a triangle on the map
function createTriangle() {
    // Get points from user input
    const point1 = document.getElementById('point1').value.split(',').map(Number);
    const point2 = document.getElementById('point2').value.split(',').map(Number);
    const point3 = document.getElementById('point3').value.split(',').map(Number);

    if (point1.length === 2 && point2.length === 2 && point3.length === 2) {
        // Clear the existing triangle if any
        if (triangleLayer) {
            map.removeLayer(triangleLayer);
        }

        // Create a blue triangle on the map
        triangleLayer = L.polygon([point1, point2, point3], { color: 'blue' }).addTo(map);

        // Fit map bounds to the triangle
        map.fitBounds(triangleLayer.getBounds());

        // Calculate center point of the triangle
        const center = triangleLayer.getBounds().getCenter();
        
        // Prompt for the radius and draw the circle
        const radius = prompt("Enter the radius in kilometers for the circle around the center point:");

        if (radius && !isNaN(radius)) {
            drawCircle(center, parseFloat(radius));
        } else {
            alert('Please enter a valid radius.');
        }
    } else {
        alert('Please enter valid coordinates.');
    }
}

// Function to draw a circle on the map
function drawCircle(center, radius) {
    // Remove previous circle if any
    if (window.circleLayer) {
        map.removeLayer(window.circleLayer);
    }

    // Convert radius from kilometers to meters
    const radiusInMeters = radius * 1000;

    // Draw a circle around the center point
    window.circleLayer = L.circle(center, {
        color: 'green',
        fillColor: '#00FF00',
        fillOpacity: 0.2,
        radius: radiusInMeters
    }).addTo(map);
}

// Function to rotate the map by 120 degrees
function rotateMap() {
    rotateAngle += 120; // Increment the rotation angle by 120 degrees
    map.setBearing(rotateAngle); // Set the new bearing
}

// Function to ask about plans
function askPlans() {
    const plansResponse = document.getElementById('plans-response');
    plansResponse.innerHTML = `
        <p>Please choose your mode of transportation:</p>
        <select id="transportation" onchange="showPrecautions()">
            <option value="">Select</option>
            <option value="walk">Walking</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="bus">Bus</option>
            <option value="train">Train</option>
        </select>
        <div id="precautions"></div>
    `;
}

// Function to handle no plans
function noPlans() {
    document.getElementById('plans-response').innerHTML = '<p>Stay safe and take care!</p>';
}

// Function to show precautions based on transportation
function showPrecautions() {
    const transportation = document.getElementById('transportation').value;
    const precautionsDiv = document.getElementById('precautions');
    let precautions = '';

    switch (transportation) {
        case 'walk':
            precautions = '<p>Ensure you walk in well-lit areas and avoid isolated places.</p>';
            break;
        case 'car':
            precautions = '<p>Keep your car doors locked and avoid talking to strangers through windows.</p>';
            break;
        case 'bike':
            precautions = '<p>Always wear a helmet and avoid isolated routes.</p>';
            break;
        case 'bus':
            precautions = '<p>Sit near the driver and avoid empty buses, especially at night.</p>';
            break;
        case 'train':
            precautions = '<p>Stay in well-populated areas of the platform and avoid isolated compartments.</p>';
            break;
        default:
            precautions = '<p>Please select a mode of transportation.</p>';
    }

    precautionsDiv.innerHTML = precautions;
}
