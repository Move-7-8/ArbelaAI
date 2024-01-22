import React from 'react'

const ChatLoad = () => {
  return (
    <div className="flex flex-col w-full h-full max-h-screen rounded-lg border-blue-200 border-solid border-2 p-10">
        <div className="flex flex-col h-full max-h-[calc(100vh-400px)] overflow-y-auto border-blue-200 border-solid border-2 p-6 rounded-lg">
            <h2>Loading</h2>
        </div>
    </div>
  )
}

export default ChatLoad