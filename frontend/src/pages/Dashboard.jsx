import { useAuth } from '../contexts/AuthContext';
import { UploadCloud, FileText, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { user } = useAuth();
  
  const [censusLoading, setCensusLoading] = useState(true);
  const [hasCensus, setHasCensus] = useState(false);
  const [animalCount, setAnimalCount] = useState(0);
  
  // File upload states
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch census status
  const checkCensusStatus = async () => {
    try {
      setCensusLoading(true);
      const res = await api.get('/animals/census-status');
      setHasCensus(res.data.hasCensus);
      setAnimalCount(res.data.count);
    } catch (error) {
      console.error('Error fetching census status:', error);
      toast.error('No se pudo verificar el estado del censo');
    } finally {
      setCensusLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkCensusStatus();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      toast.warn('Por favor, selecciona un archivo PDF válido');
    }
  };

  const triggerFileSelect = (e) => {
    // Avoid triggering when clicking the upload button inside the dropzone
    if (e.target.closest('button')) return;
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else if (selectedFile) {
      toast.warn('Por favor, selecciona un archivo PDF válido');
    }
  };

  const fileToBase64 = (fileObj) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(fileObj);
      reader.onload = () => {
        const base64Str = reader.result.split(',')[1];
        resolve(base64Str);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async (e) => {
    e.stopPropagation(); // Avoid triggering parent click
    if (!file) return;

    try {
      setUploading(true);
      const base64Data = await fileToBase64(file);
      
      const res = await api.post('/animals/upload-census', {
        pdfBase64: base64Data
      });

      toast.success(`¡Censo cargado con éxito! Se registraron ${res.data.count} animales.`);
      setFile(null);
      // Refresh status
      await checkCensusStatus();
    } catch (error) {
      console.error('Error uploading census:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Error al procesar el archivo';
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="app-main max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {censusLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Cargando información del censo...</p>
        </div>
      ) : !hasCensus ? (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider bg-primary-700/50 px-3 py-1 rounded-full text-primary-100">Configuración Inicial</span>
            </div>
            <h2 className="text-2xl font-bold mb-3">Inicializa tu Censo Ganadero</h2>
            <p className="text-primary-100 max-w-2xl text-sm leading-relaxed">
              Detectamos que no tienes ningún animal registrado en tu ganadería. Carga el documento en formato PDF de la <strong>Unión Toros de Lidia</strong> para crear el censo automáticamente con toda la genealogía y reseña.
            </p>
          </div>
          
          <div className="p-8">
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragging 
                  ? 'border-primary-500 bg-primary-50/50' 
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50/50'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept=".pdf" 
                className="hidden" 
              />
              
              {file ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-primary-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{file.name}</h4>
                  <p className="text-xs text-gray-500 mb-4">{(file.size / 1024).toFixed(1)} KB</p>
                  
                  <button 
                    onClick={handleUpload}
                    disabled={uploading}
                    className="btn btn-primary px-8"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Procesando censo...
                      </>
                    ) : 'Confirmar e Importar Censo'}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mb-2">Arrastra el archivo PDF aquí</h4>
                  <p className="text-sm text-gray-500 mb-2">o haz clic para explorar en tu ordenador</p>
                  <p className="text-xs text-gray-400">Solo se admiten archivos PDF de la Unión Toros de Lidia</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <h5 className="font-bold mb-1">¿Dónde encuentro el archivo de ejemplo?</h5>
                <p className="leading-relaxed">
                  Para probar este flujo, puedes utilizar el archivo <strong>Formato 1_Todos los animales vivos.pdf</strong> ubicado en la carpeta raíz del proyecto.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="col-span-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl shadow-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-3">¡Bienvenido, {user?.fullName}!</h2>
            <p className="text-primary-100 max-w-2xl">
              Hoy tienes acceso a tu panel de ganadería. Revisa animales, revisiones veterinarias y ajustes de tu equipo.
            </p>
          </div>

          {/* Cards */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🐂</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Animales</h3>
            <p className="text-gray-600 font-bold text-primary-600 mb-1">Total: {animalCount}</p>
            <p className="text-gray-500 text-sm">Gestiona los toros y vacas de tu ganadería</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Veterinario</h3>
            <p className="text-gray-600">Historial de revisiones y tratamientos</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚙️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuración</h3>
            <p className="text-gray-600">Datos de la ganadería y usuarios</p>
          </div>
        </div>
      )}

      {/* Información del usuario */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de tu cuenta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-gray-900 font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tipo de usuario</p>
            <p className="text-gray-900 font-medium">{user?.userType === 'user' ? 'Usuario' : user?.userType}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
