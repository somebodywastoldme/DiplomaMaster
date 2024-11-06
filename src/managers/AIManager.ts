 
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { systemPromptTemplate, generatePrompt } from './Prompts';
import * as rdfLib from 'rdflib';

// Define interfaces for each analysis result
export interface StructuralAnalysisResult {
  classHierarchyAnalysis: {
    completeness: string;
    missingElements: string[];
    structuralIssues: string[];
    recommendations: string[];
  };
  propertyAnalysis: {
    distribution: {
      wellDistributed: string[];
      underutilized: string[];
      overloaded: string[];
    };
    inheritanceIssues: string[];
    recommendations: string[];
  };
  relationshipAnalysis: {
    patterns: {
      common: string[];
      unusual: string[];
    };
    gaps: string[];
    recommendations: string[];
  };
}

export interface SemanticAnalysisResult {
  namingAnalysis: {
    conventions: {
      status: string;
      issues: string[];
    };
    terminology: {
      consistency: string;
      problems: string[];
    };
    recommendations: string[];
  };
  conceptualAnalysis: {
    completeness: string;
    gaps: string[];
    improvements: string[];
  };
  domainAlignment: {
    coverage: string;
    missingConcepts: string[];
    recommendations: string[];
  };
  semanticRelationships: {
    consistency: string;
    issues: string[];
    suggestions: string[];
  };
}

export interface LogicalAnalysisResult {
  logicalAnalysis: {
    contradictions: string[];
    circularDependencies: string[];
    constraintIssues: string[];
  };
  consistencyCheck: {
    domainRangeIssues: string[];
    cardinalityProblems: string[];
    disjointnessViolations: string[];
  };
  axiomAnalysis: {
    correctness: string;
    completeness: string;
    issues: string[];
    recommendations: string[];
  };
}

export interface RecommendationsResult {
  improvements: {
    critical: {
      structural: string[];
      semantic: string[];
      logical: string[];
    };
    recommended: {
      structural: string[];
      semantic: string[];
      documentation: string[];
    };
    optional: {
      enhancements: string[];
      optimizations: string[];
    };
  };
  implementationGuide: {
    priorityOrder: string[];
    potentialImpact: string[];
    estimatedEffort: string;
  };
}

export interface AnalysisResult {
  structural?: StructuralAnalysisResult;
  semantic?: SemanticAnalysisResult;
  logical?: LogicalAnalysisResult;
  recommendations?: RecommendationsResult;
}


const StructuralAnalysisSchema = z.object({
  classHierarchyAnalysis: z.object({
    completeness: z.string(),
    missingElements: z.array(z.string()),
    structuralIssues: z.array(z.string()),
    recommendations: z.array(z.string()),
  }),
  propertyAnalysis: z.object({
    distribution: z.object({
      wellDistributed: z.array(z.string()),
      underutilized: z.array(z.string()),
      overloaded: z.array(z.string()),
    }),
    inheritanceIssues: z.array(z.string()),
    recommendations: z.array(z.string()),
  }),
  relationshipAnalysis: z.object({
    patterns: z.object({
      common: z.array(z.string()),
      unusual: z.array(z.string()),
    }),
    gaps: z.array(z.string()),
    recommendations: z.array(z.string()),
  }),
});

const SemanticAnalysisSchema = z.object({
  namingAnalysis: z.object({
    conventions: z.object({
      status: z.string(),
      issues: z.array(z.string()),
    }),
    terminology: z.object({
      consistency: z.string(),
      problems: z.array(z.string()),
    }),
    recommendations: z.array(z.string()),
  }),
  conceptualAnalysis: z.object({
    completeness: z.string(),
    gaps: z.array(z.string()),
    improvements: z.array(z.string()),
  }),
  domainAlignment: z.object({
    coverage: z.string(),
    missingConcepts: z.array(z.string()),
    recommendations: z.array(z.string()),
  }),
  semanticRelationships: z.object({
    consistency: z.string(),
    issues: z.array(z.string()),
    suggestions: z.array(z.string()),
  }),
});

const LogicalAnalysisSchema = z.object({
  logicalAnalysis: z.object({
    contradictions: z.array(z.string()),
    circularDependencies: z.array(z.string()),
    constraintIssues: z.array(z.string()),
  }),
  consistencyCheck: z.object({
    domainRangeIssues: z.array(z.string()),
    cardinalityProblems: z.array(z.string()),
    disjointnessViolations: z.array(z.string()),
  }),
  axiomAnalysis: z.object({
    correctness: z.string(),
    completeness: z.string(),
    issues: z.array(z.string()),
    recommendations: z.array(z.string()),
  }),
});

const RecommendationsSchema = z.object({
  improvements: z.object({
    critical: z.object({
      structural: z.array(z.string()),
      semantic: z.array(z.string()),
      logical: z.array(z.string()),
    }),
    recommended: z.object({
      structural: z.array(z.string()),
      semantic: z.array(z.string()),
      documentation: z.array(z.string()),
    }),
    optional: z.object({
      enhancements: z.array(z.string()),
      optimizations: z.array(z.string()),
    }),
  }),
  implementationGuide: z.object({
    priorityOrder: z.array(z.string()),
    potentialImpact: z.array(z.string()),
    estimatedEffort: z.string(),
  }),
});

