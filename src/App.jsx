import { useState, useEffect } from 'react';
import { generateCombo } from './utils/generator';
import { generateImage } from './utils/fal';

function App() {
  const [combo, setCombo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0); // To trigger re-animation
  const [imageUrl, setImageUrl] = useState(''); // State for async image URL
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    setLoading(true);
    setProgress(0);
    setError(null);
    setImageUrl(''); // Clear previous image
    setImageLoaded(false);

    // 1. Generate Text Combo
    const newCombo = generateCombo();
    setCombo(newCombo);
    setKey(prev => prev + 1);

    // 2. Generate Image (Async)
    const prompt = `${newCombo.description}, delicious food, vibrant, professional photography, 8k`;

    try {
      const url = await generateImage(prompt);
      setImageUrl(url);
      // Don't set progress to 100 here; wait for image load
    } catch (err) {
      console.error("Failed to generate image with Fal.ai:", err);
      // Fallback to Pollinations.ai (using fast 'flux' model)
      const seed = Math.floor(Math.random() * 1000000);
      const encodedPrompt = encodeURIComponent(prompt);
      const fallbackUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;
      setImageUrl(fallbackUrl);
      // Don't set progress to 100 here; wait for image load
    } finally {
      setLoading(false);
    }
  };

  // Simulated progress effect
  useEffect(() => {
    let interval;
    const isWorking = loading || (imageUrl && !imageLoaded);

    if (isWorking && progress < 90) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          // Slower increment as we get closer
          const increment = Math.max(0.5, (90 - prev) / 20);
          return prev + increment;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [loading, imageUrl, imageLoaded, progress]);

  // Reset image loaded state when combo changes
  useEffect(() => {
    setImageLoaded(false);
  }, [combo]);

  return (
    <div className="app-wrapper">
      <div className="container">
        <header className="header">
          <div className="logo-gradient"></div>
          <p>West Africa meets Japan in a culinary experiment.</p>
          <p className="context-text">
            Nusion is a creative engine that generates hypothetical fusion cuisine. It uses AI to combine authentic West African ingredients with traditional Japanese cooking styles, creating unique dish concepts and visualizing them in real-time.
          </p>
          <p className="project-credit">A <a href="https://studioaikinkarr.framer.website" target="_blank" rel="noopener noreferrer" className="credit-link"><strong>Studio Aikin Karr</strong></a> Project</p>
        </header>

        <div className="generator-wrapper">
          <main className="card">
            <div className="result-content">
              {combo ? (
                <div key={key} className="animate-in">
                  <div className={`image-container ${loading || (!imageLoaded && imageUrl) ? 'loading' : ''}`}>
                    {(loading || (!imageLoaded && imageUrl)) && (
                      <div className="img-placeholder">
                        <p>{loading ? 'Mixing Flavors...' : 'Plating Dish...'}</p>
                        <div className="progress-container">
                          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                    )}
                    {!loading && error && <div className="img-placeholder error" style={{ color: 'var(--accent-wa)' }}>{error}</div>}
                    {!loading && !error && !imageUrl && <div className="img-placeholder">Prepare to Feast</div>}

                    {/* Show image only if we have a URL */}
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={combo.title}
                        className={`dish-image ${imageLoaded ? 'visible' : ''}`}
                        onLoad={() => {
                          setProgress(100);
                          // Small delay to let user see 100% bar before switching
                          setTimeout(() => setImageLoaded(true), 500);
                        }}
                        onError={(e) => {
                          console.error("Image failed to load");
                          e.target.style.display = 'none';
                          // Optional: setError("Image failed to load")
                        }}
                      />
                    )}
                  </div>

                  <div className="card-body">
                    <h2 className="dish-title">{combo.title}</h2>
                    <p className="dish-desc">{combo.description}</p>

                    <div className="tags">
                      <span className="tag wa">{combo.ingredients[0].name}</span>
                      <span className="tag jp">{combo.ingredients[1].name}</span>
                      <span className="tag style">{combo.style}</span>
                    </div>

                    {combo.nutrition && (
                      <div className="nutrition-facts">
                        <h3>Estimated Nutrition</h3>
                        <div className="nutrition-grid">
                          <div className="nut-item">
                            <span className="nut-value">{combo.nutrition.calories}</span>
                            <span className="nut-label">Calories</span>
                          </div>
                          <div className="nut-item">
                            <span className="nut-value">{combo.nutrition.protein}g</span>
                            <span className="nut-label">Protein</span>
                          </div>
                          <div className="nut-item">
                            <span className="nut-value">{combo.nutrition.carbs}g</span>
                            <span className="nut-label">Carbs</span>
                          </div>
                          <div className="nut-item">
                            <span className="nut-value">{combo.nutrition.fat}g</span>
                            <span className="nut-label">Fat</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="initial-state-card">
                  <div className="blur-overlay"></div>
                  <h3>Ready to Fuse?</h3>
                  <p>Click below to generate your first culinary experiment.</p>
                </div>
              )}
            </div>
          </main>

          <button className="btn-generate" onClick={handleGenerate} disabled={loading}>
            {loading ? 'Mixing...' : 'Generate Fusion'}
          </button>
        </div>
      </div>
      <footer className="footer">
        <p>&copy; Studio Aikin Karr 2026</p>
      </footer>
    </div >
  );
}

export default App;
