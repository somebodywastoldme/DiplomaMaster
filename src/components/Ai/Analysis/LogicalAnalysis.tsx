import React from 'react';
import { LogicalAnalysisResult } from '../../../managers/AIManager';
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

interface LogicalAnalysisDisplayProps {
  result: LogicalAnalysisResult;
}

const LogicalAnalysis: React.FC<LogicalAnalysisDisplayProps> = ({ result }) => {
  return (
    <Box mt={6}>
      <Heading size="lg" mb={4}>
        Результати логічного аналізу
      </Heading>
      <Accordion allowMultiple>
        {/* Logical Analysis */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Логічний аналіз
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <AnalysisList
              title="Протиріччя"
              items={result.logicalAnalysis.contradictions}
            />
            <AnalysisList
              title="Циклічні залежності"
              items={result.logicalAnalysis.circularDependencies}
            />
            <AnalysisList
              title="Проблеми з обмеженнями"
              items={result.logicalAnalysis.constraintIssues}
            />
          </AccordionPanel>
        </AccordionItem>

        {/* Consistency Check */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Перевірка узгодженості
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <AnalysisList
              title="Проблеми з діапазоном доменних імен"
              items={result.consistencyCheck.domainRangeIssues}
            />
            <AnalysisList
              title="Проблеми кардинальності"
              items={result.consistencyCheck.cardinalityProblems}
            />
            <AnalysisList
              title="Порушення диз'юнктності"
              items={result.consistencyCheck.disjointnessViolations}
            />
          </AccordionPanel>
        </AccordionItem>

        {/* Axiom Analysis */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Аналіз аксіом
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <AnalysisSection
              title="Корректність"
              content={result.axiomAnalysis.correctness}
            />
            <AnalysisSection
              title="Повтона"
              content={result.axiomAnalysis.completeness}
            />
            <AnalysisList
              title="Проблеми"
              items={result.axiomAnalysis.issues}
            />
            <AnalysisList
              title="Рекомендації"
              items={result.axiomAnalysis.recommendations}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default LogicalAnalysis;
