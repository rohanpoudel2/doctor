import React from "react";

export const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl text-black font-bold bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent">
                edTrain AI
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
