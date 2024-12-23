import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const FlashcardSet = () => {
  const [set, setSet] = useState({ title: '', description: '', cards: [] });
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSet = async () => {
      try {
        console.log(`fetching flashcard set with ID: ${setId}`);
        const response = await fetch(`http://localhost:5050/api/flashcards/${setId}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch flashcard set');

        const data = await response.json();
        setSet(data);
        setCards(data.cards || []); // sync cards with fetched data
      } catch (error) {
        console.error(error);
        alert('Error fetching flashcard set');
      } finally {
        setLoading(false);
      }
    };

    fetchSet();
  }, [setId]);

  const addCard = () => {
    setCards([...cards, { front: '', back: '', isFavorite: false }]);
  };

  const removeCard = (index) => {
    if (cards.length === 1) {
      alert("Your study set must have at least one card!");
      return;
    }
    const updatedCards = cards.filter((_, i) => i !== index);
    setCards(updatedCards);
  };

  const toggleFavorite = (index) => {
    const updatedCards = [...cards];
    updatedCards[index].isFavorite = !updatedCards[index].isFavorite;
    setCards(updatedCards);
  };

  const handleCardChange = (index, field, value) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
  };

  const handleFieldChange = (field, value) => {
    setSet((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("trying to edit, passing to fetch: ");
      console.log(JSON.stringify({ _id: setId, title: set.title, description: set.description, cards }));
      const response = await fetch(`http://localhost:5050/api/flashcards/editSet/${setId}`, {
        method: 'PATCH',
        body: JSON.stringify({ _id: setId, title: set.title, description: set.description, cards }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to edit flashcard set');

      navigate(`/`);
    } catch (error) {
      console.error(error);
      alert('Error saving flashcard set');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="white-container">
      <h2>Edit Flashcard Set</h2>
      <form onSubmit={handleSubmit}>
        <label>Title of Set:</label>
        <input
          type="text"
          placeholder="Title"
          value={set.title}
          style={{ width: '100%', marginBottom: '1rem' }}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          required
        />
        
        <label>Description:</label>
        <textarea
          placeholder="Write a description for this flashcard set"
          value={set.description}
          style={{ height: 100, width: '100%', marginBottom: '1rem' }}
          onChange={(e) => handleFieldChange('description', e.target.value)}
        />

        <label>Cards:</label>
        {cards.map((card, index) => (
          <div key={index} className="card-form" style={{ width: "100%", marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: 15, width: '100%' }}>
              <input
                type="text"
                placeholder="Vocab Word"
                value={card.front}
                style={{ width: '100%' }}
                onChange={(e) => handleCardChange(index, 'front', e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => removeCard(index)}
                className="remove-button"
              >
                Remove
              </button>
              <button 
                type="button"
                onClick={() => toggleFavorite(index)}
              >
                {card.isFavorite ? 'Unfavorite' : 'Favorite'}
              </button>
            </div>
            <textarea
              placeholder="Definition"
              value={card.back}
              style={{ width: '100%' }}
              onChange={(e) => handleCardChange(index, 'back', e.target.value)}
              required
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addCard}
          style={{ width: '6rem', marginBottom: '1rem' }}
        >
          Add Card
        </button>
        <button type="submit" style={{ width: '10rem' }}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default FlashcardSet;