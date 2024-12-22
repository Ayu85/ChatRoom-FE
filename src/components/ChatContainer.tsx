import React, { useRef, useState } from 'react'

const ChatContainer = () => {
    const [messages, setMsgs] = React.useState([])
    const wsRef = useRef()
    const msg = useRef()
    React.useEffect(() => {
        const server = new WebSocket('ws://localhost:8000')
        server.onmessage = (e) => {
            console.log(e.data);
            
            setMsgs(m => [...m, e.data])
        }
        wsRef.current = server
        server.onopen = () => {
            server.send(JSON.stringify({
                type: "join",
                payload: {
                    roomId: "1234"
                }
            }))
        }
    }, [])
    console.log(messages);
    const send = () => {
        const data = JSON.stringify({
            type: "message",
            payload: {
                message: msg.current.value
            }
        })
        wsRef.current.send(data)
    }
    return (
        <div className='h-[80vh] border border-slate-700 overflow-hidden flex flex-col justify-between shadow-xl w-[50vw]'>
            <div className='p-3 space-y-2'>
                {messages?.map((msg) => {
                    return <div className='bg-slate-700 w-max py-1 px-2 text-sm'>
                        {msg}
                    </div>
                })}
            </div>
            <div className='flex justify-between gap-2'>
                <input ref={msg} type="text" className='bg-slate-700 rounded-r-md outline-none w-full p-2 ' placeholder='Type here............ ' name="" id="" />
                <button onClick={send} className='bg-blue-800 p-2 px-4 rounded-l-md'>Send</button>
            </div>
        </div>
    )
}

export default ChatContainer