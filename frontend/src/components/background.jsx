export default function Background() {
  return (
    <div className="fixed inset-0 w-full h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      

      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
      </div>

      {/* Floating Orbs - White variants */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-300/10 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float"></div>

      {/* Geometric Shapes - White borders */}
      <div className="absolute top-20 right-20 w-32 h-32 border rounded-xl border-white/30 rotate-45 animate-glow"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 border rounded-xl border-gray-300/30 rotate-12 animate-float"></div>
      <div className="absolute top-1/2 left-1/2 w-16 h-16 border rounded-xl border-white/20 rotate-12 animate-float-delayed"></div>
    </div>
  );
}