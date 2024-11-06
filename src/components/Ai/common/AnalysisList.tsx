import { Box, Text, Stack } from "@chakra-ui/react";

interface AnalysisListProps {
    title: string;
    items: string[];
  }
  
const AnalysisList: React.FC<AnalysisListProps> = ({ title, items }) => (
<Box mb={4}>
    <Text fontWeight="bold">{title}</Text>
    {items.length > 0 ? (
    <Stack spacing={2} mt={2}>
        {items.map((item, index) => (
        <Text key={index}>• {item}</Text>
        ))}
    </Stack>
    ) : (
    <Text mt={2}>Не знайдено</Text>
    )}
</Box>
);

export default AnalysisList;
  