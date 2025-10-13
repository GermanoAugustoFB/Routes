// Initialize map
const map = L.map(document.querySelector('.map')).setView([-19.75, -47.93], 7); // Brazil center

// OpenStreetMap Tile Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let routeLayer; // Layer to hold the route
let points = []; // Array of LatLng points
let markers = []; // Array of markers

// Handle map clicks to add points
map.on('click', (e) => {
  const marker = L.marker(e.latlng).addTo(map);
  markers.push(marker);
  points.push(e.latlng);
});

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
    // Compute distance matrix (Euclidean in km)
    const n = points.length;
    const dist = Array.from({length: n}, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          dist[i][j] = points[i].distanceTo(points[j]) / 1000; // km
        }
      }
    }

    // ACO for open TSP (no return to start)
    function aco_tsp(dist, n_ants = 10, n_iterations = 50, alpha = 1, beta = 5, evaporation = 0.5, q = 100) {
      const n = dist.length;
      const pheromone = Array.from({length: n}, () => Array(n).fill(1 / n));
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
                probs.push({city: next, p});
                total_prob += p;
              }
            }

            // Roulette wheel selection
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

            if (next_city === -1) next_city = probs[0].city; // Fallback

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

        // Update delta pheromone
        const delta = Array.from({length: n}, () => Array(n).fill(0));
        for (let k = 0; k < n_ants; k++) {
          for (let i = 0; i < n - 1; i++) { // Open path, no close
            const ci = paths[k][i];
            const cj = paths[k][i + 1];
            delta[ci][cj] += q / path_lengths[k];
            // delta[cj][ci] += q / path_lengths[k]; // Uncomment if symmetric graph
          }
        }

        // Update pheromone
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            pheromone[i][j] = (1 - evaporation) * pheromone[i][j] + delta[i][j];
          }
        }
      }

      return {path: best_path, length: best_length};
    }

    const result = aco_tsp(dist);

    // Ordered points based on best path
    const ordered_points = result.path.map(i => points[i]);

    // Remove existing route
    if (routeLayer) {
      map.removeLayer(routeLayer);
    }

    // Add new route (straight lines)
    routeLayer = L.polyline(ordered_points, { color: '#0078ff', weight: 5 }).addTo(map);

    // Fit map to route
    map.fitBounds(routeLayer.getBounds());

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
  alert('Pontos limpos!');
});