import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateFlashcardSet = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState([{ front: '', back: '', isFavorite: false }]);
  const navigate = useNavigate();

  const addCard = () => {
    setCards([...cards, { front: '', back: '', isFavorite: false }]);
  };

  const removeCard = (index) => {
    const updatedCards = cards.filter((_, i) => i !== index);
    if (updatedCards.length === 0) {
      alert("Your study set must have at least one card!");
      return;
    }
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
    if (field === 'title') {
      setTitle(value);
    } else if (field === 'description') {
      setDescription(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch('http://localhost:5050/api/flashcards/create', {
        method: 'POST',
        body: JSON.stringify({ userId, title, description, cards }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create flashcard set');
      }

      const data = await response.json();
      if (data._id) {
        navigate(`/review/${data._id}`);
      } else {
        alert('Error with id when creating set');
      }
    } catch (error) {
      console.error(error);
      alert('Error creating set');
    }
  };

  return (
    <div className="white-container">
      <h2>Create Flashcard Set</h2>
      <form onSubmit={handleSubmit}>
        <label>Title of Set:</label>
        <input
          type="text"
          placeholder="Title"
          value={title}
          style={{ width: "100%", marginBottom: "1rem" }}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          required
        />

        <label>Description:</label>
        <textarea
          placeholder="Write a description for this flashcard set"
          value={description}
          style={{ height: 100, marginBottom: "1rem" }}
          onChange={(e) => handleFieldChange('description', e.target.value)}
        />

        <label>Vocab Terms:</label>
        {cards.map((card, index) => (
          <div key={index} className="card-form" style={{ width: "100%", marginBottom: "1rem" }}>
            <div style={{ display: "flex", gap: 15, width: "100%" }}>
              <input
                type="text"
                placeholder="Vocab Word"
                value={card.front}
                style={{ width: "100%" }}
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
              style={{ width: "100%" }}
              onChange={(e) => handleCardChange(index, 'back', e.target.value)}
              required
            />
          </div>
        ))}

        <button type="button" onClick={addCard} style={{ width: "6rem", marginBottom: "1rem" }}>
          Add Card
        </button>
        <button type="submit" style={{ width: "10rem" }}>
          Finish Creating Set
        </button>
      </form>
    </div>
  );
};

export default CreateFlashcardSet;