import './App.css';
import React, { useEffect, useState } from 'react'

function App() {

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:5000/packets', {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        if (data.success == false) {
          console.log("Error fetching packets");
        }
        else {
          console.log(data.data);
          setData(data.data);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log("Error fetching packets");
      })
  }, []);

  return (
    <div className="App">
      <div className='dataContainer'>
        {isLoading ? "Loading..." : ""}
        {data.map((packet, index) => {
          return <span className='packetContainer'>
            {packet.packet}
          </span>
        })}
      </div>
    </div >
  );
}

export default App;
