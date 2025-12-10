import { useState, useEffect } from 'react';
import { generateCombo } from './utils/generator';

function App() {
  const [combo, setCombo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0); // To trigger re-animation

  const handleGenerate = () => {
    setLoading(true);
    // Removed artificial delay for instant text generation
    setCombo(generateCombo());
    setKey(prev => prev + 1);
    setLoading(false);
  };

  // Generate one on first load
  useEffect(() => {
    handleGenerate();
  }, []);

  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset image loaded state when combo changes
  useEffect(() => {
    setImageLoaded(false);
  }, [combo]);

  // Pollinations.ai URL construction
  // We encode the description to make it URL safe. 
  // Simplified prompt for speed.
  // OPTIMIZATION: Reduced resolution to 384x384 and used 'seed' parameter.
  const imageUrl = combo
    ? `https://image.pollinations.ai/prompt/${encodeURIComponent(combo.description + ", delicious food, vibrant")}?seed=${combo.id}&model=turbo&width=384&height=384`
    : '';

  return (
    <div className="app-wrapper">
      <div className="container">
        <header className="header">
          <div className="logo-gradient"></div>
          <p>West Africa meets Japan in a culinary experiment.</p>
          <p className="project-credit">A <strong>Studio Aikin Karr</strong> Project</p>
        </header>

        <div className="generator-wrapper">
          <main className="card">
            <div className="result-content">
              {loading ? (
                <div className="loading-spinner-container">
                  <div className="loading-spinner"></div>
                </div>
              ) : combo ? (
                <div key={key} className="animate-in">
                  <div className={`image-container ${!imageLoaded ? 'loading' : ''}`}>
                    {!imageLoaded && <div className="img-placeholder">Generating Visual...</div>}
                    <img
                      src={imageUrl}
                      alt={combo.title}
                      className={`dish-image ${imageLoaded ? 'visible' : ''}`}
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                        console.error("Image failed to load");
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="card-body">
                    <h2 className="dish-title">{combo.title}</h2>
                    <p className="dish-desc">{combo.description}</p>

                    <div className="tags">
                      <span className="tag wa">{combo.ingredients[0].name}</span>
                      <span className="tag jp">{combo.ingredients[1].name}</span>
                      <span className="tag style">{combo.style}</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </main>

          <button className="btn-generate" onClick={handleGenerate}>
            {loading ? 'Mixing...' : 'Generate Fusion'}
          </button>
        </div>
      </div>
      <footer className="footer">
        <p>&copy; Studio Aikin Karr 2026</p>
      </footer>
    </div>
  );
}

export default App;
