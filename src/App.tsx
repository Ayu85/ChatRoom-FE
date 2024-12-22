import Header from './components/Header'
import ChatContainer from './components/ChatContainer'

const App = () => {

  return (
    <div className='bg-slate-800 overflow-hidden h-screen text-slate-300'>
      <Header />
      <div className='flex justify-center items-center h-full'>
        <ChatContainer  />
      </div>
    </div>
  )
}

export default App