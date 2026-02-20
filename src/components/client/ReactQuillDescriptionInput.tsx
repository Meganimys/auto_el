"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-50 border border-gray-300 rounded animate-pulse bg-gray-50" />
  ),
});

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function ReactQuillDescriptionInput({
  value,
  onChange,
}: EditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const divStyle = "[&_.ql-toolbar]:bg-[#0a0a0a] [&_.ql-container]:bg-gray-[#0a0a0a] [&_.ql-editor]:text-white [&_.ql-toolbar]:border-white [&_.ql-container]:border-white [&_.ql-toolbar]:rounded-t [&_.ql-container]:rounded-b [&_.ql-toolbar]:text-amber-100 [&_.ql-stroke]:stroke-gray-400 [&_.ql-fill]:fill-gray-400 [&_.ql-picker]:text-gray-400 [&_button:hover_.ql-stroke]:stroke-red-500 [&_button:hover_.ql-fill]:fill-red-500 [&_.ql-active_.ql-stroke]:stroke-red-600 [&_.ql-active_.ql-fill]:fill-red-600 [&_.ql-active]:text-red-600";

  return (
    <div
      className={divStyle}
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="h-48 mb-12" // mb-12 бо панель інструментів знизу займає місце
      />
    </div>
  );
}
