// Initialize map
const map = L.map(document.querySelector('.map')).setView([-19.75, -47.93], 7); // Brazil center

// OpenStreetMap Tile Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let routeLayer; // Layer to hold the route
let points = []; // Array of LatLng points
let markers = []; // Array of markers
let vehicleMarker; // Marker for the moving vehicle

// Handle map clicks to add points
map.on('click', (e) => {
  const marker = L.marker(e.latlng).addTo(map);
  markers.push(marker);
  points.push(e.latlng);
});

// Function to fetch route from OSRM
async function getRoute(startLat, startLng, endLat, endLng) {
  const url = `http://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.code === 'Ok') {
      return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]); // Converte pra [lat, lng] pro Leaflet
    } else {
      throw new Error('Erro na rota: ' + data.message);
    }
  } catch (error) {
    console.error('Erro ao buscar rota:', error);
    return [];
  }
}

// Function to fetch distance matrix from OSRM
async function getDistanceMatrix(latlngs) {
  const coords = latlngs.map(p => `${p.lng},${p.lat}`).join(';');
  const url = `http://router.project-osrm.org/table/v1/driving/${coords}?annotations=distance`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.code === 'Ok') {
      return data.distances; // Matriz de distâncias em metros
    } else {
      throw new Error('Erro na matriz de distâncias: ' + data.message);
    }
  } catch (error) {
    console.error('Erro ao buscar matriz:', error);
    return null;
  }
}

// Compute button
document.getElementById('compute').addEventListener('click', async () => {
  if (points.length < 2) {
    alert('Adicione pelo menos 2 pontos clicando no mapa.');
    return;
  }

  const computeButton = document.getElementById('compute');
  computeButton.disabled = true;
  computeButton.textContent = 'Calculando...';

  try {
    // Fetch real distance matrix from OSRM
    const distMatrix = await getDistanceMatrix(points);
    if (!distMatrix) throw new Error('Falha ao obter matriz de distâncias.');

    // Convert distances from meters to kilometers
    const n = points.length;
    const dist = distMatrix.map(row => row.map(d => d / 1000)); // Converte pra km

    // ACO for open TSP
    function aco_tsp(dist, n_ants = 10, n_iterations = 50, alpha = 1, beta = 5, evaporation = 0.5, q = 100) {
      const n = dist.length;
      const pheromone = Array.from({ length: n }, () => Array(n).fill(1 / n));
      let best_path = null;
      let best_length = Infinity;

      for (let iter = 0; iter < n_iterations; iter++) {
        const paths = [];
        const path_lengths = [];
        for (let ant = 0; ant < n_ants; ant++) {
          const visited = Array(n).fill(false);
          let current = 0; // Start from first point
          visited[current] = true;
          const path = [current];
          let length = 0;

          for (let step = 0; step < n - 1; step++) {
            const probs = [];
            let total_prob = 0;
            for (let next = 0; next < n; next++) {
              if (!visited[next]) {
                const p = Math.pow(pheromone[current][next], alpha) * Math.pow(1 / (dist[current][next] + 1e-10), beta);
                probs.push({ city: next, p });
                total_prob += p;
              }
            }

            let r = Math.random() * total_prob;
            let cum = 0;
            let next_city = -1;
            for (const item of probs) {
              cum += item.p;
              if (r <= cum) {
                next_city = item.city;
                break;
              }
            }

            if (next_city === -1) next_city = probs[0].city;

            path.push(next_city);
            visited[next_city] = true;
            length += dist[current][next_city];
            current = next_city;
          }

          paths.push(path);
          path_lengths.push(length);

          if (length < best_length) {
            best_length = length;
            best_path = path.slice();
          }
        }

        const delta = Array.from({ length: n }, () => Array(n).fill(0));
        for (let k = 0; k < n_ants; k++) {
          for (let i = 0; i < n - 1; i++) {
            const ci = paths[k][i];
            const cj = paths[k][i + 1];
            delta[ci][cj] += q / path_lengths[k];
          }
        }

        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            pheromone[i][j] = (1 - evaporation) * pheromone[i][j] + delta[i][j];
          }
        }
      }

      return { path: best_path, length: best_length };
    }

    const result = aco_tsp(dist);

    // Ordered points based on best path
    const ordered_points = result.path.map(i => points[i]);

    // Remove existing route
    if (routeLayer) {
      map.removeLayer(routeLayer);
    }

    // Fetch real routes for each segment
    const routeSegments = [];
    for (let i = 0; i < ordered_points.length - 1; i++) {
      const start = ordered_points[i];
      const end = ordered_points[i + 1];
      const segment = await getRoute(start.lat, start.lng, end.lat, end.lng);
      if (segment.length > 0) {
        routeSegments.push(...segment);
      }
    }

    // Add new route
    if (routeSegments.length > 0) {
      routeLayer = L.polyline(routeSegments, { color: '#0078ff', weight: 5 }).addTo(map);
      map.fitBounds(routeLayer.getBounds());
    }

    // Start vehicle animation
    if (!vehicleMarker && routeSegments.length > 0) {
      vehicleMarker = L.marker(routeSegments[0], { 
        icon: L.icon({ 
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/535/535239.png', 
          iconSize: [32, 32] 
        }) 
      }).addTo(map);
      console.log('Vehicle marker criado em:', routeSegments[0]); // Debug
      animateVehicle(routeSegments);
    }

    alert(`Rota otimizada calculada!\nDistância total: ${result.length.toFixed(2)} km`);

  } catch (error) {
    alert(error.message || 'Erro ao calcular rota. Tente novamente.');
    console.error(error);
  } finally {
    computeButton.disabled = false;
    computeButton.textContent = 'Calcular Rota Otimizada';
  }
});

// Clear button
document.getElementById('clear').addEventListener('click', () => {
  points = [];
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
  if (routeLayer) {
    map.removeLayer(routeLayer);
    routeLayer = null;
  }
  if (vehicleMarker) {
    map.removeLayer(vehicleMarker);
    vehicleMarker = null;
  }
  alert('Pontos limpos!');
});

// Animate vehicle
function animateVehicle(route) {
  let index = 0;
  function move() {
    if (index < route.length - 1 && vehicleMarker) {
      const current = route[index];
      vehicleMarker.setLatLng(current);
      index += 2; // Pula pontos pra acelerar
      setTimeout(move, 50); // Ajusta velocidade (50ms = mais rápido)
    } else if (vehicleMarker) {
      vehicleMarker.setLatLng(route[route.length - 1]); // Finaliza na última posição
    }
  }
  move();
}