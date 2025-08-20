"use client";

import { useState } from "react";

export default function DiagnosticPage() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Inline styles as baseline */}
      <div style={{ 
        backgroundColor: "red", 
        color: "white", 
        padding: "16px", 
        marginBottom: "16px",
        borderRadius: "8px",
        textAlign: "center"
      }}>
        🔴 INLINE STYLES - This should always be RED (baseline test)
      </div>

      {/* Basic Tailwind classes */}
      <div className="bg-blue-500 text-white p-4 mb-4 rounded text-center">
        🔵 BASIC TAILWIND - Should be BLUE if Tailwind works
      </div>

      {/* Gradient test */}
      <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white p-4 mb-4 rounded text-center">
        🟣 GRADIENT TEST - Should be purple-to-pink gradient
      </div>

      {/* Spacing test */}
      <div className="bg-green-500 text-white mb-4 rounded text-center">
        <div className="p-1">p-1 (should be small padding)</div>
        <div className="p-4">p-4 (should be medium padding)</div>
        <div className="p-8">p-8 (should be large padding)</div>
      </div>

      {/* Typography test */}
      <div className="bg-yellow-400 text-black p-4 mb-4 rounded">
        <div className="text-xs">Extra small text (text-xs)</div>
        <div className="text-sm">Small text (text-sm)</div>
        <div className="text-base">Base text (text-base)</div>
        <div className="text-lg">Large text (text-lg)</div>
        <div className="text-xl font-bold">XL Bold text</div>
      </div>

      {/* Interactive test */}
      <div className="bg-gray-100 p-4 mb-4 rounded">
        <h3 className="text-lg font-bold mb-2">Interactive Test (you said this works):</h3>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2 transition-colors duration-200"
          onClick={() => setCount(count + 1)}
        >
          Hover & Click Test (Count: {count})
        </button>
        
        <button className="bg-red-500 hover:bg-red-700 hover:scale-105 text-white px-4 py-2 rounded transform transition-all duration-200">
          Hover Scale Test
        </button>
      </div>

      {/* Flexbox test */}
      <div className="bg-indigo-100 p-4 mb-4 rounded">
        <h3 className="text-lg font-bold mb-2">Flexbox Test:</h3>
        <div className="flex justify-between items-center bg-white p-3 rounded">
          <span>Left item</span>
          <span className="bg-indigo-500 text-white px-3 py-1 rounded">Center</span>
          <span>Right item</span>
        </div>
      </div>

      {/* Grid test */}
      <div className="bg-orange-100 p-4 mb-4 rounded">
        <h3 className="text-lg font-bold mb-2">Grid Test:</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-orange-300 p-2 rounded text-center">1</div>
          <div className="bg-orange-400 p-2 rounded text-center">2</div>
          <div className="bg-orange-500 p-2 rounded text-center text-white">3</div>
        </div>
      </div>

      {/* Border test */}
      <div className="border-4 border-red-500 p-4 mb-4 rounded-lg">
        <h3 className="text-lg font-bold">Border Test - Should have thick red border</h3>
      </div>

      {/* Shadow test */}
      <div className="bg-white p-4 mb-4 shadow-lg rounded-lg">
        <h3 className="text-lg font-bold">Shadow Test - Should have a shadow</h3>
      </div>

      {/* What do you see? */}
      <div className="bg-gray-800 text-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">🔍 Diagnostic Results:</h2>
        <div className="space-y-2 text-sm">
          <p>✅ If buttons work on hover → Tailwind interactions are working</p>
          <p>🎨 If boxes have colors → Tailwind utilities are working</p>
          <p>📏 If text sizes vary → Tailwind typography is working</p>
          <p>🔳 If layouts look organized → Tailwind layout is working</p>
          <p>❌ If everything looks unstyled → Tailwind CSS not loading</p>
        </div>
      </div>
    </div>
  );
}