# Routes Optimizer 🚗🗺️

Initial interface with instructions to add points via map clicks.

![Initial interface ](https://github.com/GermanoAugustoFB/Routes/blob/main/assets/demo2.png)

Optimized route between Uberlândia and Belo Horizonte (518.10 km):

![Optimized Route Demo](https://github.com/GermanoAugustoFB/Routes/blob/main/assets/demo1.png)

Optimized route between São Paulo and Rio de Janeiro (432.28 km):

![Optimized Route Demo](https://github.com/GermanoAugustoFB/Routes/blob/main/assets/demo3.png)

A web-based application to optimize routes between multiple points using the Ant Colony Optimization (ACO) algorithm. Users can click on a map to add waypoints, and the app calculates the most efficient route to visit all points, minimizing the total distance traveled.

✨ Features

🗺️ Interactive Map: Add waypoints by clicking on a Leaflet.js map using OpenStreetMap tiles.

🧠 Smart Optimization: Uses the Ant Colony Optimization (ACO) algorithm to find the optimal order of visits (open TSP).

🛣️ Real-World Distances: Integrates with OSRM (Open Source Routing Machine) to compute driving distances and routes instead of straight-line approximations.

🚗 Animated Route Playback: Displays a moving vehicle marker following the optimized route.

🧹 Simple UI: Buttons to calculate, clear points, and visualize the optimized route easily.

📱 Responsive Design: Works seamlessly on desktop and mobile devices.

🛠️ Technologies Used

HTML5 & CSS3: Structure and styling.

JavaScript (ES6): Core logic and ACO algorithm.

Leaflet.js (v1.9.4): Interactive map rendering.

OSRM API: Fetches real-world driving distances and geometries.

OpenStreetMap: Free and open map tiles for visualization.

🚀 Getting Started
Prerequisites

A modern web browser (Chrome, Firefox, Edge, etc.).

Internet connection (for OSRM and OSM tiles).

No backend required – all computation runs client-side.

Installation

Clone the repository:
```bash
git clone https://github.com/GermanoAugustoFB/Routes.git
```

Navigate to the project folder:
```bash
cd Routes
```

Open the app:

Use a local server (e.g., VS Code’s Live Server) for best results,
or open index.html directly in your browser.

⚙️ Usage

Open the app in your browser.

Click on the map to add waypoints (markers will appear).

Click “Calcular Rota Otimizada” to run the ACO algorithm.

The optimized route will be drawn in blue, showing the total driving distance.

Watch the vehicle marker follow the optimized path!

Click “Limpar Pontos” to reset and start over.

📋 How It Works
Map Interaction

Powered by Leaflet.js, the map initializes centered on Brazil ([-19.75, -47.93]).
Each map click adds a new waypoint marker.

Real-World Distances (OSRM)

The app queries the OSRM API to:

Compute the distance matrix between all points.

Retrieve driving routes (polylines) for visualization.

Ant Colony Optimization (ACO)

The ACO algorithm finds the shortest path visiting all points once (open TSP).
Parameters:

Ants: 10

Iterations: 50

α = 1, β = 5, Evaporation = 0.5, Q = 100

Vehicle Animation

After computing the route, a vehicle icon moves along the optimized path to visualize travel.

🔮 Future Improvements

🗺️ Support for custom ACO parameters (adjust ants, iterations, etc. via UI).

🚘 Add route details (segment distances, estimated time).

🏷️ Add point labels or popups for easier identification.

⚙️ Integrate with backend-based routing (custom OSRM server or GraphHopper).

🧩 Implement max waypoint limit for performance optimization.

🐜 About ACO

The Ant Colony Optimization algorithm is a bio-inspired heuristic based on how ants find the shortest paths using pheromone trails.
In this project, it solves an open Traveling Salesman Problem (TSP) — finding the optimal visiting order of multiple points without returning to the start.

📜 License

This project is licensed under the MIT License – see the LICENSE file for details.

🙌 Contributing

Contributions are welcome!
To contribute:

# Fork the repository
```bash
  git clone https://github.com/GermanoAugustoFB/Routes.git
```

# Create a new branch
```bash
git checkout -b feature/YourFeature
```

# Commit your changes
```bash
git commit -m "Add YourFeature"
```

# Push to your fork
```bash
git push origin feature/YourFeature
```

Then open a Pull Request 🚀

📧 Contact

For questions or suggestions, open an issue on GitHub Issues.
Built with ☕ and passion by GermanoAugustoFB.
