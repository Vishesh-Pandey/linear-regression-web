import { useState } from "react";
import "./App.css";

function App() {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [coeff, setCoeff] = useState<number[]>([]);
  const [intercept, setIntercept] = useState<number>(0);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          border: "1px solid black",
        }}
        onClick={(e) => {
          const point = {
            x: e.clientX,
            y: e.clientY,
          };
          const currentPoints = [...points, point];
          setPoints((prevPoints) => [...prevPoints, point]);
          if (currentPoints.length < 2) return;
          fetch("http://127.0.0.1:5000/bestfitline", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: currentPoints.map((point) => [point.x, point.y]),
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("Data : ", data);
              setCoeff(data.coeff);
              setIntercept(data.intercept);
            })
            .catch((err) => console.error(err));
        }}
      >
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {points.map((point, index) => (
            <circle key={index} cx={point.x} cy={point.y} r={5} fill="black" />
          ))}
          {!coeff.length ? null : (
            <line
              x1={0}
              y1={coeff[0] * 0 + intercept}
              x2={500}
              y2={coeff[0] * 500 + intercept}
              style={{ stroke: "red", strokeWidth: 2 }}
            />
          )}
        </svg>
      </div>
      <div>
        <p>Click on the graph to add points</p>
        <p> coeff: {coeff} </p>
      </div>
    </>
  );
}

export default App;
