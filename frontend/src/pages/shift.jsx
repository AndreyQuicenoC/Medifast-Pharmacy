import React from "react";

export default function Shift(){
  return (
    <div className="w-screen h-screen bg-white flex flex-col p-4">
      {/* Header */}
      <header className="flex items-center gap-2 mb-4">
        <div className="text-green-600 text-3xl">🌿</div>
        <h1 className="text-xl font-semibold text-gray-800">Healthy</h1>
      </header>

      {/* Mi Turno Section */}
      <div className="bg-teal-100 rounded-2xl flex items-center py-8 px-6 mb-4 gap-4">
        <h2 className="text-8xl font-bold text-gray-800 font-Fredoka-one">Mi Turno</h2>
        <span className="text-8xl font-black text-teal-600 px-95">18</span>
      </div>


      {/* Turno Siguiente y Cancelar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1 bg-teal-200 rounded-full py-4 px-6 flex justify-between items-center mr-2">
            <span className="text-4xl font-bold text-gray-800">Turno Siguiente</span>
            <span className="text-4xl font-bold text-gray-800">15</span>
        </div>
        <button className="flex-1 bg-teal-500 text-white rounded-full py-4 px-6 font-bold ml-2 hover:bg-teal-600 transition duration-300">
          Cancelar Servicio
        </button>
      </div>

      {/* Contenido Principal */}
      <div className="flex flex-1 gap-4">
        {/* Izquierda: puede ser algo más o lo dejamos vacío */}
        <div className="flex-1 bg-gray-100 rounded-xl flex justify-center items-center text-gray-400 text-lg">
          {/* Puedes poner algo aquí si necesitas */}
          {/* Ejemplo: Información Adicional */}
        </div>

        {/* Derecha: espacio vacío también */}
        <div className="flex-1 bg-gray-100 rounded-xl flex justify-center items-center text-gray-400 text-lg">
          {/* Ejemplo: Otra Información */}
        </div>
      </div>
    </div>
  );
};

