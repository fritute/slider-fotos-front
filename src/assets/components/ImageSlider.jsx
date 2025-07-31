
import React, { useState, useEffect, useCallback } from 'react';
import './ImageSlider.css';

const ImageSlider = () => {
  const [fotos, setFotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        const response = await fetch('http://localhost:3000/fotos');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
      
        setFotos(data.slice(0, 4));
      } catch (e) {
        setError("Não foi possível carregar as fotos. Verifique se o JSON Server está rodando.");
        console.error("Erro ao buscar fotos:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchFotos();
  }, []);

  // Troca automática de imagem a cada 7 segundos
  useEffect(() => {
    if (fotos.length <= 1) return; 
    
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);
    
    return () => clearInterval(interval);
  }, [fotos.length, currentIndex]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % fotos.length);
  }, [fotos.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? fotos.length - 1 : prevIndex - 1
    );
  };

  if (loading) return <div className="slider-container">Carregando imagens...</div>;
  if (error) return <div className="slider-container error-message">{error}</div>;
  if (fotos.length === 0) return <div className="slider-container">Nenhuma imagem encontrada.</div>;

  return (
    <div className="slider-container">
      <div className="slider-wrapper">
        <div className="slider">
          {fotos.map((foto, index) => (
            <div 
              key={foto.id}
              className={`slide ${index === currentIndex ? 'active' : ''}`}
            >
              <div className="slider-image-wrapper">
                <img
                  src={foto.url}
                  alt={foto.title}
                  className="slider-image"
                />
              </div>
              <div className="image-info">
                <h3>{foto.title}</h3>
                <p>Visualizações: {foto.views}</p>
                <p>Data: {foto.data}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="slider-controls">
          <button onClick={prevSlide} className="slider-button">Anterior</button>
          <button onClick={nextSlide} className="slider-button">Próximo</button>
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;