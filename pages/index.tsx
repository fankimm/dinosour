import type { NextPage } from 'next'
import { useEffect, useState } from "react";
import io from "socket.io-client";

// const socket = io.connect("http://localhost:4000");

const Home: NextPage = () => {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const socket = io();
  useEffect(() => {
    fetch("/api/socketio").finally(() => {
      socket.on("connect", () => {
        console.log("connect");
        socket.emit("hello");
      });

      socket.on("hello", (data) => {
        console.log("hello", data);
      });

      socket.on("a user connected", () => {
        console.log("a user connected");
      });

      socket.on("disconnect", () => {
        console.log("disconnect");
      });
    });
  }, [socket]);

  return (
    <div>
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
      <button
        onClick={() => {
          fetch("/api/socketio").finally(() => {
            socket.on("connect", () => {
              console.log("connect");
              socket.emit("hello");
            });

            socket.on("hello", (data) => {
              console.log("hello", data);
            });

            socket.on("a user connected", () => {
              console.log("a user connected");
            });

            socket.on("disconnect", () => {
              console.log("disconnect");
            });
          });
        }}
      >
        연결
      </button>
    </div>
  );
};

export default Home
