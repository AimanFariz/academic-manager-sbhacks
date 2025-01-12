'use client'
import React, { useState } from 'react';

const Classes: React.FC = () => {
  const [elements, setElements] = useState<string[]>([]); // Array of strings to hold the elements
  const [newElement, setNewElement] = useState<string>(''); // New element input

  // Add a new element to the list
  const addElement = (): void => {
    if (newElement.trim() !== '') {
      setElements([...elements, newElement]);
      setNewElement(''); // Clear the input field
    }
  };

  // Remove an element by index
  const removeElement = (index: number): void => {
    setElements(elements.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4">
      {/* Title */}
      <h1 className='border-b border-white py-2 mb-2'>Add yo classes</h1>
      {/* Input and Add Button */}
      <div className="mb-4">
        <input
          type="text"
          value={newElement}
          onChange={(e) => setNewElement(e.target.value)}
          placeholder="Enter a new element"
          className="p-2 border border-gray-400 rounded-md text-black"
        />
        <button
          onClick={addElement}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Add
        </button>
      </div>

      {/* Render the list of elements */}
      <div className="space-y-2">
        {elements.length > 0 ? (
          elements.map((element, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border border-gray-300 rounded-md"
            >
              <span>{element}</span>
              <button
                onClick={() => removeElement(index)}
                className="px-2 py-1 bg-red-500 text-white rounded-md"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No elements added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Classes;
