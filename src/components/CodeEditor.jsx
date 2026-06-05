import { useMemo } from 'react'
import Editor from '@monaco-editor/react'

const CodeEditor = ({ language, value, onChange }) => {
  const defaultLanguage = useMemo(() => {
    if (language === 'javascript') return 'javascript'
    if (language === 'python') return 'python'
    return 'javascript'
  }, [language])

  return (
    <div className="mt-5 h-[450px] overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-soft">
      <Editor
        height="100%"
        defaultLanguage={defaultLanguage}
        language={defaultLanguage}
        theme="vs-dark"
        value={value}
        options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: 'on' }}
        onChange={onChange}
      />
    </div>
  )
}

export default CodeEditor
