import { Box, Text } from "@chakra-ui/react";

interface AnalysisSectionProps {
    title: string;
    content: string;
  }
  
const AnalysisSection: React.FC<AnalysisSectionProps> = ({ title, content }) => (
<Box mb={4}>
    <Text fontWeight="bold">{title}</Text>
    <Text>{content}</Text>
</Box>
);

export default AnalysisSection;