export default function Messages() {
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setMessages([...messages, newMessage]);
    });
  }, [socket, setMessages, messages]);

  return (
    <div className='px-4 flex-1 overflow-y-auto'>
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div key={message._id} ref={lastMessageRef}>
            <Message message={message} />
          </div>
        ))}

      {!loading && messages.length === 0 && (
        <p className='text-center text-2xl text-orange-300'>Send a message to start the conversation</p>
      )}
    </div>
  )
}