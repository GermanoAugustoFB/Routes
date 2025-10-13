// Initialize map
const map = L.map(document.querySelector('.map')).setView([-19.75, -47.93], 7); // Brazil center

// OpenStreetMap Tile Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let routeLayer; // Layer to hold the route

// Form and map selection
const form = document.querySelector('.routeForm');
const mapDiv = document.querySelector('.map');

// Handle form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const start = document.getElementById('start').value.trim();
  const end = document.getElementById('end').value.trim();

  // Client-side validation
  if (!start || !end) {
    alert('Please enter both start and end addresses.');
    return;
  }

  // Show loading state
  const submitButton = form.querySelector('button');
  submitButton.disabled = true;
  submitButton.textContent = 'Calculating...';

  try {
    // Fetch route from backend
    const res = await fetch('http://localhost:3000/rota', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start, end })
    });

    if (!res.ok) {
      throw new Error('Failed to fetch route. Please try again.');
    }

    const data = await res.json();

    // Validate backend response
    if (!data.geometry || !data.geometry.coordinates) {
      throw new Error('Invalid route data received from server.');
    }

    // Convert coordinates to Leaflet format (lat, lng)
    const routeCoords = data.geometry.coordinates.map(coord => [coord[1], coord[0]]);

    // Remove blur effect
    mapDiv.style.filter = 'none';

    // Remove existing route layer if any
    if (routeLayer) {
      map.removeLayer(routeLayer);
    }

    // Add new route
    routeLayer = L.polyline(routeCoords, { color: '#0078ff', weight: 5 }).addTo(map);

    // Adjust map zoom to fit route
    map.fitBounds(routeLayer.getBounds());

    // Display route info (optional)
    alert(`Route calculated!\nDistance: ${data.distance} km\nDuration: ${data.duration} minutes`);

  } catch (error) {
    alert(error.message || 'Error fetching route. Please try again.');
    console.error(error);
  } finally {
    // Reset loading state
    submitButton.disabled = false;
    submitButton.textContent = 'Calcular Rota';
  }
});