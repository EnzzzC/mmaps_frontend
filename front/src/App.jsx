import { useState, useEffect } from 'react';
import Globe from 'react-globe.gl';
import './App.css';

function App() {
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

  return (
    <div className="container">
      <Globe
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
        onGlobeClick={handleGlobeClick}
        pointsData={markers}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => 'orange'}
        pointRadius={0.3}
        labelsData={markers}
        labelLat="lat"
        labelLng="lng"
        labelText="title"
        labelSize={1}
      />
      {newMarkerCoords && (
        <div className="form-overlay">
          <form onSubmit={handleSubmit}>
            <h3>Ajouter un point</h3>
            <label>
              Titre
              <input
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </label>
            <label>
              Description
              <textarea
                rows="3"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </label>
            <label>
              Image
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>
            <div>
              <button type="submit">Ajouter</button>
              <button type="button" onClick={() => setNewMarkerCoords(null)}>
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
