import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const FlashcardQuiz = () => {
  const [set, setSet] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const { setId } = useParams();
  const [currentAnswerIndices, setCurrentAnswerIndices] = useState([]);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [answerIndex, setAnswerIndex] = useState(null); // the correct card's index in currentAnswerIndices, NOT set.cards
  const navigate = useNavigate();
  const [hasClicked, setHasClicked] = useState(false);

  // state variables for accuracy tracking
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    const fetchSet = async () => {
      const response = await fetch(`http://localhost:5050/api/flashcards/${setId}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setSet(data);

    };
    fetchSet();
  }, [setId]);

  useEffect(() => {
    if (set) {
      if (set.cards.length < 4) {
        alert("Sorry, the set needs at least 4 cards for quiz mode");
        navigate(`/`);
      } else {
        if (currentAnswerIndices.length===0) getPossibleAnswers(); // get answers only if the set is valid
      }
    }
  }, [set, navigate]);

  useEffect(() => {
    getPossibleAnswers();
  }, [currentCardIndex])


  const getPossibleAnswers = () => {
    if (!set) return; // check set exists
    const answerSet = new Set();
    answerSet.add(currentCardIndex);
    while (answerSet.size < 4) {
        answerSet.add(Math.floor(Math.random() * set.cards.length));
    }
    // cite https://stackoverflow.com/questions/20069828/how-to-convert-set-to-array
    const answerIndices = Array.from(answerSet);
    console.log("answerSet: ");
    setCurrentAnswerIndices(answerSet);
    
    // pick a random index to swap the correct answer to
    const correctIndex = Math.floor(Math.random() * 4); // random int from 0 to 3
    const temp = answerIndices[correctIndex];
    answerIndices[correctIndex] = currentCardIndex;
    answerIndices[0] = temp;
    setAnswerIndex(correctIndex);
    console.log("currentCardIndex: "+currentCardIndex);
    setCurrentAnswerIndices(answerIndices);
    console.log("answerIndices: ");
    console.log(answerIndices);

  };

  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % set.cards.length);
    setClickedIndex(null); // reset card divs to lightgray
    setAnswerIndex(null); // reset answer index for next round
  };

  const handleDivClick = (index) => {
    if (!hasClicked) {
      setHasClicked(true);
  
      // Get the card that was actually clicked
      const clickedCard = set.cards[currentAnswerIndices[index]];
      
      // Get the correct card
      const correctCard = set.cards[currentAnswerIndices[answerIndex]];
  
      console.log("Clicked card:", clickedCard);
      console.log("Correct card:", correctCard);
  
      setClickedIndex(index);
  
      // Check if the clicked card matches the correct card
      const isCorrect = clickedCard === correctCard;
      
      if (isCorrect) {
        setCorrectAnswers((prevCorrect) => prevCorrect + 1);
      }
      setTotalAnswers((prevTotal) => prevTotal + 1);
  
      // cite https://builtin.com/software-engineering-perspectives/javascript-sleep
      setTimeout(() => {
        nextCard();
        setHasClicked(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (totalAnswers > 0) {
      const newAccuracy = (correctAnswers / totalAnswers) * 100;
      setAccuracy(newAccuracy);
    }
  }, [correctAnswers, totalAnswers]);

  if (!set) return <div className="loading">Loading...</div>

  const currentCard = set.cards[currentCardIndex];
  const letterArr = ['a', 'b', 'c', 'd']

  return (
    <div className="white-container">
      <h2>Quizzing: {set.title}</h2>
      <p>Correct Answers: {correctAnswers} / {totalAnswers}</p>
      <p>Accuracy This Round: {accuracy.toFixed(2)}%</p>
      <div className="answer-container">
        <div className="card-content">
          <h3>{currentCard.isFavorite ? '⭐ ' : ''}{currentCard.front}</h3>
          {[0,1,2,3].map((index) => (
            <div
              key={index}
              onClick={() => handleDivClick(index)}
              style={{
                // cite https://en.wikipedia.org/wiki/Ternary_conditional_operator
                backgroundColor: (index === answerIndex && hasClicked)
                  ? '#3ccf6c'
                  : (index === clickedIndex && hasClicked)
                  ? "#e43611"
                  : 'lightgray',
              }}
              className="answer-div"
            >
              <p>
                <b>{letterArr[index]}. </b> {set.cards[[currentAnswerIndices[index]]]?.back}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlashcardQuiz;
