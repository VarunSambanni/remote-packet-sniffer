import './App.css';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

function App() {

  const [data, setData] = useState([]);
  const [counts, setCounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [packetType, setPacketType] = useState('*');
  const [startFlag, setStartFlag] = useState(false);

  const [countsDataAll, setCountsDataAll] = useState([]);
  const [countsDataTCP, setCountsDataTCP] = useState([]);
  const [countsDataUDP, setCountsDataUDP] = useState([]);
  const [countsDataIP, setCountsDataIP] = useState([]);
  const [countsDataIPv6, setCountsDataIPv6] = useState([]);

  const startHandler = () => {
    setStartFlag(true);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('This will run every second!');
      console.log(startFlag)
      if (startFlag == true) {
        setRefresh(refresh => !refresh);
      }
      console.log('refresh ', refresh);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log('refreshed');
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
            setData(data.data);
          }
          else {
            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i].layers.includes(packetType) == true) {
                filteredData.push(data.data[i]);
              }
            }
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
          console.log("Here ", data.data);
          let countsDataAllTemp = [], countsDataTCPTemp = [], countsDataUDPTemp = [], countsDataIPTemp = [], countsDataIPv6Temp = [];
          for (let i = 0; i < data.data.length; i++) {
            countsDataAllTemp.push({ time: data.data[i].time, count: data.data[i].counts[4] });
            countsDataTCPTemp.push({ time: data.data[i].time, count: data.data[i].counts[0] });
            countsDataUDPTemp.push({ time: data.data[i].time, count: data.data[i].counts[1] });
            countsDataIPTemp.push({ time: data.data[i].time, count: data.data[i].counts[2] });
            countsDataIPv6Temp.push({ time: data.data[i].time, count: data.data[i].counts[3] });
          }
          console.log("HERE....")
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
        else {

        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log("Error clearing DB");
      });
    setRefresh(!refresh);
  }


  return (
    <div className="App">

      <div className='toolBar'>
        <button className='button' onClick={() => startHandler} >SNIFF</button>
        <button className='button' onClick={() => setStartFlag(false)} >STOP</button>
        <button className='button' onClick={clearHandler}>CLEAR</button>
      </div>

      <div className='messageContainer'>

      </div>

      <div className='graphsContainer'>
        <div className='graph'>
          <LineChart width={280} height={280} data={countsDataAll}>
            <Line type="monotone" dataKey="count" stroke="#8884d8" dots={true} />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="time" />
            <YAxis />
          </LineChart>
        </div>
        <div className='graph'>
          <LineChart width={280} height={280} data={countsDataTCP}>
            <Line type="monotone" dataKey="count" stroke="#8884d8" dots={true} />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="time" />
            <YAxis />
          </LineChart>
        </div>
        <div className='graph'>
          <LineChart width={280} height={280} data={countsDataUDP}>
            <Line type="monotone" dataKey="count" stroke="#8884d8" dots={true} />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="time" />
            <YAxis />
          </LineChart>
        </div>
        <div className='graph'>
          <LineChart width={280} height={280} data={countsDataIP}>
            <Line type="monotone" dataKey="count" stroke="#8884d8" dots={true} />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="time" />
            <YAxis />
          </LineChart>
        </div>
        <div className='graph'>
          <LineChart title="graph" width={280} height={280} data={countsDataIPv6}>
            <Line type="monotone" dataKey="count" stroke="#8884d8" dots={true} />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="time" />
            <YAxis />
          </LineChart>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <select className='selectField' value={packetType} onChange={handleChange}>
          <option value={"*"}>*</option>
          <option value={"TCP"}>TCP</option>
          <option value={"UDP"}>UDP</option>
          <option value={"IP"}>IP</option>
          <option value={"IPv6"}>IPv6</option>
        </select>
        {counts.length > 0 &&
          <div className='counts'>
            <table>
              <tr>
                <th>Packet-Type</th>
                <th>Count</th>
              </tr>
              <tr>
                <td>TCP</td>
                <td>{counts[counts.length - 1].counts[0]}</td>
              </tr>
              <tr>
                <td>UDP</td>
                <td>{counts[counts.length - 1].counts[1]}</td>
              </tr>
              <tr>
                <td>IP</td>
                <td>{counts[counts.length - 1].counts[2]}</td>
              </tr>
              <tr>
                <td>IPv6</td>
                <td>{counts[counts.length - 1].counts[3]}</td>
              </tr>
            </table>
          </div>
        }
      </div>
      <div className='dataContainer'>
        {data.map((packet, index) => {
          return <pre key={index} className='packetContainer'>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6em' }}>
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
