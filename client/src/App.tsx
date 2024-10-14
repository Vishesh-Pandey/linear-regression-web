import { useState } from "react";
import "./App.css";

function App() {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [coeff, setCoeff] = useState<number[]>([]);
  const [intercept, setIntercept] = useState<number>(0);

  const handleNewDataPoint = (e: React.MouseEvent<HTMLDivElement>) => {
    const point = {
      x: e.clientX,
      y: e.clientY,
    };
    const currentPoints = [...points, point];
    setPoints((prevPoints) => [...prevPoints, point]);
    if (currentPoints.length < 2) return;
    // if running program on github codespaces then make port public from below terminal ( port ) option and use the link given there that looks like this :
    // https://supreme-garbanzo-pvxpxj7jpf996g-5000.app.github.dev/bestfitline
    // The flask backend is hosted on https://ml-models-backend-flask.vercel.app
    fetch("https://ml-models-backend-flask.vercel.app/bestfitline", {
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
        setCoeff(data.coeff);
        setIntercept(data.intercept);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div
        style={{
          height: "100vh",
          width: "100%",
          backgroundColor: "black",
          display: "flex",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            border: "1px solid black",
            backgroundColor: "green",
            width: "50%",
          }}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            handleNewDataPoint(e);
          }}
        >
          <svg
            style={{
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
            {points.map((point, index) => {
              const lineY = coeff[0] * point.x + intercept;
              const error = Math.abs(lineY - point.y);
              return (
                <>
                  <rect
                    key={index}
                    x={point.x - 2}
                    y={Math.min(point.y, lineY) - 1}
                    width={4}
                    height={Math.abs(lineY - point.y) + 2}
                    fill="rgba(255, 0, 0, 0.3)"
                  />
                  <text
                    x={point.x}
                    y={(lineY + point.y) / 2}
                    textAnchor="middle"
                    fontSize={12}
                    fill="black"
                    fontWeight="bold"
                    style={{ pointerEvents: "none" }}
                  >
                    {Math.round(error * 100) / 100}
                  </text>
                </>
              );
            })}
          </svg>
        </div>

        <div style={{ width: "50%", backgroundColor: "white" }}>
          <p>Coef : {coeff}</p> <p>Intercept : {intercept}</p>
        </div>
      </div>
    </>
  );
}

export default App;
