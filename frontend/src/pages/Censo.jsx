import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const formatDate = (dateValue) => {
  if (!dateValue) return '-';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const mapSex = (sex, type) => {
  if (!sex && !type) return '-';
  const normalizedSex = sex ? String(sex).trim().toLowerCase() : '';
  if (normalizedSex === 'female' || normalizedSex === 'hembra') return 'Hembra';
  if (normalizedSex === 'male' || normalizedSex === 'macho') return 'Macho';

  const normalizedType = type ? String(type).trim().toLowerCase() : '';
  if (normalizedType === 'vaca') return 'Hembra';
  if (normalizedType === 'toro') return 'Macho';
  return sex || type || '-';
};

export default function Censo() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const searchQuery = search.trim();
  const searchError = useMemo(() => {
    if (searchQuery.length === 0) return '';
    if (searchQuery.length < 4) return 'Introduce al menos 4 caracteres para buscar.';
    try {
      new RegExp(searchQuery);
      return '';
    } catch {
      return 'Expresión regular no válida.';
    }
  }, [searchQuery]);

  const filteredAnimals = useMemo(() => {
    if (searchQuery.length < 4) return animals;
    try {
      const regex = new RegExp(searchQuery, 'i');
      return animals.filter((animal) =>
        regex.test(animal.name || '') ||
        regex.test(animal.code || '') ||
        regex.test(animal.crotal || '')
      );
    } catch {
      return animals;
    }
  }, [animals, searchQuery]);

  const loadAnimals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/animals');
      setAnimals(response.data.animals || []);
    } catch (error) {
      console.error('Error loading animals:', error);
      toast.error('No se pudo cargar el listado de animales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnimals();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Censo de animales</h1>
            <p className="mt-2 text-gray-600">Listado completo de animales activos registrados en tu ganadería.</p>
          </div>
          <div className="rounded-2xl bg-primary-600 px-5 py-3 text-white shadow-sm">
            <p className="text-sm font-medium">Total de animales</p>
            <p className="text-2xl font-bold">{animals.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="flex-1">
              <span className="block text-sm font-semibold text-gray-700 mb-2">Buscar en el censo</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Busca por nombre, código o crotal (mínimo 4 caracteres)"
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary-500"
              />
            </label>
            <div className="text-sm text-gray-600">
              {searchQuery.length >= 4
                ? `Mostrando ${filteredAnimals.length} de ${animals.length}`
                : `${animals.length} animales registrados`}
            </div>
          </div>
          {searchError && (
            <p className="mt-3 text-sm text-rose-600">{searchError}</p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Sexo</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Fecha de nacimiento</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Código</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Crotal</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center text-gray-500">
                  Cargando animales...
                </td>
              </tr>
            ) : animals.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center text-gray-500">
                  No hay animales activos en el censo.
                </td>
              </tr>
            ) : filteredAnimals.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center text-gray-500">
                  No se encontraron animales con la búsqueda actual.
                </td>
              </tr>
            ) : (
              filteredAnimals.map((animal) => (
                <tr key={animal.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{animal.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{mapSex(animal.sex, animal.type)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(animal.birth_date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{animal.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{animal.code || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{animal.crotal || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
}
