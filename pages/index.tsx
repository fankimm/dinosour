import { connect } from "http2";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import io from "socket.io-client";

// const socket = io.connect("http://localhost:4000");
interface IHistory {
  name: string;
  message: string;
}
const socket = io();
const Home: NextPage = () => {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [history, setHistory] = useState<IHistory[]>([]);

  useEffect(() => {
    console.log("useeffect");
    const connectToSocket = async () => {
      await fetch("/api/socketio");
    };
    connectToSocket();
  }, []);

  socket.on("message", (data) => {
    const tempHistory = [...history, data];
    setHistory(tempHistory);
  });

  return (
    <div>
      {history.map((data, idx) => {
        const { name, message } = data;
        const key = name + idx;
        return (
          <div key={key}>
            <span
              style={{ color: name === "맥북" ? "orange" : "blue" }}
            >{`${name} : `}</span>
            <span style={{ color: name === "맥북" ? "orange" : "blue" }}>
              {message}
            </span>
          </div>
        );
      })}
      <div>
        {`이름 : `}
        <input
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></input>
      </div>
      <div>
        {`메시지 : `}
        <input
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        ></input>
        <button
          onClick={() => {
            if (!name) {
              alert("이름을 입력해주세요");
              return;
            }
            socket.emit("message", { name, message });
            // alert("메시지 전송 성공");
          }}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default Home;
