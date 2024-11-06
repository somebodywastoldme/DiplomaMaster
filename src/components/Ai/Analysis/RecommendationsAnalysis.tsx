import React from 'react';
import { RecommendationsResult } from '../../../managers/AIManager';
import {
  Box,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
} from '@chakra-ui/react';

import AnalysisList from '../common/AnalysisList';

interface RecommendationsDisplayProps {
  result: RecommendationsResult;
}

const Recommendations: React.FC<RecommendationsDisplayProps> = ({ result }) => {
  return (
    <Box mt={6}>
      <Heading size="lg" mb={4}>
        Рекомендації
      </Heading>
      <Accordion allowMultiple>
        {/* Improvements */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Покращення
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            {/* Critical Improvements */}
            <Heading size="md" mt={2} mb={2}>
              Критичні
            </Heading>
            <AnalysisList
              title="Структурні"
              items={result.improvements.critical.structural}
            />
            <AnalysisList
              title="Семантичні"
              items={result.improvements.critical.semantic}
            />
            <AnalysisList
              title="Логічні"
              items={result.improvements.critical.logical}
            />
            {/* Recommended Improvements */}
            <Heading size="md" mt={4} mb={2}>
              Рекомендації
            </Heading>
            <AnalysisList
              title="Структурні"
              items={result.improvements.recommended.structural}
            />
            <AnalysisList
              title="Семантичні"
              items={result.improvements.recommended.semantic}
            />
            <AnalysisList
              title="Документація"
              items={result.improvements.recommended.documentation}
            />
            {/* Optional Improvements */}
            <Heading size="md" mt={4} mb={2}>
              Додоаткові
            </Heading>
            <AnalysisList
              title="Покращення"
              items={result.improvements.optional.enhancements}
            />
            <AnalysisList
              title="Оптимізація"
              items={result.improvements.optional.optimizations}
            />
          </AccordionPanel>
        </AccordionItem>

        {/* Implementation Guide */}
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Посібник з впровадження
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <AnalysisList
              title="Пріоритетний порядок"
              items={result.implementationGuide.priorityOrder}
            />
            <AnalysisList
              title="Потенційний вплив"
              items={result.implementationGuide.potentialImpact}
            />
            <Box mb={4}>
              <Text fontWeight="bold">Орієнтовний обсяг робіт</Text>
              <Text>{result.implementationGuide.estimatedEffort}</Text>
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default Recommendations;
