import { useState } from "react";

const Details = () => {
  const [beamLength, setBeamLength] = useState("");
  const [youngModulus, setYoungModulus] = useState("200000"); // E in N/mm²
  const [momentOfInertia, setMomentOfInertia] = useState("3330000"); // I in mm⁴
  const [pointLoads, setPointLoads] = useState([{ P: "", a: "" }]);
  const [udls, setUdls] = useState([{ w: "", start: "", end: "" }]);
  const [annotationPoints, setAnnotationPoints] = useState("1, 3, 4"); // Comma-separated positions in meters
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [showResults, setShowResults] = useState(false);


  const addPointLoad = () => setPointLoads([...pointLoads, { P: "", a: "" }]);
  const addUDL = () => setUdls([...udls, { w: "", start: "", end: "" }]);

  const removePointLoad = (index) => {
    if (pointLoads.length > 1) {
      setPointLoads(pointLoads.filter((_, i) => i !== index));
    }
  };

  const removeUDL = (index) => {
    if (udls.length > 1) {
      setUdls(udls.filter((_, i) => i !== index));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowResults(false);

    try {
      // Parse annotation points from comma-separated string
      const parsedAnnotationPoints = annotationPoints
        .split(',')
        .map(p => p.trim())
        .filter(p => p !== '' && !isNaN(parseFloat(p)))
        .map(p => parseFloat(p));

      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          beamLength: parseFloat(beamLength),
          E: parseFloat(youngModulus),
          I: parseFloat(momentOfInertia),
          pointLoads: pointLoads
            .filter((p) => p.P && p.a)
            .map((p) => ({
              P: parseFloat(p.P),
              a: parseFloat(p.a),
            })),
          udls: udls
            .filter((u) => u.w && u.start && u.end)
            .map((u) => ({
              w: parseFloat(u.w),
              start: parseFloat(u.start),
              end: parseFloat(u.end),
            })),
          annotationPoints: parsedAnnotationPoints,
        }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();

      setAnalysisResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Analysis failed. Please ensure your Python backend is running at http://127.0.0.1:8000"
      );
    }

    setIsSubmitting(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div id="form" className="min-h-screen w-full relative py-16">
  
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-gray-900/95 to-black/95"></div>

      <div className="relative z-10 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-zentry">
              Beam Analysis Input
            </h1>
            <p className="text-xl text-gray-300 font-circular-web">
              Enter your beam parameters to perform structural analysis
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-white to-gray-300 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Form Container */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Beam Length */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <label className="block text-xl font-semibold mb-3 text-white font-circular-web">
                  Beam Length (meters)
                </label>
                <input
                  type="number"
                  value={beamLength}
                  onChange={(e) => setBeamLength(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300"
                  placeholder="Enter beam length in meters"
                  required
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Material Properties */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4 font-circular-web">
                  Material Properties
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Young's Modulus, E (N/mm²)
                    </label>
                    <input
                      type="number"
                      value={youngModulus}
                      onChange={(e) => setYoungModulus(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="e.g., 200000 for steel"
                      required
                      min="0"
                      step="any"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Moment of Inertia, I (mm⁴)
                    </label>
                    <input
                      type="number"
                      value={momentOfInertia}
                      onChange={(e) => setMomentOfInertia(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="e.g., 3330000"
                      required
                      min="0"
                      step="any"
                    />
                  </div>
                </div>
              </div>

              {/* Annotation Points */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4 font-circular-web">
                  Annotation Points for Slope & Deflection
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Positions (m) - Comma-separated values
                  </label>
                  <input
                    type="text"
                    value={annotationPoints}
                    onChange={(e) => setAnnotationPoints(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="e.g., 1, 3, 4"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Enter positions along the beam (in meters) where you want to see slope and deflection values annotated on the diagram. Separate multiple values with commas.
                  </p>
                </div>
              </div>

              {/* Point Loads */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white font-circular-web">
                    Concentrated Loads
                  </h2>
                  <button
                    type="button"
                    onClick={addPointLoad}
                    className="bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    + Add Load
                  </button>
                </div>

                <div className="space-y-4">
                  {pointLoads.map((pl, i) => (
                    <div
                      key={i}
                      className="bg-white/5 rounded-xl p-4 border border-white/10"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Load Magnitude (N)
                          </label>
                          <input
                            type="number"
                            placeholder="Enter force in Newtons"
                            value={pl.P}
                            onChange={(e) => {
                              const updated = [...pointLoads];
                              updated[i].P = e.target.value;
                              setPointLoads(updated);
                            }}
                            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Position (m)
                          </label>
                          <input
                            type="number"
                            placeholder="Distance from left end"
                            value={pl.a}
                            onChange={(e) => {
                              const updated = [...pointLoads];
                              updated[i].a = e.target.value;
                              setPointLoads(updated);
                            }}
                            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                            min="0"
                            step="0.1"
                          />
                        </div>
                        <div className="flex items-end">
                          {pointLoads.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePointLoad(i)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-all duration-300 w-full"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* UDLs */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white font-circular-web">
                    Uniformly Distributed Loads (UDLs)
                  </h2>
                  <button
                    type="button"
                    onClick={addUDL}
                    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    + Add UDL
                  </button>
                </div>

                <div className="space-y-4">
                  {udls.map((u, i) => (
                    <div
                      key={i}
                      className="bg-white/5 rounded-xl p-4 border border-white/10"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Load Intensity (N/m)
                          </label>
                          <input
                            type="number"
                            placeholder="Load per unit length"
                            value={u.w}
                            onChange={(e) => {
                              const updated = [...udls];
                              updated[i].w = e.target.value;
                              setUdls(updated);
                            }}
                            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Start Position (m)
                          </label>
                          <input
                            type="number"
                            placeholder="Start distance"
                            value={u.start}
                            onChange={(e) => {
                              const updated = [...udls];
                              updated[i].start = e.target.value;
                              setUdls(updated);
                            }}
                            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                            min="0"
                            step="0.1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            End Position (m)
                          </label>
                          <input
                            type="number"
                            placeholder="End distance"
                            value={u.end}
                            onChange={(e) => {
                              const updated = [...udls];
                              updated[i].end = e.target.value;
                              setUdls(updated);
                            }}
                            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                            min="0"
                            step="0.1"
                          />
                        </div>
                        <div className="flex items-end">
                          {udls.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeUDL(i)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-all duration-300 w-full"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex-1"
                >
                  Back to Top
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 disabled:from-gray-600 disabled:to-gray-700 text-black px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:text-white flex-1"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </div>
                  ) : (
                    "Analyze Beam"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Results Section */}
          {showResults && analysisResults && (
            <div className="mt-12 bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 animate-fade-in">
              <h2 className="text-3xl font-bold text-white text-center mb-8 font-zentry">
                Analysis Results
              </h2>

              {/* Key Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4 font-circular-web">
                    Reaction Forces
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-300">
                      <span className="text-white font-semibold">RA:</span>{" "}
                      {analysisResults.reactions.RA} N
                    </p>
                    <p className="text-gray-300">
                      <span className="text-white font-semibold">RB:</span>{" "}
                      {analysisResults.reactions.RB} N
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4 font-circular-web">
                    Maximum Values
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-300">
                      <span className="text-white font-semibold">
                        Max Deflection:
                      </span>{" "}
                      {analysisResults.maxValues.deflection} mm
                    </p>
                    <p className="text-gray-300">
                      <span className="text-white font-semibold">
                        Max Moment:
                      </span>{" "}
                      {analysisResults.maxValues.moment} N⋅mm
                    </p>

                  </div>
                </div>
              </div>

              {/* Python Matplotlib Plot */}
              {analysisResults.chart && (
                <div className="flex justify-center mb-8">
                  <img
                    src={`data:image/png;base64,${analysisResults.chart}`}
                    alt="Beam slope and deflection"
                    className="rounded-2xl shadow-2xl border border-white/20 max-w-full"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowResults(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Hide Results
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details;
