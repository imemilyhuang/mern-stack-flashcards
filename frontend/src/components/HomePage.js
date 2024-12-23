

// cite https://github.com/mongodb-developer/mern-stack-example/blob/main/mern/client/src/components/RecordList.jsx for 

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FlashcardSet = (props) => (
  <div className="card-form" style={{padding: "1rem", borderStyle: "solid", borderWidth: 2, borderColor: "#dbdbdb", borderRadius: 6, marginBottom: "2rem"}}>
    <h4>{props.flashcardset.title}</h4>
    {props.flashcardset.description}
    <div style={{display: "flex", flexDirection: "row", gap: 15}}>
      <button type="button">
        <Link to={`/review/${props.flashcardset._id}`} style={{color: "white"}}>
          Review
        </Link>
      </button>
      <button type="button">
        <Link to={`/quiz/${props.flashcardset._id}`} style={{color: "white"}}>
          Quiz
        </Link>
      </button>
      <button type="button">
        <Link to={`/edit/${props.flashcardset._id}`} style={{color: "white"}}>
          Edit
        </Link>
      </button>
      <button
        type="button"
        onClick={() => {
          props.deleteSet(props.flashcardset._id);
        }}
        style={{color: "white"}}
      >
        Delete
      </button>
    </div>
  </div>
);

export default function SetList() {
  const [flashcardsets, setSets] = useState([]);

  // this method fetches the sets from the database
  useEffect(() => {
    async function getSets() {
      let userId = localStorage.getItem('userId');
       const response = await fetch(`http://localhost:5050/api/flashcards/user/${userId}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const flashcardsets = await response.json();
      setSets(flashcardsets);
    }
    getSets();
    return;
  }, [flashcardsets.length]);

  // this method will delete a set
  async function deleteSet(id) {
    try {
    const response = await fetch(`http://localhost:5050/api/flashcards/${id}`, {
      method: "GET",
    });  
      if (!response.ok) {
        throw new Error('Failed to create flashcard set');
      }

      const data = await response.json();
      if (data._id) {
        try {
          await fetch(`http://localhost:5050/api/flashcards/deleteSet/${data._id}`, {
            method: "DELETE",
            body: JSON.stringify({setId: data._id})
          });
        }
        catch (error) {
          console.error(error);
        alert('Error deleting set when posting');
        }
      } else {
        alert('Error with ID when deleting set');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting set');
    }
    const newSets = flashcardsets.filter((el) => el._id !== id);
    setSets(newSets);
  }

  // map sets to table
  function setList() {
    return flashcardsets.map((flashcardset) => {
      return (
        <FlashcardSet
          flashcardset={flashcardset}
          deleteSet={() => deleteSet(flashcardset._id)}
          key={flashcardset._id}
        />
      );
    });
  }

  // show table of user's sets
  return (
    <div>
      <div className="white-container" style={{paddingBottom: "1rem"}}>
        <h2>Your Flashcard Sets</h2>
          <div style={{width: "100%"}}>
            {
              flashcardsets.length === 0 ?
                <p className="no-flashcards">
                  You don't have any flashcard sets yet.
                </p>
              :
              setList()
            }
          </div>
      </div>
    </div>
  );
}