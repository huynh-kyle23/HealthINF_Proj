const UserMessage = ({ text }) => (
    <div className="flex w-full mb-4 justify-end">
      <div className="bg-blue-500 text-white rounded-lg p-4 max-w-[80%]">
        {text}
      </div>
      <div className="flex-shrink-0 w-8 h-8 bg-gray-400 rounded-full ml-3"></div>
    </div>
  );
  export default UserMessage