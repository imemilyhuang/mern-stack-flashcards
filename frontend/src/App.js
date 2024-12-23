import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.scss';

import LogIn from './components/LogIn.js';
import Register from './components/Register';
import CreateFlashcardSet from './components/CreateFlashcardSet';
import FlashcardReview from './components/FlashcardReview';
import FlashcardQuiz  from './components/FlashcardQuiz.js';
import HomePage from './components/HomePage';
import FlashcardSet from './components/FlashcardSet.js';

import { AuthContext } from './context/AuthContext';

const App = () => {
  const [user, setUser] = useState(null);

  // check for user authentication status
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // handle user logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <div>
          <nav className="navbar">
            <ul>
              {user ? (
                <div className="navbar">
                  <li style={{width: "12rem"}}>
                    <Link to="/">Your Flashcard Sets</Link>
                  </li>
                  <li style={{width: "8rem", marginRight: '2rem'}}>
                    <Link to="/create">Create a Set</Link>
                  </li>
                  <button onClick={handleLogout} style={{width: "6rem"}}>Log Out</button>
                  <li>
                    {/* <Link to="/review">Review Flashcards</Link> */}
                  </li>
                </div>
              ) : (
                <div class="navbar">
                  <li>
                    <Link to="/login">Log In</Link>
                  </li>
                  <li>
                    <Link to="/register">Register</Link>
                  </li>
                </div>
              )}
            </ul>
          </nav>

          <main>
            <Routes>
              <Route path="/login" element={<LogIn />} />
              <Route path="/register" element={<Register />} />
              {/* Redirect to login if user is not authenticated */}
              <Route path="/" element={user ? <HomePage /> : <LogIn />} />
              <Route path="/edit/:setId" element={user ? <FlashcardSet /> : <LogIn />} />
              <Route path="/create" element={user ? <CreateFlashcardSet /> : <LogIn />} />
              <Route path="/review/:setId" element={user ? <FlashcardReview /> : <LogIn />} />
              <Route path="/quiz/:setId" element={user ? <FlashcardQuiz /> : <LogIn />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;