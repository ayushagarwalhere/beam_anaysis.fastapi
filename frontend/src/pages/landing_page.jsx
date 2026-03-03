import React, { useState } from 'react'
import Background from '../components/background.jsx'

const LandingPage = () => {
  const [showForm, setShowForm] = useState(false)

  const teamMembers = [
    { name: "AYUSH AGARWAL", roll: "24BME108" },
    { name: "AYUSH JYANI", roll: "24BME109" },
    { name: "DESALANKA RISHI", roll: "24BME110" },
    { name: "GADUGOYILA HARSHA", roll: "24BME112" },
    { name: "KARIMERAKALA MANOJ", roll: "24BME113" }
  ]

  const scrollToForm = () => {
    const formElement = document.getElementById('form')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div id='home-page' className="min-h-screen">
      <Background />
      
      <div className="relative z-10 min-h-screen flex flex-col"> 

        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className='text-4xl md:text-6xl lg:text-7xl text-white font-zentry italic mb-6 tracking-wider text-shadow-lg animate-slide-up'>
              M E C H A N I C S &nbsp; O F &nbsp; S O L I D S
            </h1> 
            <div className="w-32 h-1 bg-gradient-to-r from-white to-gray-300 mx-auto mt-6 rounded-full animate-glow"></div>
          </div>
          
          <button 
            onClick={scrollToForm}
            className="bg-gradient-to-r from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 text-black px-8 py-4 rounded-full text-xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 mb-16"
          >
            Start Analysis
          </button>
        </div>


        <div className='px-4 pb-8'>
          <div className="max-w-4xl mx-auto justify-center items-center">
            <h1 className='text-3xl md:text-4xl font-bold text-white text-center mb-12 font-circular-web justify-items-center justify-center items-center'>
              Team Members
            </h1>

            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
              {teamMembers.map((member, index) => (
                <div 
                  key={index}
                  className='bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 w-full max-w-sm transform hover:scale-105 transition-all duration-300 hover:bg-white/20 animate-scale-in'
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-center">
                    <div className="w-16 h-8 bg-gradient-to-r from-white to-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-black font-bold text-xl">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className='text-lg font-semibold text-white mb-1 font-circular-web'>
                      {member.name}
                    </h3>
                    <h1 className='text-gray-300 text-xl font-extralight font-mono'>
                      {member.roll}
                    </h1>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='text-center pb-8 px-4'>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-2xl mx-auto border border-white/20">
            <p className='text-white text-lg md:text-xl font-circular-web'>
              Submitted to: <span className="text-gray-300 font-semibold">Dr. Rakesh Sehgal Sir</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage