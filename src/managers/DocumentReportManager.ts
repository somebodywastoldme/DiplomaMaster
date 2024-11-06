import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
} from 'docx';
import { AnalysisResult, LogicalAnalysisResult, RecommendationsResult, SemanticAnalysisResult, StructuralAnalysisResult } from './AIManager';

export class DocumentReportManager {

  public async generateReport(result: AnalysisResult): Promise<Blob> {
    
    // Add content to the document based on the analysis results
    const sections: Paragraph[] = [];

    if (result.structural) {
      sections.push(
        new Paragraph({
          text: 'Structural Analysis',
          heading: HeadingLevel.HEADING_1,
        }),
        ...this.generateStructuralContent(result.structural)
      );
    }

    if (result.semantic) {
      sections.push(
        new Paragraph({
          text: 'Semantic Analysis',
          heading: HeadingLevel.HEADING_1,
        }),
        ...this.generateSemanticContent(result.semantic)
      );
    }

    if (result.logical) {
      sections.push(
        new Paragraph({
          text: 'Logical Analysis',
          heading: HeadingLevel.HEADING_1,
        }),
        ...this.generateLogicalContent(result.logical)
      );
    }

    if (result.recommendations) {
      sections.push(
        new Paragraph({
          text: 'Recommendations',
          heading: HeadingLevel.HEADING_1,
        }),
        ...this.generateRecommendationsContent(result.recommendations)
      );
    }

    const doc = new Document({
        sections: [
          {
            children: sections,
          },
        ],
    });
    const blob = await Packer.toBlob(doc);
    return blob;
  }

  // Helper methods
  private generateStructuralContent(structural: StructuralAnalysisResult): Paragraph[] {
    const content: Paragraph[] = [];

    // Class Hierarchy Analysis
    content.push(
      new Paragraph({
        text: 'Class Hierarchy Analysis',
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        text: `Completeness: ${structural.classHierarchyAnalysis.completeness}`,
      }),
      ...this.generateList('Missing Elements', structural.classHierarchyAnalysis.missingElements),
      ...this.generateList('Structural Issues', structural.classHierarchyAnalysis.structuralIssues),
      ...this.generateList('Recommendations', structural.classHierarchyAnalysis.recommendations)
    );

    // Property Analysis
    content.push(
      new Paragraph({
        text: 'Property Analysis',
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        text: 'Distribution',
        heading: HeadingLevel.HEADING_3,
      }),
      ...this.generateList('Well Distributed', structural.propertyAnalysis.distribution.wellDistributed),
      ...this.generateList('Underutilized', structural.propertyAnalysis.distribution.underutilized),
      ...this.generateList('Overloaded', structural.propertyAnalysis.distribution.overloaded),
      ...this.generateList('Inheritance Issues', structural.propertyAnalysis.inheritanceIssues),
      ...this.generateList('Recommendations', structural.propertyAnalysis.recommendations)
    );

    // Relationship Analysis
    content.push(
      new Paragraph({
        text: 'Relationship Analysis',
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        text: 'Patterns',
        heading: HeadingLevel.HEADING_3,
      }),
      ...this.generateList('Common', structural.relationshipAnalysis.patterns.common),
      ...this.generateList('Unusual', structural.relationshipAnalysis.patterns.unusual),
      ...this.generateList('Gaps', structural.relationshipAnalysis.gaps),
      ...this.generateList('Recommendations', structural.relationshipAnalysis.recommendations)
    );

    return content;
  }

  private generateSemanticContent(semantic: SemanticAnalysisResult): Paragraph[] {
    const content: Paragraph[] = [];

    // Naming Analysis
    content.push(
      new Paragraph({
        text: 'Naming Analysis',
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        text: `Conventions Status: ${semantic.namingAnalysis.conventions.status}`,
      }),
      ...this.generateList('Conventions Issues', semantic.namingAnalysis.conventions.issues),
      new Paragraph({
        text: `Terminology Consistency: ${semantic.namingAnalysis.terminology.consistency}`,
      }),
      ...this.generateList('Terminology Problems', semantic.namingAnalysis.terminology.problems),
      ...this.generateList('Recommendations', semantic.namingAnalysis.recommendations)
    );

    // Conceptual Analysis
    content.push(
      new Paragraph({
        text: 'Conceptual Analysis',
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        text: `Completeness: ${semantic.conceptualAnalysis.completeness}`,
      }),
      ...this.generateList('Gaps', semantic.conceptualAnalysis.gaps),
      ...this.generateList('Improvements', semantic.conceptualAnalysis.improvements)
    );

    // Domain Alignment
    content.push(
      new Paragraph({
        text: 'Domain Alignment',
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        text: `Coverage: ${semantic.domainAlignment.coverage}`,
      }),
      ...this.generateList('Missing Concepts', semantic.domainAlignment.missingConcepts),
      ...this.generateList('Recommendations', semantic.domainAlignment.recommendations)
    );

    // Semantic Relationships
    content.push(
      new Paragraph({
        text: 'Semantic Relationships',
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        text: `Consistency: ${semantic.semanticRelationships.consistency}`,
      }),
      ...this.generateList('Issues', semantic.semanticRelationships.issues),
      ...this.generateList('Suggestions', semantic.semanticRelationships.suggestions)
    );

    return content;
  }

