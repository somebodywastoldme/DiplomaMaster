import React from 'react';
import { SemanticAnalysisResult } from '../../../managers/AIManager';
import {
  Box,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

import AnalysisSection from '../common/AnalysisSection';
import AnalysisList from '../common/AnalysisList';

interface SemanticAnalysisDisplayProps {
  result: SemanticAnalysisResult;
}

const SemanticAnalysis: React.FC<SemanticAnalysisDisplayProps> = ({ result }) => {
  return (
    <Box mt={6}>
      <Heading size="lg" mb={4}>
        Результати семантичного аналізу
      </Heading>
      <Accordion allowMultiple>
        {/* Naming Analysis */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Аналіз іменування
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            {/* Conventions */}
            <AnalysisSection
              title="Статус конвенцій"
              content={result.namingAnalysis.conventions.status}
            />
            <AnalysisList
              title="Питання щодо конвенцій"
              items={result.namingAnalysis.conventions.issues}
            />
            {/* Terminology */}
            <AnalysisSection
              title="Узгодженість термінології"
              content={result.namingAnalysis.terminology.consistency}
            />
            <AnalysisList
              title="Термінологічні проблеми"
              items={result.namingAnalysis.terminology.problems}
            />
            <AnalysisList
              title="Рекомендації"
              items={result.namingAnalysis.recommendations}
            />
          </AccordionPanel>
        </AccordionItem>

        {/* Conceptual Analysis */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Концептуальний аналіз
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <AnalysisSection
              title="Повнота"
              content={result.conceptualAnalysis.completeness}
            />
            <AnalysisList
              title="Прогалини"
              items={result.conceptualAnalysis.gaps}
            />
            <AnalysisList
              title="Покращення"
              items={result.conceptualAnalysis.improvements}
            />
          </AccordionPanel>
        </AccordionItem>

        {/* Domain Alignment */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Domain Alignment
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <AnalysisSection
              title="Покриття"
              content={result.domainAlignment.coverage}
            />
            <AnalysisList
              title="Відсутні поняття"
              items={result.domainAlignment.missingConcepts}
            />
            <AnalysisList
              title="Рекомендації"
              items={result.domainAlignment.recommendations}
            />
          </AccordionPanel>
        </AccordionItem>

        {/* Semantic Relationships */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Семантичні зв'язки
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <AnalysisSection
              title="Узгодженість"
              content={result.semanticRelationships.consistency}
            />
            <AnalysisList
              title="Проблеми"
              items={result.semanticRelationships.issues}
            />
            <AnalysisList
              title="Пропозиції"
              items={result.semanticRelationships.suggestions}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default SemanticAnalysis;
