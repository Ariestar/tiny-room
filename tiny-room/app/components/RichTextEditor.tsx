import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  onImageUpload?: (file: File) => Promise<string>;
}

// 样式对象
const styles = {
  container: {
    fontFamily:
      'var(--font-base, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    flexWrap: 'wrap' as const,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
    height: '32px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    fontWeight: '500',
    borderRadius: '4px',
    color: '#374151',
  },
  buttonHover: {
    backgroundColor: '#e5e7eb',
  },
  buttonActive: {
    backgroundColor: '#d1d5db',
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: '#d1d5db',
    margin: '0 4px',
  },
  editorContent: {
    minHeight: '200px',
  },
  loading: {
    padding: '20px',
    textAlign: 'center' as const,
    color: '#6b7280',
    fontSize: '14px',
  },
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content = '',
  onChange,
  placeholder = '开始写作...',
  editable = true,
  onImageUpload,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        codeBlock: false, // 禁用默认代码块，使用lowlight版本
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'plaintext',
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    editorProps: {
      attributes: {
        class: 'prose-content',
      },
    },
  });

  const handleImageUpload = useCallback(async () => {
    if (!onImageUpload || !editor) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const imageUrl = await onImageUpload(file);
          if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
          }
        } catch (error) {
          console.error('Image upload failed:', error);
        }
      }
    };
    input.click();
  }, [editor, onImageUpload]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('链接地址', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  // 按钮组件
  const ToolbarButton = ({
    onClick,
    isActive,
    disabled,
    title,
    children,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const buttonStyle = {
      ...styles.button,
      ...(isActive ? styles.buttonActive : {}),
      ...(disabled ? styles.buttonDisabled : {}),
      ...(isHovered && !disabled && !isActive ? styles.buttonHover : {}),
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </button>
    );
  };

  if (!editor) {
    return (
      <div className="rich-text-editor loading">
        <div className="loading-text">加载编辑器中...</div>
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      {editable && (
        <div className="toolbar">
          <div className="toolbar-group">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`toolbar-button ${editor.isActive('bold') ? 'active' : ''}`}
              title="粗体 (Ctrl+B)"
            >
              <strong>B</strong>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`toolbar-button ${editor.isActive('italic') ? 'active' : ''}`}
              title="斜体 (Ctrl+I)"
            >
              <em>I</em>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`toolbar-button ${editor.isActive('strike') ? 'active' : ''}`}
              title="删除线"
            >
              <span style={{ textDecoration: 'line-through' }}>S</span>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`toolbar-button ${editor.isActive('code') ? 'active' : ''}`}
              title="行内代码"
            >
              <code>code</code>
            </button>
          </div>

          <div className="toolbar-divider" />

          <div className="toolbar-group">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`toolbar-button ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
              title="一级标题"
            >
              H1
            </button>

            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`toolbar-button ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
              title="二级标题"
            >
              H2
            </button>

            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`toolbar-button ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
              title="三级标题"
            >
              H3
            </button>
          </div>

          <div className="toolbar-divider" />

          <div className="toolbar-group">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`toolbar-button ${editor.isActive('bulletList') ? 'active' : ''}`}
              title="无序列表"
            >
              <span>•</span>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`toolbar-button ${editor.isActive('orderedList') ? 'active' : ''}`}
              title="有序列表"
            >
              <span>1.</span>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`toolbar-button ${editor.isActive('codeBlock') ? 'active' : ''}`}
              title="代码块"
            >
              {'</>'}
            </button>

            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`toolbar-button ${editor.isActive('blockquote') ? 'active' : ''}`}
              title="引用"
            >
              ❝
            </button>
          </div>

          <div className="toolbar-divider" />

          <div className="toolbar-group">
            <button
              onClick={setLink}
              className={`toolbar-button ${editor.isActive('link') ? 'active' : ''}`}
              title="添加链接"
            >
              🔗
            </button>

            {onImageUpload && (
              <button onClick={handleImageUpload} className="toolbar-button" title="上传图片">
                🖼️
              </button>
            )}
          </div>

          <div className="toolbar-divider" />

          <div className="toolbar-group">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              className="toolbar-button"
              title="撤销 (Ctrl+Z)"
            >
              ↶
            </button>

            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              className="toolbar-button"
              title="重做 (Ctrl+Y)"
            >
              ↷
            </button>
          </div>
        </div>
      )}

      <div className="editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
