export const analyzeBeam = async (beamLength, pointLoads, udls) => {
  try {
    const res = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ beamLength, pointLoads, udls }),
    });

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();

    return {
      success: true,
      results: {
        reactions: data.reactions,
        maxValues: data.maxValues,
        analysis: {}, // You can keep your frontend charts here if needed
        chart: data.chart,
      },
    };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.message };
  }
};
