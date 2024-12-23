import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const FlashcardReview = () => {
  const [set, setSet] = useState(null);
  const [card, setCard] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const { setId } = useParams();

  useEffect(() => {
    const fetchSet = async () => {
      const response = await fetch(`http://localhost:5050/api/flashcards/${setId}`,{
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      console.log("set fetch result: "+JSON.stringify(response));
      setSet(data);
      console.log("there are "+data.cards.length+" cards in this set");
    };
    fetchSet();
  }, [setId]);

  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % set.cards.length);
    setFlipped(false);
  };

  const prevCard = () => {
    setCurrentCardIndex((prevIndex) => {
      // when current index is 0, move to the last card
      if (prevIndex === 0) {
        return set.cards.length - 1;
      } else {
        return prevIndex - 1;
      }
    });
    setFlipped(false);
  };

  const flipCard = () => {
    setFlipped((prev) => !prev);
  };

  if (!set) return <div className="loading">Loading...</div>;

  const currentCard = set.cards[currentCardIndex];
  console.log(currentCardIndex)

  return (
    <div className="white-container">
      <h2>Reviewing: {set.title}</h2>
      {/* Conditionally apply background color for favorites */}
      <div
        onClick={flipCard}
        className={currentCard.isFavorite ? "favorite-card" : "card"}
      >
        {flipped ? (
          <div>
            <h4>Vocab Word:</h4>
            <p>{currentCard.back}</p>
          </div>
        ) : (
          <div>
            <h4>Definition:</h4>
            <p>{currentCard.front}</p>
          </div>
        )}
      </div>
      <div className="card-review-navigation">
        <button onClick={prevCard} style={{ width: "8rem" }}>
          Previous Card
        </button>
        <p>
          {currentCardIndex + 1} / {set.cards.length}
        </p>
        <button onClick={nextCard} style={{ width: "8rem" }}>
          Next Card
        </button>
      </div>
    </div>
  );  
};

export default FlashcardReview;