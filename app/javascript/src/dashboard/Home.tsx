import React, { useState } from "react";
import App from "./App";
import VRDemo from "./components/VRDemo";
import Navigation from "./components/Navigation";

const Home: React.FC = () => {
  const [message, setMessage] = useState("");
  const [showSessions, setShowSessions] = useState(false);

  if (showSessions) {
    return <App />;
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-primary-900/95 z-10"></div>
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1584516150909-c43483ee7932?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Doctor wearing VR headset in medical training"
          />
          <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg text-white">
              Experience Medical Training in VR
            </h1>
            <p className="text-xl mb-8 text-white text-shadow">
              Master clinical skills through immersive virtual reality
              simulations
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setMessage("Put on your VR headset")}
                  className="bg-accent-purple text-white px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Start Training
                </button>
                <a
                  onClick={() => setShowSessions(true)}
                  href="#"
                  className="bg-transparent border text-text-primary px-8 py-4 rounded-full font-semibold hover:bg-purple-600 transition-colors"
                >
                  Your Progress
                </a>
              </div>
              {message && (
                <p className="text-white text-xl font-bold mt-4">{message}</p>
              )}
            </div>
          </div>
        </section>

        <section className="mb-20">
          <VRDemo />
        </section>
      </div>
    </>
  );
};

export default Home;
