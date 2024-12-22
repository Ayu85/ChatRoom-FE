import React, { useState, useEffect, useRef } from 'react';

const ChatContainer = () => {
    const [messages, setMsgs] = useState([]);
    const [socket, setSocket] = useState(null);
    const [id, setId] = useState('');
    const [message, setMessage] = useState('');
    const msgRef = useRef();

    useEffect(() => {
        const server = new WebSocket('ws://localhost:8000');

        server.onopen = () => {
            console.log("WebSocket connected!");
        };

        server.onmessage = (e) => {
            console.log("Received message:", e.data);
            setMsgs(prevMsgs => [...prevMsgs, e.data]);
        };

        server.onerror = (e) => {
            console.error("WebSocket error:", e);
        };

        server.onclose = () => {
            console.log("WebSocket closed");
        };

        setSocket(server);

        return () => {
            if (server) {
                server.close();
            }
        };
    }, []);

    const sendMessage = () => {
        if (!message.trim() || !socket || socket.readyState !== WebSocket.OPEN) {
            // Don't send an empty message or if the socket is not open
            return;
        }

        const data = JSON.stringify({
            type: "message",
            payload: {
                message: message,
            },
        });

        socket.send(data);
        setMessage(''); // Clear the input after sending the message
    };

    const joinRoom = (roomId) => {
        if (socket && roomId) {
            socket.send(JSON.stringify({
                type: "join",
                payload: { roomId },
            }));
            alert(`Room ${roomId} joined`);
        }
    };

    return (
        <div className="h-[80vh] border border-slate-700 overflow-hidden relative flex flex-col justify-between shadow-xl w-[50vw]">
            <div className="bg-slate-700 py-3 px-3 space-x-2">
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="bg-slate-600 rounded-md pl-3"
                    placeholder="Room ID here..."
                />
                <button
                    onClick={() => joinRoom(id)}
                    className="bg-green-800 text-sm py-1 px-4 rounded-md"
                >
                    Join Room
                </button>
            </div>

            <div className="p-3 space-y-2 overflow-auto absolute  top-16">
                {messages.map((msg, index) => (
                    <div key={index} className="bg-slate-700 w-max py-1 px-2 text-sm">
                        {msg}
                    </div>
                ))}
            </div>

            <div className="flex justify-between gap-2">
                <input
                    ref={msgRef}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-slate-700 rounded-r-md outline-none w-full p-2"
                    placeholder="Type here..."
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-800 p-2 px-4 rounded-l-md"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatContainer;