const UpdatedOntologySchema = z.object({
  updatedOntology: z.array(z.object({
      subject: z.string(),
      predicate: z.string(),
      object: z.string(),
      objectType: z.enum(['uri', 'literal'])
  }))
});

export class OntologyAnalysisManager {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true  });
  }

  private async sendPromptWithSchema<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    schemaName: string
  ): Promise<T> {
    try {
      const response = await this.openai.beta.chat.completions.parse({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPromptTemplate },
          { role: 'user', content: prompt },
        ],
        response_format: zodResponseFormat(schema, schemaName),
      });

      return response.choices[0].message.parsed as T;
    } catch (error) {
      throw new Error(`Failed to send prompt: ${error}`);
    }
  }

  public async analyzeOntology(ontologyString: string): Promise<AnalysisResult> {
    const results: AnalysisResult = {};

    try {
      const structuralPrompt = await generatePrompt(ontologyString, { type: 'structural' });
      const structuralResponse = await this.sendPromptWithSchema<StructuralAnalysisResult>(
        structuralPrompt,
        StructuralAnalysisSchema,
        'structural_analysis'
      );
      results.structural = structuralResponse;
    } catch (error) {
      console.error('Error in Structural Analysis:', error);
    }

    try {
      const semanticPrompt = await generatePrompt(ontologyString, { type: 'semantic' });
      const semanticResponse = await this.sendPromptWithSchema<SemanticAnalysisResult>(
        semanticPrompt,
        SemanticAnalysisSchema,
        'semantic_analysis'
      );
      results.semantic = semanticResponse;
    } catch (error) {
      console.error('Error in Semantic Analysis:', error);
    }

    try {
      const logicalPrompt = await generatePrompt(ontologyString, { type: 'logical' });
      const logicalResponse = await this.sendPromptWithSchema<LogicalAnalysisResult>(
        logicalPrompt,
        LogicalAnalysisSchema,
        'logical_analysis'
      );
      results.logical = logicalResponse;
    } catch (error) {
      console.error('Error in Logical Analysis:', error);
    }

    try {
      const recommendationsPrompt = await generatePrompt(ontologyString, { type: 'recommendations' });
      const recommendationsResponse = await this.sendPromptWithSchema<RecommendationsResult>(
        recommendationsPrompt,
        RecommendationsSchema,
        'recommendations'
      );
      results.recommendations = recommendationsResponse;
    } catch (error) {
      console.error('Error in Recommendations Analysis:', error);
    }

    return results;
  }

  public async improveOntology(ontologyString: string, analyses: AnalysisResult): Promise<string | undefined> {
    try {
        const improvementPrompt = await generatePrompt(ontologyString, { type: 'improvement' }, analyses);
        const updatedOntologyResponse = await this.sendPromptWithSchema(
            improvementPrompt,
            UpdatedOntologySchema,
            'updated_ontology'
        );
        console.log('Updated Ontology:', updatedOntologyResponse);

        const updatedOntology = updatedOntologyResponse.updatedOntology;

        if (updatedOntology) {
            const store = rdfLib.graph();
            const baseUrl = 'http://example.org/';
            const contentType = 'application/rdf+xml';

            // Parse the original ontology into the store
            await new Promise<void>((resolve, reject) => {
                rdfLib.parse(ontologyString, store, baseUrl, contentType, (err) => {
                    if (err) {
                        reject(new Error(`Failed to parse RDF: ${err.message}`));
                    } else {
                        resolve();
                    }
                });
            });

            // Add updated triples to the store
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updatedOntology.forEach((triple: any) => {
                const subject = rdfLib.sym(triple.subject);
                const predicate = rdfLib.sym(triple.predicate);
                let object;

                // Check if the object is a literal or a URI
                if (triple.objectType === 'literal') {
                    object = rdfLib.literal(triple.object);
                } else {
                    object = rdfLib.sym(triple.object);
                }
                store.add(subject, predicate, object);
            });

            // Serialize the updated store back to RDF/XML
            const updatedOntologyString = rdfLib.serialize(null, store, baseUrl, 'application/rdf+xml');
            console.log('Merged Ontology:', updatedOntologyString);
            return updatedOntologyString;
        } else {
            throw new Error('No updated ontology received');
        }
    } catch (error) {
        console.error('Error in Ontology Improvement:', error);
        return undefined;
    }
}
  public async test(ontologyString: string): Promise<StructuralAnalysisResult | undefined> {
    try {
      const structuralPrompt = await generatePrompt(ontologyString, { type: 'structural' });
      const structuralResponse = await this.sendPromptWithSchema<StructuralAnalysisResult>(
        structuralPrompt,
        StructuralAnalysisSchema,
        'structural_analysis'
      );
      console.log('Structural Analysis:', structuralResponse);
      return structuralResponse;
    } catch (error) {
      console.error('Error in Structural Analysis:', error);
      return undefined;
    }
  }
}
