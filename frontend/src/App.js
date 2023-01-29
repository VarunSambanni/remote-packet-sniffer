import './App.css';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import LinearProgress from '@mui/material/LinearProgress';

function App() {

  const [data, setData] = useState([]);
  const [counts, setCounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [packetType, setPacketType] = useState('*');

  if (localStorage.getItem("startFlag") === null) {
    localStorage.setItem("startFlag", "N");
  }

  if (localStorage.getItem("fetchInterval") == null) {
    localStorage.setItem("fetchInterval", 1);
  }

  const [countsDataAll, setCountsDataAll] = useState([]);
  const [countsDataTCP, setCountsDataTCP] = useState([]);
  const [countsDataUDP, setCountsDataUDP] = useState([]);
  const [countsDataIP, setCountsDataIP] = useState([]);
  const [countsDataIPv6, setCountsDataIPv6] = useState([]);


  useEffect(() => { // Runs every second, and refreshes the page if 'startFlag' -> Y
    const interval = setInterval(() => {
      console.log("Here ", parseInt(localStorage.getItem("fetchInterval")));
      console.log("startFlag ", localStorage.getItem("startFlag"));
      if (localStorage.getItem("startFlag") == "Y") {
        setRefresh(refresh => !refresh);
      }
    }, 1000 * parseInt(localStorage.getItem("fetchInterval")));
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    let filteredData = [];
    fetch('http://localhost:5000/packets', {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success == false) {
          console.log("Error fetching packets");
        }
        else {
          console.log(data.data);

          if (packetType === '*') {
            data.data.reverse();
            setData(data.data);
          }
          else {
            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i].layers.includes(packetType) == true) {
                filteredData.push(data.data[i]);
              }
            }
            filteredData.reverse();
            setData(filteredData);
          }
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log("Error fetching packets");
      });

    fetch('http://localhost:5000/counts', {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        if (data.success == false) {
          console.log("Error fetching counts");
        }
        else {
          let countsDataAllTemp = [], countsDataTCPTemp = [], countsDataUDPTemp = [], countsDataIPTemp = [], countsDataIPv6Temp = [];
          for (let i = 0; i < data.data.length; i++) {
            countsDataAllTemp.push({ time: data.data[i].time, count: data.data[i].counts[4] - data.data[0].counts[4] });
            countsDataTCPTemp.push({ time: data.data[i].time, count: data.data[i].counts[0] - data.data[0].counts[0] });
            countsDataUDPTemp.push({ time: data.data[i].time, count: data.data[i].counts[1] - data.data[0].counts[1] });
            countsDataIPTemp.push({ time: data.data[i].time, count: data.data[i].counts[2] - data.data[0].counts[2] });
            countsDataIPv6Temp.push({ time: data.data[i].time, count: data.data[i].counts[3] - data.data[0].counts[3] });
          }
          console.log(countsDataAllTemp);
          setCountsDataAll(countsDataAllTemp);
          setCountsDataTCP(countsDataTCPTemp);
          setCountsDataUDP(countsDataUDPTemp);
          setCountsDataIP(countsDataIPTemp);
          setCountsDataIPv6(countsDataIPv6Temp);
          setCounts(data.data);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log("Error fetching packets");
      });


  }, [packetType, refresh]);

  const handleChange = (e) => {
    setPacketType(e.target.value);
  }

  const fetchIntervalHandleChange = (e) => {
    localStorage.setItem("fetchInterval", e.target.value);
    window.location.replace('/');
  }

  const clearHandler = () => {
    setIsLoading(true);
    fetch('http://localhost:5000/clear', {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        if (data.success == false) {
          console.log("Error clearing DB");
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log("Error clearing DB");
      });
    setCountsDataAll([]);
    setCountsDataTCP([]);
    setCountsDataUDP([]);
    setCountsDataIP([]);
    setCountsDataIPv6([]);
    window.location.replace('/');
    setRefresh(!refresh);
  }

  const startHandler = () => {
    localStorage.setItem("startFlag", "Y");
    setRefresh(refresh => !refresh)
  }

  const stopHandler = () => {
    localStorage.setItem("startFlag", "N");
    setRefresh(refresh => !refresh)
  }


  return (
    <div className="App">

      <div className='toolBar'>
        <button className='button' onClick={startHandler} >SNIFF</button>
        <button className='button' onClick={stopHandler}>STOP</button>
        <button className='button' onClick={clearHandler}>CLEAR</button>
      </div>

      <div className='messageContainer'>
        <div style={{ minHeight: '2em', color: 'white' }}>
          {isLoading ? <LinearProgress sx={{ '& .MuiLinearProgress-bar': { backgroundColor: 'black' }, backgroundColor: 'white' }} /> : ''}
        </div>
        {localStorage.getItem("startFlag") === "Y" ? <div>Fetching packet data... </div> : <div>Stopped</div>}
      </div>

      <div className='graphsContainer'>
        <div className='graph'>
          <div className='graphLabel'>Packets vs Time</div>
          <LineChart width={280} height={280} data={countsDataAll}>
            <Line type="monotone" dataKey="count" stroke="#8884d8" dots={true} />
            <XAxis stroke='white' dataKey="time" />
            <YAxis stroke='white' />
          </LineChart>
        </div>
        <div className='graph'>
          <div className='graphLabel'>TCP Packets vs Time</div>
          <LineChart width={280} height={280} data={countsDataTCP}>
            <Line type="monotone" dataKey="count" stroke="#8884d8" dots={true} />
            <XAxis stroke='white' dataKey="time" />
            <YAxis stroke='white' />
          </LineChart>
        </div>
        <div className='graph'>
          <div className='graphLabel'>UDP Packets vs Time</div>
          <LineChart width={280} height={280} data={countsDataUDP}>
            <Line type="monotone" dataKey="count" stroke="#8884d8" dots={true} />
            <XAxis stroke='white' dataKey="time" />
            <YAxis stroke='white' />
          </LineChart>
        </div>
        <div className='graph'>
          <div className='graphLabel'>IP Packets vs Time</div>
          <LineChart width={280} height={280} data={countsDataIP}>
            <Line type="monotone" dataKey="count" stroke="#8884d8" dots={true} />
            <XAxis stroke='white' dataKey="time" />
            <YAxis stroke='white' />
          </LineChart>
        </div>
        <div className='graph'>
          <div className='graphLabel'>IPv6 Packets vs Time</div>
          <LineChart title="graph" width={280} height={280} data={countsDataIPv6}>
            <Line type="monotone" dataKey="count" stroke="#8884d8" dots={true} />
            <XAxis stroke='white' dataKey="time" />
            <YAxis stroke='white' />
          </LineChart>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div >
          <div style={{ display: 'flex' }}>
            <div className='selectLabel'>Packet type : </div>
            <select className='selectField' value={packetType} onChange={handleChange}>
              <option value={"*"}>*</option>
              <option value={"TCP"}>TCP</option>
              <option value={"UDP"}>UDP</option>
              <option value={"IP"}>IP</option>
              <option value={"IPv6"}>IPv6</option>
            </select>
          </div>
          <div style={{ display: 'flex' }}>
            <div className='selectLabel'>Fetch Interval :</div>
            <select className='selectField' value={(localStorage.getItem("fetchInterval"))} onChange={fetchIntervalHandleChange}>
              <option value={0}>Live</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
        </div>
        <div className='selectLabel' style={{ height: 'fit-content', padding: '0.4em' }}>Packets : {counts.length > 0 ? counts[counts.length - 1].counts[4] : 0}</div>
        <div className='counts'>
          <table>
            <tr>
              <th>Packet-Type</th>
              <th>Count</th>
            </tr>
            <tr>
              <td>TCP</td>
              <td>{counts.length > 0 ? counts[counts.length - 1].counts[0] : 0}</td>
            </tr>
            <tr>
              <td>UDP</td>
              <td>{counts.length > 0 ? counts[counts.length - 1].counts[1] : 0}</td>
            </tr>
            <tr>
              <td>IP</td>
              <td>{counts.length > 0 ? counts[counts.length - 1].counts[2] : 0}</td>
            </tr>
            <tr>
              <td>IPv6</td>
              <td>{counts.length > 0 ? counts[counts.length - 1].counts[3] : 0}</td>
            </tr>
          </table>
        </div>
      </div>
      <div className='dataContainer'>
        {data.map((packet, index) => {
          return <pre key={index} className='packetContainer'>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1em 0em', margin: '0em 0em' }}>
              <div className='packetField'>
                {packet.packet}
              </div>
              <div className='timeStampField'>
                Time: {packet.timeStamp}
              </div>
            </div>
            <div className='layersField'>
              Layers:
              <hr />
              <div style={{ maxHeight: '6em', overflow: 'auto' }}>
                {
                  packet.layers.map((layer, index) => {
                    return <p key={index}>{layer}</p>
                  })
                }
              </div>
            </div>
            <div className='dataField'>
              {packet.data}
            </div>
          </pre>
        })}
      </div>
    </div >
  );
}

export default App;
