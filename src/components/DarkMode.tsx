import React, { useState } from 'react';

const LightDarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // Manage mode state

  // Toggle between light and dark mode
  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? 'bg-gray-900 text-white min-h-screen' : 'bg-white text-black min-h-screen'}>
      {/* Header with Toggle Button */}
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Light/Dark Mode Toggle</h1>
        <button
          onClick={toggleMode}
          className="px-4 py-2 rounded-md transition-all duration-300"
          style={{
            backgroundColor: isDarkMode ? 'white' : 'black',
            color: isDarkMode ? 'black' : 'white',
          }}
        >
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </header>

      {/* Content */}
      <main className="p-4">
        <p>
          This is an example of a light and dark mode toggle. The background, text color, and button styling
          change based on the mode.
        </p>
      </main>
    </div>
  );
};

export default LightDarkModeToggle;
