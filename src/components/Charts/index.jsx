import React from "react";
import "./Charts.css";
import { Chart } from "react-google-charts";
import { useState } from "react";
import JSON5 from "json5";
import Button from "../Button";
import TextArea from "../TextArea";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Charts() {
  const [text, setText] = useState([]);
  const [data, setData] = useState([
    ["Time", "L1", "L2"],
    [0, 0, 0],
    [1, 1, 1],
  ]);

  let convertedCode, dataPoints, typeStart, typeSpan, typeStop;
  let typeData = [];

  const valor = `{type: 'start', timestamp: 1519862400000,select: ['min_response_time', 'max_response_time'],group: ['os', 'browser']}
  {type: 'span', timestamp: 1519862400000, begin: 1519862400000, end: 1519862460000}
  {type: 'data', timestamp: 1519862400000, os: 'linux', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.3}
  {type: 'data', timestamp: 1519862400000, os: 'mac', browser: 'chrome', min_response_time: 0.2, max_response_time: 1.2}
  {type: 'data', timestamp: 1519862400000, os: 'mac', browser: 'firefox', min_response_time: 0.3, max_response_time: 1.2}
  {type: 'data', timestamp: 1519862400000, os: 'linux', browser: 'firefox', min_response_time: 0.1, max_response_time: 1.0}
  {type: 'data', timestamp: 1519862460000, os: 'linux', browser: 'chrome', min_response_time: 0.2, max_response_time: 0.9}
  {type: 'data', timestamp: 1519862460000, os: 'mac', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.0}
  {type: 'data', timestamp: 1519862460000, os: 'mac', browser: 'firefox', min_response_time: 0.2, max_response_time: 1.1}
  {type: 'data', timestamp: 1519862460000, os: 'linux', browser: 'firefox', min_response_time: 0.3, max_response_time: 1.4}
  {type: 'stop', timestamp: 1519862460000}`;

  function Converter() {
    convertedCode = "[" + text.split("\n") + "]";
    convertedCode = JSON5.parse(convertedCode);
    dataPoints = convertedCode;
  }

  function AddStart(point) {
    typeStart = {
      type: point.type,
      timestamp: point.timestamp,
      select: point.select,
      group: point.group,
    };
    console.log(typeStart);
  }

  function AddSpan(point) {
    typeSpan = {
      type: point.type,
      timestamp: point.timestamp,
      begin: point.begin,
      end: point.end,
    };
    console.log(typeSpan);
  }

  function AddData(point) {
    for (let i = 0; i < typeData.length; i++) {
      let pt = typeData[i];
      if (CompareByGroup(pt, point)) {
        typeData[i] = AddBySelect(pt, point);
        return;
      }
    }
    typeData.push(point);
  }

  function CompareByGroup(point1, point2) {
    for (let i = 0; i < typeStart.group.length; i++) {
      let g = typeStart.group[i];
      if (point1[g] !== point2[g]) {
        return false;
      }
    }
    return true;
  }

  function AddBySelect(point1, point2) {
    for (let i = 0; i < typeStart.select.length; i++) {
      let s = typeStart.select[i];
      if (typeof point1[s] == typeof []) {
        point1[s].push(point2[s]);
      } else {
        point1[s] = [point1[s], point2[s]];
      }
    }
    return point1;
  }

  function AddStop(point) {
    typeStop = {
      type: point.type,
      timestamp: point.timestamp,
    };
    console.log(typeStop);
  }

  const TYPES = {
    start: AddStart,
    span: AddSpan,
    data: AddData,
    stop: AddStop,
  };

  function DataFilterType() {
    typeData = [];
    for (let i = 0; i < dataPoints.length; i++) {
      let point = dataPoints[i];
      TYPES[point.type](point);
    }
  }

  function GetGroup(point) {
    let groups = [];
    for (let i = 0; i < typeStart.group.length; i++) {
      let g = typeStart.group[i];
      groups.push(point[g]);
    }
    return groups.join(" ");
  }

  function DataGraphic() {
    let data_graphic = [["Time"]];
    typeData.forEach((dt) => {
      typeStart.select.forEach((select) => {
        data_graphic[0].push(GetGroup(dt) + " " + select);
        dt[select].forEach((y, index) => {
          data_graphic[index + 1]
            ? data_graphic[index + 1]?.push(y)
            : data_graphic.push([index, y]);
        });
      });
    });
    setData(data_graphic);
  }
  function SortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  function GroupSort() {
    dataPoints = SortByKey(dataPoints, "timestamp");
  }

  function GenerateChart() {
    // eslint-disable-next-line
    if (text == "") {
      toast.error("Enter data in the text field");
    } else {
      Converter();
      GroupSort();
      DataFilterType();
      DataGraphic();
    }
  }

  const options = {
    curveType: "function",
    legend: { position: "right" },
  };

  return (
    <div className="container">
      <h1>Gustavo Silva's Challenge</h1>
      <TextArea value={text} onChange={(e) => setText(e.target.value)} />
      <ToastContainer />
      <Chart
        chartType="LineChart"
        width="90%"
        height="400px"
        data={data}
        options={options}
      />
      <div>
        <Button name="Generate Chart" onClick={GenerateChart} />
        <Button name="Preset Value" onClick={() => setText(valor)} />
      </div>
    </div>
  );
}
