function App() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Hello Tailwind!
        </h1>
        <p className="text-gray-600">
          If you see this styled, Tailwind is working! 🎉
        </p>
        <button className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Click Me
        </button>
      </div>
    </div>
  );
}

export default App;