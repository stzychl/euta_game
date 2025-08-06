import React, { useState } from 'react';
import axios from "axios";
import './style.css';
import chibi from '../assets/chibi.svg';
axios.defaults.baseURL = 'https://euta.vercel.app'; // Or use environment variable in production
axios.defaults.withCredentials = true;

function Game() {
  const [question, setQuestion] = useState('');
  const [started, setStarted] = useState(false);
  const [won, setWon] = useState(false);
  const [name, setName] = useState('');
  const [img, setImg] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false); // Start as false



  const start = async () => {
    try {
      setLoading(true);
      const data = await axios.get('https://euta.vercel.app/game');
      setQuestion(data.data.question);
      setStarted(true);
    } catch (e) {
      window.alert(e);
    } finally {
      setLoading(false);
    }
  };

  const interactResponse = async (value) => {
    try {
      setLoading(true);
      const res = await axios.post('https://euta.vercel.app/startGame', {
        answer: value
      });

      setQuestion(res.data.question);
console.log(res.data)
      if (res.data.suggestion_name) {
        setDesc(res.data.suggestion_desc);
        setName(res.data.suggestion_name);
        setImg(res.data.suggestion_photo);
        setWon(true);
      }
    } catch (e) {
      window.alert("Something went wrong!", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fancy-title">Euta!</div>

      {loading && <div className="loader"></div>}

      {!won && !loading &&
        <div id='game'>
          {started && <div className="ques">QUESTION : {question}</div>}
          <div>
            {!started ? (
              <div className="starscreen">
                <img height={200} id='chibi' src={chibi} alt="chibi" />
                <button id='startBtn' onClick={start}>START</button>
                <br />
                <button onClick={() => window.alert('This is a game in which based on your response, I will guess the character, object, etc. you are thinking of.')}>
                  What's Euta?
                </button>
              </div>
            ) : (
              <span className="responseBtns">
                <button value='0' className='responseBtn' onClick={(e) => interactResponse(e.target.value)}> Yes</button>
                <button value='1' className='responseBtn' onClick={(e) => interactResponse(e.target.value)}> No</button>
                <button value='2' className='responseBtn' onClick={(e) => interactResponse(e.target.value)}> Don't know</button>
                <button value='3' className='responseBtn' onClick={(e) => interactResponse(e.target.value)}> Probably</button>
                <button value='4' className='responseBtn' onClick={(e) => interactResponse(e.target.value)}> Probably not</button>
              </span>
            )}
          </div>
        </div>
      }

      {won && !loading &&
        <div className='results'>
          <main>
            <h2>RESULT</h2>
            <div className="card">
              <img src={img} alt="NO IMG FOUND" />
              <div id='resultName'><h5>{name}</h5></div>
              <div id='resultDesc'>{desc}</div>
            </div>
          </main>
        </div>
      }
    </>
  );
}

export default Game;
