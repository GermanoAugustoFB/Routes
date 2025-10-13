# Routes Optimizer 🚗🗺️

Optimized route between Uberlândia and Belo Horizonte (518.10 km):



Initial interface with instructions to add points via map clicks.

[text](../../../..)


A web-based application to optimize routes between multiple points using the Ant Colony Optimization (ACO) algorithm. Users can click on a map to add waypoints, and the app calculates the most efficient route to visit all points, minimizing the total distance traveled.
# ✨ Features

Interactive Map: Click on the map to add waypoints using Leaflet.js with OpenStreetMap tiles.
Route Optimization: Utilizes the ACO algorithm to find the optimal order for visiting multiple points (open TSP).
Euclidean Distances: Calculates straight-line distances between points for lightweight client-side processing.
Clear Interface: Simple UI with buttons to compute the optimized route or clear all points.
Responsive Design: Works on desktop and mobile devices with a clean, modern look.

# 🛠️ Technologies Used

HTML5 & CSS3: For structure and styling.
JavaScript: Core logic and map interaction.
Leaflet.js: Interactive map rendering (version 1.9.4).
Ant Colony Optimization: Bio-inspired algorithm for route optimization.
OpenStreetMap: Free map tiles for visualization.

# 🚀 Getting Started
Prerequisites

A modern web browser (Chrome, Firefox, Edge, etc.).
No backend required for the current version (uses Euclidean distances).

# Installation

Clone the repository:
```bash
  git clone https://github.com/GermanoAugustoFB/Routes.git
```

Navigate to the project directory:
```bash
  cd Routes
```


# Open index.html in a browser:
Use a local server (e.g., VS Code's Live Server) for best results, or open directly in a browser.



# Usage

Open the app in your browser.
Click on the map to add waypoints (markers will appear).
Click "Calculate Optimized Route" to compute the shortest path visiting all points using ACO.
View the optimized route as a blue polyline on the map, with the total distance displayed.
Click "Clear Points" to reset and start over.

# 📋 How It Works

Map Interaction: Powered by Leaflet.js, users add points by clicking on the map, centered initially on Brazil ([-19.75, -47.93]).
ACO Algorithm: The Ant Colony Optimization algorithm optimizes the order of waypoints to minimize total distance (open TSP, no return to start).
Parameters: 10 ants, 50 iterations, α=1, β=5, evaporation=0.5, Q=100.
Uses Euclidean distances calculated via Leaflet's distanceTo method.


Visualization: The optimized route is drawn as a polyline, and the map auto-zooms to fit all points.

# 🔧 Future Improvements

Real-World Distances: Integrate with a backend (e.g., OSRM) to compute road-based distances and geometries.
Custom Parameters: Allow users to tweak ACO parameters (e.g., number of ants, iterations) via the UI.
Point Labels: Add labels or popups to markers for better identification.
Route Details: Display additional info like segment distances or estimated travel time.
Point Limit: Implement a maximum number of waypoints to prevent performance issues.

# 🐜 About ACO
The Ant Colony Optimization algorithm is a bio-inspired metaheuristic that mimics how ants find the shortest paths by depositing pheromones. In this project, it solves an open Traveling Salesman Problem (TSP), finding the best order to visit all points without returning to the start.
# 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.
# 🙌 Contributing
Contributions are welcome! Please fork the repo, make your changes, and submit a pull request.

Fork the repository.
Create a feature branch (```bash  git checkout -b feature/YourFeature ```).
Commit your changes (```bash git commit -m 'Add YourFeature' ```).
Push to the branch (```bash git push origin feature/YourFeature ```).
Open a pull request.

# 📧 Contact
For questions or suggestions, reach out via GitHub Issues.

Built with ☕ and passion by GermanoAugustoFB.