# Mechanics of Solids - Beam Analysis Application

A modern, self-contained web application for analyzing simply supported beams with point loads and uniformly distributed loads (UDLs). Built entirely with React frontend - no backend required!

## Features

### Frontend-Only Solution
- **Pure JavaScript Calculations**: All beam analysis calculations run in the browser
- **No Backend Required**: Completely self-contained application
- **Modern UI**: Responsive design with black and white theme
- **Real-time Analysis**: Instant results with local calculations
- **Professional Results**: Detailed analysis data display

### Analysis Capabilities
- Calculate reaction forces (RA, RB)
- Compute bending moments and shear forces
- Determine slopes and deflections using double integration
- Support for multiple point loads and UDLs
- Material properties for steel (E = 2×10⁵ N/mm², I = 8×10⁶ mm⁴)


**Submitted to:** Dr. Rakesh Sehgal Sir

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (Node package manager)

### Setup & Run

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

That's it! No backend setup required.

## Usage

1. **Enter Beam Parameters**:
   - Beam length in meters
   - Point loads: magnitude (N) and position (m)
   - UDLs: intensity (N/m), start and end positions (m)

2. **Analyze**: Click "Analyze Beam" for instant results

3. **View Results**:
   - Reaction forces (RA, RB)
   - Maximum deflection, moment, and shear
   - Detailed analysis data for 500 points along the beam

## Technical Implementation

### Beam Analysis Engine (`src/utils/beamAnalysis.js`)
- **Reaction Calculations**: Equilibrium equations for simply supported beams
- **Bending Moments**: Moment equations considering all loads
- **Shear Forces**: Force equilibrium calculations
- **Slopes & Deflections**: Double integration of M/EI
- **Unit Conversions**: Automatic conversion between meters (input) and mm (calculations)


### Key Functions
```javascript
// Main analysis function
analyzeBeam(beamLength, pointLoads, udls)

// Individual calculation functions
calculateReactions(L, pointLoads, udls)
bendingMoment(x, L, RA, pointLoads, udls)
shearForce(x, L, RA, pointLoads, udls)
calculateSlopeDeflection(positions, moments, E, I)
```


## Units & Conversions

- **Input**: All lengths in meters, forces in Newtons
- **Calculations**: Internally converted to mm for precision
- **Results**: Displayed in appropriate units (N, mm, N⋅mm)

## Advantages of Frontend-Only Approach

1. **No Server Required**: Runs entirely in the browser
2. **Instant Results**: No network latency
3. **Offline Capable**: Works without internet connection
4. **Easy Deployment**: Just serve static files
5. **Cross-Platform**: Works on any device with a modern browser

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Adding New Features
- **New Load Types**: Extend the analysis functions in `beamAnalysis.js`
- **Visualizations**: Add chart libraries for plotting results
- **Export Options**: Add PDF/Excel export functionality
- **Material Database**: Expand material properties

### Performance
- **Optimized Calculations**: Efficient algorithms for 500 analysis points
- **Memory Efficient**: Minimal memory footprint
- **Fast Rendering**: Optimized React components

## Creating a Standalone Executable

Want to share this application as a single `.exe` file? Follow these steps:

### Quick Method (Automated)
Simply double-click `build_exe.bat` in the project root. This will:
1. Build the React frontend
2. Install Python dependencies
3. Create a standalone executable

The executable will be at: `dist\BeamAnalyzer.exe`

### Manual Method
```bash
# 1. Build the frontend
cd frontend
npm install
npm run build
cd ..

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Build the executable
pyinstaller beam_analyzer.spec
```

### Distribution
- Share the `BeamAnalyzer.exe` file with anyone
- No installation required - just double-click to run
- Works completely offline
- Automatically opens in the default browser

For detailed instructions, see `BUILD_INSTRUCTIONS.md` and `QUICK_START.md`.
