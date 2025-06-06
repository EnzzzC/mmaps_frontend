import { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
// import './App.css'; // Décommente si tu utilises un fichier CSS classique

function App() {
  const globeRef = useRef();

  const [markers, setMarkers] = useState(() => {
    const stored = localStorage.getItem('markers');
    return stored ? JSON.parse(stored) : [];
  });
  const [newMarkerCoords, setNewMarkerCoords] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', image: null });

  useEffect(() => {
    localStorage.setItem('markers', JSON.stringify(markers));
  }, [markers]);

  const handleGlobeClick = ({ lat, lng }) => {
    setNewMarkerCoords({ lat, lng });
    setForm({ title: '', description: '', image: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMarkerCoords) return;
    const marker = {
      id: Date.now(),
      lat: newMarkerCoords.lat,
      lng: newMarkerCoords.lng,
      title: form.title,
      description: form.description,
      image: form.image,
    };
    setMarkers((m) => [...m, marker]);
    setNewMarkerCoords(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
  };

  // Custom 3D marker object
  const pinObject = new THREE.Group();
  const material = new THREE.MeshLambertMaterial({ color: 'red' });
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.4, 8), material);
  cone.position.y = 0.2;
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.12), material);
  pinObject.add(cone);
  pinObject.add(sphere);

  return (
    <div className="w-screen h-screen">
      <Globe
        ref={globeRef}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
        onGlobeClick={handleGlobeClick}
        objectsData={markers}
        objectLat="lat"
        objectLng="lng"
        objectAltitude={() => 0.02}
        objectFacesSurface
        objectThreeObject={() => pinObject.clone()}
        labelsData={markers}
        labelLat="lat"
        labelLng="lng"
        labelText="title"
        labelSize={1}
      />
      {newMarkerCoords && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-base-100 p-4 rounded shadow space-y-2 w-80"
          >
            <h3 className="text-lg font-bold">Ajouter un point</h3>
            <label className="form-control">
              <span className="label-text">Titre</span>
              <input
                required
                className="input input-bordered"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </label>
            <label className="form-control">
              <span className="label-text">Description</span>
              <textarea
                rows="3"
                className="textarea textarea-bordered"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </label>
            <label className="form-control">
              <span className="label-text">Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input file-input-bordered"
              />
            </label>
            <div className="flex justify-end gap-2 mt-2">
              <button type="submit" className="btn btn-primary">
                Ajouter
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setNewMarkerCoords(null)}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
