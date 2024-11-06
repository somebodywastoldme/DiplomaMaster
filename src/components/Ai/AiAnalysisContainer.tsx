import { OntologyAnalysisManager, AnalysisResult } from '../../managers/AIManager';
import React, { useState } from 'react';
import {
  Button,
  Box,
  Text,
  Flex,
} from '@chakra-ui/react';
import { saveAs } from 'file-saver';
import ClipLoader from 'react-spinners/ClipLoader';


import StructuralAnalysis from './Analysis/StructuralAnalysis';
import SemanticAnalysis from './Analysis/SemanticAnalysis';
import LogicalAnalysis from './Analysis/LogicalAnalysis';
import Recommendations from './Analysis/RecommendationsAnalysis';
import { DocumentReportManager } from '../../managers/DocumentReportManager';

interface AiAnalysisContainerProps {
  ontology: string;
  setNextOntology: (nextOntology: string) => void;
}

const key = '';
const AiAnalysisContainer: React.FC<AiAnalysisContainerProps> = ({ ontology, setNextOntology }) => {
    const [result, setResult] = useState<AnalysisResult | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  
    const handleAnalyze = async () => {
      setLoading(true);
      setError(null);
      const manager = new OntologyAnalysisManager(key);
  
      try {
        const response = await manager.analyzeOntology(ontology);
        setResult(response);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    const handleGenerateReport = async () => {
      if (!result) return;
      const manager = new DocumentReportManager();
      const blob = await manager.generateReport(result);
      saveAs(blob, 'ontology_analysis_report.docx');
    };

    const improveOntology = async () => {
      if (!result) return;
      setLoading(true);
      setError(null);
      const manager = new OntologyAnalysisManager(key);
      try {
      const improvedOntology = await manager.improveOntology(ontology, result);
      if (improvedOntology) {
        setNextOntology(improvedOntology);
      } else {
        setError('Failed to improve ontology');
      }
      } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      } finally {
      setLoading(false);
      }
    }
  
    return (
      <Box p={4}>
        <Flex justifyContent={'space-between'}>
          <Flex>
            <Button onClick={handleAnalyze} colorScheme="blue" size={'sm'}>
              Почати аналіз
            </Button>
            {result &&
              <Button onClick={handleGenerateReport} colorScheme="blue" ml={4} size={'sm'}>
                Згенерувати звіт
              </Button>
            }
            {result &&
              <Button onClick={improveOntology} colorScheme="blue" ml={4} size={'sm'}>
                Покращити онтологію
              </Button>
            }
          </Flex>
          <Flex alignSelf={'flex-end'}>
            <ClipLoader
              size={40}
              color={"#123abc"}
              loading={loading}
              speedMultiplier={1.5}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </Flex>
        </Flex>
        {error && <Text color="red.500" mt={4}>{error}</Text>}
        {result && (
          <>
            {result.structural && <StructuralAnalysis result={result.structural} />}
            {result.semantic && <SemanticAnalysis result={result.semantic} />}
            {result.logical && <LogicalAnalysis result={result.logical} />}
            {result.recommendations && <Recommendations result={result.recommendations} />}
          </>
        )}
      </Box>
    );
};

export default AiAnalysisContainer;
