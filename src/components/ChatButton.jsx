const ChatButton = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        className="flex items-center justify-center w-8 h-8 sm:w-14 sm:h-14 bg-green-500 rounded-full shadow-lg text-white cursor-pointer"
        onClick={() => {
          window.open("https://wa.me/923149982123", "_blank");
        }}
      >
        <i className="fa-brands fa-whatsapp text-4xl"></i>
      </button>
    </div>
  );
};

export default ChatButton;
