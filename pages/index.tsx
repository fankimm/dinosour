import { Button, Input, Form } from "antd";
import type { NextPage } from "next";
import { useEffect, useState, createRef } from "react";
import io from "socket.io-client";
interface IHistory {
  name: string;
  message: string;
  time: string;
  color: string;
}

const socket = io();
const Home: NextPage = () => {
  const [form] = Form.useForm();
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [history, setHistory] = useState<IHistory[]>([]);
  const [profileColor, setProfileColor] = useState("");
  const [id, setId] = useState("");
  const scrollRef = createRef<HTMLDivElement>();
  const inputRef = createRef<HTMLInputElement>();
  useEffect(() => {
    console.log("useeffect");
    // setUserName(Math.floor(Math.random() * 1000).toString());
    const connectToSocket = async () => {
      const res = await fetch("/api/socketio");
      const res2json = await res.json();
      // setProfileColor(res2json.color);
      // setId(res2json.userId);
      // setUserName(res2json.userId.slice(0, 4));
    };;
    connectToSocket();
    return () => {
      socket.emit("disconnection");
    };
  }, []);
  socket.on("profile", (data) => {
    // console.log(data);
    console.log(userName);

    if (!userName) {
      setProfileColor(data.color);
      setUserName(data.id);
    }
  });
  socket.on("message", (data) => {
    const tempHistory = [...history, data];
    setHistory([...tempHistory]);
  });
  useEffect(() => {
    scrollRef &&
      scrollRef.current &&
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
      });
  }, [history, scrollRef]);
  return (
    <div>
      <Button
        onClick={() => {
          console.log(userName);
        }}
      >
        dbg
      </Button>
      <div
        style={{
          height: "500px",
          overflow: "scroll",
          padding: "20px",
          background: "#ededed",
        }}
      >
        {history.map((data, idx) => {
          const { name, message, time } = data;
          const splitTime = time.split(" ");
          const key = data + idx.toString();
          return (
            <div
              key={key}
              style={{
                marginBottom: "10px",
                display: "flex",
                alignContent: "center",
                justifyContent: name === userName ? "flex-end" : "flex-start",
              }}
              ref={scrollRef}
            >
              <div
                style={{
                  background: `rgb(${data.color})`,
                  // background: `rgb(41, 191, 46)`,
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  marginRight: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {name.slice(-1)}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "11px", marginBottom: "4px" }}>
                  {name}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <div
                    style={{
                      padding: "4px 10px",
                      backgroundColor: name === userName ? "#FEE500" : "white",
                      color: "black",
                      borderRadius: "10px",
                      fontSize: "14px",
                      marginRight: "4px",
                    }}
                  >
                    {message}
                  </div>
                  <div style={{ fontSize: "10px", color: "adadad" }}>{`${
                    splitTime[1] === "AM" ? "오전" : "오후"
                  } ${splitTime[0]}`}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex" }}>
        <Form form={form}>
          <div style={{ display: "flex" }}>
            <Form.Item
              name="messageInput"
              style={{ marginRight: "20px", width: "200px" }}
            >
              <Input
                style={{ borderRadius: "10px" }}
                ref={inputRef}
                size="small"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    socket.emit("message", { name: userName, message });
                    form.resetFields();
                    inputRef.current.focus();
                  }
                }}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                size="small"
                type="primary"
                shape="round"
                onClick={() => {
                  if (!userName) {
                    alert("이름을 입력해주세요");
                    return;
                  }
                  socket.emit("message", { name: userName, message });
                  form.resetFields();
                  inputRef.current.focus();
                }}
              >
                전송
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Home;
