import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Escribe la descripción...",
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
      }),
    ],
    content: value,
    onUpdate({ editor }) {
        console.log(editor.getHTML(), "<<<");
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-md bg-white shadow-sm"
    >
      <div className="flex gap-2 border-b p-2 bg-gray-50">
        <button
        type="button"
          className={`px-2 py-1 rounded ${
            editor.isActive("bold") ? "bg-blue-200" : ""
          }`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>

        <button
        type="button"
          className={`px-2 py-1 rounded ${
            editor.isActive("italic") ? "bg-blue-200" : ""
          }`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>

        <button
        type="button"
          className={`px-2 py-1 rounded ${
            editor.isActive("heading", { level: 2 }) ? "bg-blue-200" : ""
          }`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </button>

        <button
        type="button"
          className={`px-2 py-1 rounded ${
            editor.isActive("heading", { level: 2 }) ? "bg-blue-200" : ""
          }`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>

        <button
        type="button"
          className={`px-2 py-1 rounded ${
            editor.isActive("bulletList") ? "bg-blue-200" : ""
          }`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="p-3 prose prose-sm max-w-none min-h-[250px] caret-blue"
      />
    </div>
  );
}
