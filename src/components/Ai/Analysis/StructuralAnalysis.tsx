import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Heading } from "@chakra-ui/react";
import { StructuralAnalysisResult } from "../../../managers/AIManager";
import AnalysisSection from "../common/AnalysisSection";
import AnalysisList from "../common/AnalysisList";

interface StructuralAnalysisDisplayProps {
    result: StructuralAnalysisResult;
  }
  
const StructuralAnalysis: React.FC<StructuralAnalysisDisplayProps> = ({ result }) => {
return (
    <Box mt={6} overflow={'auto'}>
        <Heading size="lg" mb={4}>
            Результати структурного аналізу
        </Heading>
        <Accordion allowMultiple>
            {/* Class Hierarchy Analysis */}
            <AccordionItem>
            <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                    Аналіз ієрархії класів
                </Box>
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
                <AnalysisSection
                title="Повнота"
                content={result.classHierarchyAnalysis.completeness}
                />
                <AnalysisList
                title="Відсутні елементи"
                items={result.classHierarchyAnalysis.missingElements}
                />
                <AnalysisList
                title="Структурні проблеми"
                items={result.classHierarchyAnalysis.structuralIssues}
                />
                <AnalysisList
                title="Рекомендації"
                items={result.classHierarchyAnalysis.recommendations}
                />
            </AccordionPanel>
            </AccordionItem>

            {/* Property Analysis */}
            <AccordionItem>
            <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                    Аналіз ознак
                </Box>
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
                <Heading size="sm" mt={2} mb={2}>
                    Розповсюдження
                </Heading>
                <AnalysisList
                title="Добре розповсюджений"
                items={result.propertyAnalysis.distribution.wellDistributed}
                />
                <AnalysisList
                title="Недостатньо використовується"
                items={result.propertyAnalysis.distribution.underutilized}
                />
                <AnalysisList
                title="Перевантажено"
                items={result.propertyAnalysis.distribution.overloaded}
                />
                <AnalysisList
                title="Спадкові проблеми"
                items={result.propertyAnalysis.inheritanceIssues}
                />
                <AnalysisList
                title="Рекомендації"
                items={result.propertyAnalysis.recommendations}
                />
            </AccordionPanel>
            </AccordionItem>

            {/* Relationship Analysis */}
            <AccordionItem>
                <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                        Аналіз взаємозв'язків
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                    <Heading size="sm" mt={2} mb={2}>
                        Паттерни
                    </Heading>
                    <AnalysisList
                    title="Спільні"
                    items={result.relationshipAnalysis.patterns.common}
                    />
                    <AnalysisList
                    title="Незвичайний"
                    items={result.relationshipAnalysis.patterns.unusual}
                    />
                    <AnalysisList
                    title="Прогалини"
                    items={result.relationshipAnalysis.gaps}
                    />
                    <AnalysisList
                    title="Рекомендації"
                    items={result.relationshipAnalysis.recommendations}
                    />
            </AccordionPanel>
            </AccordionItem>
        </Accordion>
    </Box>
    );
};

export default StructuralAnalysis;