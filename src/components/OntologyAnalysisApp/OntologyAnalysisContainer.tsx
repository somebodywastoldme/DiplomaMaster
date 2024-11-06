import React, { useEffect, useState } from 'react';
import * as rdflib from 'rdflib';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import 'react-reflex/styles.css';
import { Card, Flex, Text } from '@chakra-ui/react';
import OntologyVisualization from './OntologyVisualization';
import XMLEditor from '../shared/CodeEditor/XmlEditor';
import FileUpload from '../shared/FileUpload';
import AiAnalysisContainer from '../Ai/AiAnalysisContainer';

const OntologyAnalysisContainer: React.FC = () => {
  const [graph, setGraph] = useState<rdflib.IndexedFormula | null>(null);
  const [xmlContent, setXmlContent] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const content = e.target?.result as string;
        setXmlContent(content);
        parseOwlFile(content);
      };
      reader.readAsText(uploadedFile);
    }
  };

  const parseOwlFile = (content: string) => {
    const store = rdflib.graph();
    rdflib.parse(content, store, 'http://example.org/', 'application/rdf+xml');
    setGraph(store);
  };

  const handleChangeXmlContent = (content: string) => {
    setXmlContent(content);
    parseOwlFile(content);
  };

  useEffect(() => {
    if (xmlContent) {
      parseOwlFile(xmlContent);
    }
  }, [xmlContent]);

  return (
    <Flex w={'100%'} h={'100%'} p={5} alignItems={'center'} flexDir={'column'}>
      <Card w={'100%'} m='auto'>
        <ReflexContainer orientation="vertical" style={{ height: '90vh' }}>
          <ReflexElement flex={0.6} style={{ overflow: 'hidden' }}>
            <Flex h={'100%'}>
              {graph ? <OntologyVisualization rdfData={xmlContent}/> : <Text size={'lg'} m={'auto'}>Спочатку додайте файл онтології</Text>}
            </Flex>
          </ReflexElement>
          
          <ReflexSplitter />
          
          <ReflexElement flex={0.4}>
            <ReflexContainer orientation="horizontal">
              <ReflexElement flex={0.5} style={{ overflow: 'hidden' }}>
                <Flex flexDir={'column'} gap={2} padding={3} h={'100%'}>
                  { xmlContent ? 
                    <XMLEditor xmlContent={xmlContent} setXmlContent={handleChangeXmlContent} /> 
                    : 
                      <Flex m={'auto'} flexDir={'column'} gap={2} alignItems={'center'}>
                        <Text align={'center'}>Завантажити файл онтології</Text>
                        <FileUpload handleFileChange={handleFileUpload}/>
                      </Flex>
                  }
                </Flex>
              </ReflexElement>
              <ReflexSplitter />
              <ReflexElement flex={0.5}>
                <AiAnalysisContainer ontology={xmlContent} setNextOntology={setXmlContent}/>
              </ReflexElement>
            </ReflexContainer>
          </ReflexElement>
        </ReflexContainer>
        </Card>
      </Flex>
  );
};

export default OntologyAnalysisContainer;