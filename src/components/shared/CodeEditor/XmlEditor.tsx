import { useRef, FC } from 'react';
import * as monaco from 'monaco-editor';
import Editor, { Monaco } from "@monaco-editor/react";

interface IXMLEditorProps {
    xmlContent: string;
    setXmlContent: (content: string) => void;
}
const XMLEditor: FC<IXMLEditorProps> = ({ xmlContent, setXmlContent}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    
    monaco.languages.registerDocumentFormattingEditProvider('xml', {
      provideDocumentFormattingEdits(model) {
        const text = model.getValue();
        const formatted = formatXml(text);
        return [
          {
            range: model.getFullModelRange(),
            text: formatted,
          },
        ];
      },
    });
  };

  const formatXml = (xml: string): string => {
    let formatted = '';
    let indent = '';
    const tab = '  ';
    xml.split(/>\s*</).forEach(function(node) {
      if (node.match( /^\/\w/ )) indent = indent.substring(tab.length);
      formatted += indent + '<' + node + '>\r\n';
      if (node.match( /^<?\w[^>]*[^/]$/ )) indent += tab;
    });
    return formatted.substring(1, formatted.length-3);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Editor
        height="90vh"
        defaultLanguage="xml"
        value={xmlContent}
        onMount={handleEditorDidMount}
        onChange={(value) => setXmlContent(value ?? '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          wrappingIndent: 'indent',
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default XMLEditor;