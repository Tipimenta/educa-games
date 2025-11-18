import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";
import { useEffect, useState } from "react";
import Modal from "./Modal";

import {
  Bold,
  Code,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Maximize,
  Quote,
  Strikethrough,
  Underline as UnderlineIcon,
} from "lucide-react";

const ToolbarButton = ({ active, onClick, children, title }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`rounded px-2 py-1 text-sm inline-flex items-center gap-1
      ${
        active
          ? "bg-blue-100 text-blue-700"
          : "text-gray-700 hover:bg-gray-100"
      }`}
  >
    {children}
  </button>
);

const RichTextEditor = ({ value, onChange, placeholder, onBlur }) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const lowlight = createLowlight(common);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({
        autolink: true,
        linkOnPaste: true,
        openOnClick: true,
        HTMLAttributes: {
          class: "text-blue-600 underline",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      CodeBlockLowlight.configure({ lowlight }),
    ],

    content: value || "",

    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none w-full p-3 text-gray-800 focus:outline-none",
      },
    },

    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  // Track focus/blur to control placeholder visibility
  useEffect(() => {
    if (!editor) return;
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    editor.on("focus", handleFocus);
    editor.on("blur", handleBlur);
    return () => {
      editor.off("focus", handleFocus);
      editor.off("blur", handleBlur);
    };
  }, [editor]);

  /* SYNC EXTERNAL VALUE */
  useEffect(() => {
    if (editor && typeof value === "string" && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <>
    <div className="w-full">

      {/* Caixa única envolvendo toolbar e área de texto */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* TOOLBAR */}
        <div className="flex flex-wrap items-center gap-2 rounded-t-xl border-b border-gray-200 bg-gray-50 p-2">

        {/* Bold */}
        <ToolbarButton
          title="Negrito"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        {/* Italic */}
        <ToolbarButton
          title="Itálico"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        {/* Underline */}
        <ToolbarButton
          title="Sublinhado"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>

        {/* Strike */}
        <ToolbarButton
          title="Riscado"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-gray-200" />

        {/* Headings */}
        {[1, 2, 3].map((level) => (
          <ToolbarButton
            key={level}
            title={`Título H${level}`}
            active={editor.isActive("heading", { level })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
          >
            <span className="text-xs font-semibold">H{level}</span>
          </ToolbarButton>
        ))}

        <span className="mx-1 h-5 w-px bg-gray-200" />

        {/* Lists (botões diretos) */}
        <ToolbarButton
          title="Lista"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Lista ordenada"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        {/* Link button (sem input) */}
        <ToolbarButton
          title="Link"
          active={editor.isActive("link")}
          onClick={() => {
            if (!editor) return;
            const { from, to } = editor.state.selection;
            const selectedText = editor.state.doc.textBetween(from, to).trim();

            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
              return;
            }

            const isProtocolUrl = /^(https?:\/\/|mailto:|tel:)/i.test(selectedText);
            const isDomain = /^(?:www\.)?[a-z0-9.-]+\.[a-z]{2,}(?:\/\S*)?$/i.test(selectedText);
            let href = null;
            if (isProtocolUrl) {
              href = selectedText;
            } else if (isDomain) {
              href = selectedText.startsWith("www.")
                ? `https://${selectedText}`
                : `https://${selectedText}`;
            }

            if (href) {
              editor.chain().focus().setLink({ href }).run();
            }
          }}
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>

        {/* Quote */}
        <ToolbarButton
          title="Citação"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        {/* CODE BLOCK */}
        <ToolbarButton
          title="Código"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        {/* Spacer & Expand Button (top-right) */}
        <div className="ms-auto" />
        <ToolbarButton
          title="Expandir editor (modo focado)"
          onClick={() => setExpanded(true)}
        >
          <Maximize className="h-4 w-4" />
        </ToolbarButton>
        </div>

        {/* PLACEHOLDER: hide when focused */}
        {placeholder && !value && !isFocused && (
          <p className="px-3 pt-2 text-xs text-gray-500">{placeholder}</p>
        )}

        {/* EDITOR - renderiza somente fora do modal quando não expandido */}
        {!expanded && (
          <div className="p-2">
            {/* Editor inline com altura fixa e rolagem interna */}
            <EditorContent
              editor={editor}
              className="h-[200px] overflow-y-auto"
              onBlur={(e) => onBlur?.(e)}
            />
          </div>
        )}
      </div>
    </div>

    {/* Expanded Modal */}
    <Modal isOpen={expanded} onClose={() => setExpanded(false)} title="Editor" size="xl">
      <div className="w-full h-full overflow-hidden">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm h-full flex flex-col">
          <div className="flex flex-wrap items-center gap-2 rounded-t-xl border-b border-gray-200 bg-gray-50 p-2">
            {/* Toolbar */}
            <ToolbarButton
              title="Negrito"
              active={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Itálico"
              active={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Sublinhado"
              active={editor.isActive("underline")}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Riscado"
              active={editor.isActive("strike")}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
            <span className="mx-1 h-5 w-px bg-gray-200" />
            {[1, 2, 3].map((level) => (
              <ToolbarButton
                key={level}
                title={`Título H${level}`}
                active={editor.isActive("heading", { level })}
                onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
              >
                <span className="text-xs font-semibold">H{level}</span>
              </ToolbarButton>
            ))}
            <span className="mx-1 h-5 w-px bg-gray-200" />
            <ToolbarButton
              title="Lista"
              active={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Lista ordenada"
              active={editor.isActive("orderedList")}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Link"
              active={editor.isActive("link")}
              onClick={() => {
                if (!editor) return;
                const { from, to } = editor.state.selection;
                const selectedText = editor.state.doc.textBetween(from, to).trim();
                if (editor.isActive("link")) {
                  editor.chain().focus().unsetLink().run();
                  return;
                }
                const isProtocolUrl = /^(https?:\/\/|mailto:|tel:)/i.test(selectedText);
                const isDomain = /^(?:www\.)?[a-z0-9.-]+\.[a-z]{2,}(?:\/\S*)?$/i.test(selectedText);
                let href = null;
                if (isProtocolUrl) href = selectedText;
                else if (isDomain) href = selectedText.startsWith("www.") ? `https://${selectedText}` : `https://${selectedText}`;
                if (href) editor.chain().focus().setLink({ href }).run();
              }}
            >
              <LinkIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Citação"
              active={editor.isActive("blockquote")}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Código"
              active={editor.isActive("codeBlock")}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <Code className="h-4 w-4" />
            </ToolbarButton>
          </div>
          <div className="p-2 flex-1 min-h-0">
            {expanded && (
              <EditorContent
                editor={editor}
                className="h-full overflow-y-auto"
                onBlur={(e) => onBlur?.(e)}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
    </>
  );
};

export default RichTextEditor;
