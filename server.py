from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import numpy as np
import matplotlib.pyplot as plt
import io, base64
import os
import sys
import webbrowser


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Determine the base path (works for both development and PyInstaller executable)
if getattr(sys, 'frozen', False):
    # Running as compiled executable
    base_path = sys._MEIPASS
else:
    # Running in normal Python environment
    base_path = os.path.dirname(os.path.abspath(__file__))

# Path to the frontend build directory
frontend_dir = os.path.join(base_path, "frontend", "dist")

class BeamInput(BaseModel):
    beamLength: float
    E: float  # Young's modulus in N/mm²
    I: float  # Moment of inertia in mm⁴
    pointLoads: list
    udls: list
    annotationPoints: list = []  # Optional list of positions (in meters) for slope/deflection annotations


def calculate_reactions(L, point_loads, udls):
    RA, RB = 0, 0
    for P, a in point_loads:
        RB += P * a / L
        RA += P * (L - a) / L
    for w, a, b in udls:
        total = w * (b - a)
        centroid = (a + b) / 2
        RB += total * centroid / L
        RA += total * (L - centroid) / L
    return RA, RB


def bending_moment(x, L, RA, point_loads, udls):
    M = RA * x
    for P, a in point_loads:
        if x >= a:
            M -= P * (x - a)
    for w, a, b in udls:
        if x >= a:
            x_end = min(x, b)
            l = x_end - a
            M -= w * l * (x - a - l/2)
    return M


@app.post("/analyze")
def analyze_beam(data: BeamInput):
    E = data.E  # N/mm² from user input
    I = data.I  # mm⁴ from user input
    L = data.beamLength * 1000

    point_loads = [(float(p["P"]), float(p["a"]) * 1000) for p in data.pointLoads]
    udls = [(float(u["w"]) / 1000, float(u["start"]) * 1000, float(u["end"]) * 1000) for u in data.udls]

    RA, RB = calculate_reactions(L, point_loads, udls)

    x = np.linspace(0, L, 500)
    M = np.array([bending_moment(xi, L, RA, point_loads, udls) for xi in x])
    theta = np.cumsum(M / (E * I)) * (x[1] - x[0])
    y = np.cumsum(theta) * (x[1] - x[0])
    y -= np.linspace(y[0], y[-1], len(y))
    theta -= np.linspace(theta[0], theta[-1], len(theta))


    plt.figure(figsize=(12, 10))
    
    # Use user-provided annotation points or default to [1, 3, 4] meters
    beam_length_m = L / 1000  
    if data.annotationPoints and len(data.annotationPoints) > 0:
        interval_positions_m = np.array([float(p) for p in data.annotationPoints])
    else:
        interval_positions_m = np.array([1, 3, 4])
    
    # Filter out positions that are outside the beam length
    interval_positions_m = interval_positions_m[interval_positions_m <= beam_length_m]
    
    interval_indices = [np.argmin(np.abs(x/1000 - pos)) for pos in interval_positions_m]
    

    plt.subplot(2, 1, 1)
    plt.plot(x / 1000, theta, 'b-', linewidth=2)
    plt.grid(True, alpha=0.3)
    plt.xlabel("Position along beam (m)")
    plt.ylabel("Slope (radians)")
    plt.title("Slope Diagram", fontsize=14, fontweight='bold')

    for idx, pos_m in zip(interval_indices, interval_positions_m):
        plt.plot(pos_m, theta[idx], 'ro', markersize=8)
        plt.annotate(f'{theta[idx]:.6f}', 
                    xy=(pos_m, theta[idx]), 
                    xytext=(10, 10), 
                    textcoords='offset points',
                    bbox=dict(boxstyle='round,pad=0.5', fc='yellow', alpha=0.7),
                    fontsize=6,
                    ha='left')

    plt.subplot(2, 1, 2)
    plt.plot(x / 1000, y, 'r-', linewidth=2)
    plt.grid(True, alpha=0.3)
    plt.xlabel("Position along beam (m)")
    plt.ylabel("Deflection (mm)")
    plt.title("Deflection Diagram", fontsize=14, fontweight='bold')
    

    for idx, pos_m in zip(interval_indices, interval_positions_m):
        plt.plot(pos_m, y[idx], 'go', markersize=8)
        plt.annotate(f'{y[idx]:.3f} mm', 
                    xy=(pos_m, y[idx]), 
                    xytext=(10, -15), 
                    textcoords='offset points',
                    bbox=dict(boxstyle='round,pad=0.5', fc='lightgreen', alpha=0.7),
                    fontsize=6,
                    ha='left')
    

    max_deflection_idx = np.argmin(y) 
    max_deflection_value = y[max_deflection_idx]
    max_deflection_position = x[max_deflection_idx] / 1000  
    
    plt.plot(max_deflection_position, max_deflection_value, 'b*', markersize=20, 
             markeredgecolor='darkblue', markeredgewidth=2, label='Max Deflection')
    plt.annotate(f'MAX: {max_deflection_value:.3f} mm\nat {max_deflection_position:.3f} m', 
                xy=(max_deflection_position, max_deflection_value), 
                xytext=(50, 50), 
                textcoords='offset points',
                bbox=dict(boxstyle='round,pad=0.7', fc='cyan', alpha=0.9, edgecolor='darkblue', linewidth=2),
                fontsize=8,
                fontweight='bold',
                ha='left',
                arrowprops=dict(arrowstyle='->', connectionstyle='arc3,rad=0', color='darkblue', lw=2))
    plt.legend(loc='best')
    
    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')

    return {
        "reactions": {"RA": round(RA, 2), "RB": round(RB, 2)},
        "maxValues": {
            "deflection": round(min(y), 6),
            "deflectionPosition": round(max_deflection_position, 3),
            "moment": round(max(abs(M)), 2),
            "shear": "N/A"
        },
        "chart": image_base64
    }

# Serve the frontend
@app.get("/")
async def serve_frontend():
    index_path = os.path.join(frontend_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Frontend not found"}

@app.get("/{full_path:path}")
async def serve_frontend_routes(full_path: str):
    # Serve static files or index.html for client-side routing
    file_path = os.path.join(frontend_dir, full_path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    # Fallback to index.html for client-side routing
    index_path = os.path.join(frontend_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "File not found"}

if __name__ == "__main__":
    import uvicorn
    import threading
    import time
    
    # Function to open browser after a delay
    def open_browser():
        time.sleep(2)  # Wait 2 seconds for server to start
        webbrowser.open("http://127.0.0.1:8000")
    
    # Start browser in a separate thread
    browser_thread = threading.Thread(target=open_browser, daemon=True)
    browser_thread.start()
    
    # Start the server (blocking call)
    uvicorn.run(app, host="127.0.0.1", port=8000)


