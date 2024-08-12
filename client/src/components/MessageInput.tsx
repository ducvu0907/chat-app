import { ChangeEvent, FormEvent, useState } from "react";
import { BsSend } from "react-icons/bs";
import { MdAttachFile } from "react-icons/md";
import useSendMessage from "../hooks/useSendMessage";

export default function MessageInput() {
  const [text, setText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const { loading, sendMessage } = useSendMessage();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text && !file) {
      return;
    }
    await sendMessage(text, file);
    setText("");
    setFile(null);
    setFilePreview(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile)); // preview file
    }
  };

  return (
    <form className='w-full px-4 mt-3 bottom-0 border-2 border-cream-800 rounded-lg' onSubmit={handleSubmit}>
      <div className='flex items-center mb-2 p-2'>
        <label className='flex items-center'>
          <MdAttachFile className='text-gray-200 cursor-pointer' size={21} />
          <input
            type='file'
            accept=".png, .jpeg, .pdf"
            className='hidden'
            onChange={handleFileChange}
          />
        </label>
        {filePreview && (
          <div className='ml-2'>
            {file && file.type.startsWith('image/') ? (
              <img src={filePreview} alt='preview' className='w-20 h-20 object-cover rounded' />
            ) : (
              <span className='text-md text-gray-200 italic'>{file?.name} - <span className="text-xs">{file?.size}b</span></span>
            )}
          </div>
        )}
      </div>
      <div className='w-full relative'>
        <input
          type='text'
          className='border text-sm rounded-lg block w-full p-2 bg-gray-600 border-gray-600 text-white mb-5'
          placeholder='Send a message'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
          {loading ? <div className='loading loading-spinner'></div> : <BsSend size="21" aria-label="Send" />}
        </button>
      </div>
    </form>
  );
}