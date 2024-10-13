import { useState } from "react";
import "./App.css";

function App() {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [coeff, setCoeff] = useState<number[]>([]);
  const [intercept, setIntercept] = useState<number>(0);

  return (
    <>
      <div style={{ height: "100vh", width: "100%" }}>
        <div style={{ width: "50%" }}>
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
              // if running program on github codespaces then make port public from below terminal ( port ) option and use the link given there that looks like this :
              // https://supreme-garbanzo-pvxpxj7jpf996g-5000.app.github.dev/bestfitline
              fetch(
                "https://supreme-garbanzo-pvxpxj7jpf996g-5000.app.github.dev/bestfitline",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    data: currentPoints.map((point) => [point.x, point.y]),
                  }),
                }
              )
                .then((res) => res.json())
                .then((data) => {
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
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r={5}
                  fill="white"
                />
              ))}
              {!coeff.length ? null : (
                <line
                  x1={0}
                  y1={coeff[0] * 0 + intercept}
                  x2={1400}
                  y2={coeff[0] * 1400 + intercept}
                  style={{ stroke: "yellow", strokeWidth: 2 }}
                />
              )}
            </svg>
          </div>
        </div>
        <div style={{ width: "50%", backgroundColor: "yellow" }}></div>
      </div>
    </>
  );
}

export default App;
