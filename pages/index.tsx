import React, { useState, useEffect, createRef } from 'react';
import SocketIOClient from 'socket.io-client';
import {
  Spin, Input, Form, Button,
} from 'antd';

interface IHistory {
  name: string;
  message: string;
  time: string;
  color: string;
  userName: string;
  id: string;
}

// component
function Index() {
  // connected flag
  const [id, setId] = useState<string>();
  const [name, setName] = useState<string>();
  const [connected, setConnected] = useState(false);
  const [color, setColor] = useState('');
  const [form] = Form.useForm();

  // init chat and message
  const [history, setHistory] = useState<IHistory[]>([]);
  const scrollRef = createRef<HTMLDivElement>();
  const sendMessage = () => {
    const fieldsValue = form.getFieldsValue();
    console.log(fieldsValue);

    const { message } = fieldsValue;
    if (message && name) {
      const data = {
        name,
        id,
        message,
        color,
      };
      fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      form.setFieldsValue({ message: '' });
    }
  };
  useEffect(() => {
    if (scrollRef && scrollRef.current
    ) {
      scrollRef.current.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [history, scrollRef]);
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    fetch('/api/getColor').then((res) => res.json()).then((res) => setColor(res.color));
    // connect to socket server
    const socket = SocketIOClient('', {
      path: '/api/socketio',
    });

    // log socket connection
    socket.on('connect', () => {
      const body = { name: form.getFieldValue('name'), type: 'alert', message: `${name}님이 입장하였습니다.` };
      fetch('/api/alert', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      console.log('SOCKET CONNECTED!', socket.id);
      setId(socket.id);
      setConnected(true);
    });

    // update chat on new message dispatched
    socket.on('message', (message: IHistory) => {
      history.push(message);
      setHistory([...history]);
    });

    // socket disconnet onUnmount if exists
    return () => {
      if (socket) {
        const body = {
          type: 'alert',
          name,
          message: `${name}님이 퇴장하였습니다 👋`,
        };
        fetch('/api/alert', {
          method: 'POST',
          body: JSON.stringify(body),
        });
        socket.disconnect();
      }
    };
  }, []);

  return (
    <Spin spinning={false}>
      <div>
        <div
          style={{
            height: '500px',
            overflow: 'scroll',
            padding: '20px',
            background: '#ededed',
          }}
        >
          {history
            && history.map((data, idx) => {
              if (data.type === 'alert') {
                return (
                  <div style={{
                    display: 'flex', justifyContent: 'center', margin: '10px 0', color: 'lightgray',
                  }}
                  >
                    <div>
                      {data.message}
                    </div>
                  </div>
                );
              }
              // const {
              //   name, message, time, id,
              // } = data;
              const splitTime = data.time.split(' ');
              const key = data + idx.toString();
              return (
                <div
                  key={key}
                  style={{
                    marginBottom: '10px',
                    display: 'flex',
                    alignContent: 'center',
                    justifyContent:
                      data.id === id ? 'flex-end' : 'flex-start',
                  }}
                  ref={scrollRef}
                >
                  <div
                    style={{
                      background: `rgb(${data.color})`,
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      marginRight: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {data.name?.slice(-1) ?? '이름'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '11px', marginBottom: '4px' }}>
                      {data.name}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                      }}
                    >
                      <div
                        style={{
                          padding: '4px 10px',
                          backgroundColor:
                            id === data.id ? '#FEE500' : 'white',
                          color: 'black',
                          borderRadius: '10px',
                          fontSize: '14px',
                          marginRight: '4px',
                        }}
                      >
                        {data.message}
                      </div>
                      <div style={{ fontSize: '10px', color: 'adadad' }}>
                        {`${
                          splitTime[1] === 'AM' ? '오전' : '오후'
                        } ${splitTime[0]}`}

                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div style={{ display: 'flex' }}>
          <Form form={form}>
            <div style={{ display: 'flex' }}>
              <Form.Item
                name="name"
                style={{ marginRight: '20px', width: '100px' }}
              >
                <Input
                  placeholder="닉네임"
                  style={{ borderRadius: '10px' }}
                  size="small"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item
                name="message"
                style={{ marginRight: '20px', width: '200px' }}
              >
                <Input
                  placeholder="메시지를 입력하세요"
                  style={{ borderRadius: '10px' }}
                  size="small"
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage();
                    }
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  size="small"
                  type="primary"
                  shape="round"
                  onClick={sendMessage}
                >
                  전송
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </Spin>
  );
}

export default Index;