  private generateLogicalContent(logical: LogicalAnalysisResult): Paragraph[] {
    const content: Paragraph[] = [];

    // Logical Analysis
    content.push(
      new Paragraph({
        text: 'Logical Analysis',
        heading: HeadingLevel.HEADING_2,
      }),
      ...this.generateList('Contradictions', logical.logicalAnalysis.contradictions),
      ...this.generateList('Circular Dependencies', logical.logicalAnalysis.circularDependencies),
      ...this.generateList('Constraint Issues', logical.logicalAnalysis.constraintIssues)
    );

    // Consistency Check
    content.push(
      new Paragraph({
        text: 'Consistency Check',
        heading: HeadingLevel.HEADING_2,
      }),
      ...this.generateList('Domain Range Issues', logical.consistencyCheck.domainRangeIssues),
      ...this.generateList('Cardinality Problems', logical.consistencyCheck.cardinalityProblems),
      ...this.generateList('Disjointness Violations', logical.consistencyCheck.disjointnessViolations)
    );

    // Axiom Analysis
    content.push(
      new Paragraph({
        text: 'Axiom Analysis',
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        text: `Correctness: ${logical.axiomAnalysis.correctness}`,
      }),
      new Paragraph({
        text: `Completeness: ${logical.axiomAnalysis.completeness}`,
      }),
      ...this.generateList('Issues', logical.axiomAnalysis.issues),
      ...this.generateList('Recommendations', logical.axiomAnalysis.recommendations)
    );

    return content;
  }

  private generateRecommendationsContent(recommendations: RecommendationsResult): Paragraph[] {
    const content: Paragraph[] = [];

    // Improvements
    content.push(
      new Paragraph({
        text: 'Improvements',
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        text: 'Critical',
        heading: HeadingLevel.HEADING_3,
      }),
      ...this.generateList('Structural', recommendations.improvements.critical.structural),
      ...this.generateList('Semantic', recommendations.improvements.critical.semantic),
      ...this.generateList('Logical', recommendations.improvements.critical.logical),
      new Paragraph({
        text: 'Recommended',
        heading: HeadingLevel.HEADING_3,
      }),
      ...this.generateList('Structural', recommendations.improvements.recommended.structural),
      ...this.generateList('Semantic', recommendations.improvements.recommended.semantic),
      ...this.generateList('Documentation', recommendations.improvements.recommended.documentation),
      new Paragraph({
        text: 'Optional',
        heading: HeadingLevel.HEADING_3,
      }),
      ...this.generateList('Enhancements', recommendations.improvements.optional.enhancements),
      ...this.generateList('Optimizations', recommendations.improvements.optional.optimizations)
    );

    // Implementation Guide
    content.push(
      new Paragraph({
        text: 'Implementation Guide',
        heading: HeadingLevel.HEADING_2,
      }),
      ...this.generateList('Priority Order', recommendations.implementationGuide.priorityOrder),
      ...this.generateList('Potential Impact', recommendations.implementationGuide.potentialImpact),
      new Paragraph({
        text: `Estimated Effort: ${recommendations.implementationGuide.estimatedEffort}`,
      })
    );

    return content;
  }

  private generateList(title: string, items: string[]): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    paragraphs.push(
      new Paragraph({
        text: title,
        children: [
          new TextRun({
            text: title,
            bold: true,
          }),
        ],
      })
    );

    if (items.length === 0) {
      paragraphs.push(
        new Paragraph({
          text: 'Не знайдено',
        })
      );
    } else {
      items.forEach((item) => {
        paragraphs.push(
          new Paragraph({
            text: item,
            bullet: {
              level: 0,
            },
          })
        );
      });
    }

    return paragraphs;
  }
}
