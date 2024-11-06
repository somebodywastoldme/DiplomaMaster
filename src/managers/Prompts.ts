/* eslint-disable @typescript-eslint/no-explicit-any */
import * as rdfLib from 'rdflib';
import { AnalysisResult } from './AIManager';

interface OntologyAnalysisPromptOptions {
    type: 'structural' | 'semantic' | 'logical' | 'recommendations' | 'improvement';
}

export const systemPromptTemplate =  `You are an expert system specialized in ontology analysis with deep understanding of semantic web
    technologies, knowledge representation, and ontology engineering principles. Your task is to perform comprehensive analysis of ontologies
    while maintaining strict adherence to established ontological principles and best practices in knowledge engineering.
    Your responses should be:
    1.	Detailed but concise
    2.	Technically precise
    3.	Well-structured
    4.	Focused on practical improvements
    5.	Based on established ontology design patterns
    Always provide your analysis in the specified JSON format while ensuring semantic accuracy and logical consistency in your recommendations.
    All answers must be in ukrainian language.
    `

// Define prompt templates
const structuralPromptTemplate = (ontology: any) => `Analyze the structure of the provided ontology focusing on the following aspects:
    1. Class Hierarchy Analysis:
    1. Evaluate the completeness of class hierarchy
    2. Identify potential missing classes or relationships
    3. Check for structural anomalies
    4. Assess the balance and depth of the hierarchy
    2. Property Distribution:
    1. Analyze the distribution of properties across classes
    2. Identify underutilized or overloaded classes
    3. Check for property inheritance patterns
    4. Evaluate property restrictions and constraints
    3. Relationship Patterns:
    1. Examine the types and patterns of relationships
    2. Identify potential redundant or missing relationships
    3. Analyze the connectivity between concepts
    4. Check for isolated components or dead-ends

    Ontology in JSON format:
    \`\`\`
    ${JSON.stringify(ontology, null, 2)}
    \`\`\`

    Provide your analysis in the following JSON structure:
    {
        "classHierarchyAnalysis": {
            "completeness": string,
            "missingElements": string[],
            "structuralIssues": string[],
            "recommendations": string[]
        },
        "propertyAnalysis": {
            "distribution": {
                "wellDistributed": string[],
                "underutilized": string[],
                "overloaded": string[]
            },
            "inheritanceIssues": string[],
            "recommendations": string[]
        },
        "relationshipAnalysis": {
            "patterns": {
                "common": string[],
                "unusual": string[]
            },
            "gaps": string[],
            "recommendations": string[]
        }
    }`;

const semanticPromptTemplate = (ontology: any) => `
    Perform a detailed semantic analysis of the ontology with focus on:
    1. Naming and Labeling:
    1.	Consistency of naming conventions
    2.	Clarity and meaningfulness of labels
    3.	Appropriate use of terminology
    4.	Language consistency
    2. Concept Definitions:
    1.	Completeness of concept definitions
    2.	Clarity of class descriptions
    3.	Appropriate use of annotations
    4.	Semantic precision
    3. Domain Alignment:
    1.	Alignment with domain terminology
    2.	Coverage of domain concepts
    3.	Semantic gaps
    4.	Conceptual accuracy
    4. Semantic Relationships:
    1.	Meaningfulness of relationships
    2.	Semantic consistency
    3.	Relationship appropriateness
    4.	Conceptual integrity

    Ontology in JSON format:
    \`\`\`
    ${JSON.stringify(ontology, null, 2)}
    \`\`\`

    Return analysis in this JSON format:
    {
        "namingAnalysis": {
            "conventions": {
                "status": string,
                "issues": string[]
            },
            "terminology": {
                "consistency": string,
                "problems": string[]
            },
            "recommendations": string[]
        },
        "conceptualAnalysis": {
            "completeness": string,
            "gaps": string[],
            "improvements": string[]
        },
        "domainAlignment": {
            "coverage": string,
            "missingConcepts": string[],
            "recommendations": string[]
        },
        "semanticRelationships": {
            "consistency": string,
            "issues": string[],
            "suggestions": string[]
        }
    }`;

const logicalPromptTemplate = (ontology: any) => `
    Analyze the logical consistency of the ontology focusing on:
    1. Logical Structure:
    1.	Identify logical contradictions
    2.	Check for circular dependencies
    3.	Validate logical constraints
    4.	Evaluate inference patterns
    2. Consistency Rules:
    1.	Domain and range constraints
    2.	Cardinality restrictions
    3.	Disjointness assertions
    4.	Property characteristics
    3. Formal Axioms:
    1.	Correctness of axiom definitions
    2.	Completeness of logical rules
    3.	Consistency of restrictions
    4.	Inference implications

    \`\`\`
    ${JSON.stringify(ontology, null, 2)}
    \`\`\`

    Provide analysis in the following structure:
    {
        "logicalAnalysis": {
            "contradictions": string[],
            "circularDependencies": string[],
            "constraintIssues": string[]
        },
        "consistencyCheck": {
            "domainRangeIssues": string[],
            "cardinalityProblems": string[],
            "disjointnessViolations": string[]
        },
        "axiomAnalysis": {
            "correctness": string,
            "completeness": string,
            "issues": string[],
            "recommendations": string[]
        }
    }
    `;

const recommendationsPromptTemplate = (ontology: any) => `
    Based on the analysis of the ontology, provide comprehensive recommendations for improvement focusing on:
    1. Structural Improvements:
    1.	Class hierarchy optimization
    2.	Property organization
    3.	Relationship enhancement
    4.	Structural patterns
    2. Semantic Enhancements:
    1.	Naming improvements
    2.	Definition clarity
    3.	Semantic precision
    4.	Domain coverage
    3. Quality Improvements:
    1.	Documentation enhancement
    2.	Reusability improvements
    3.	Maintainability suggestions
    4.	Best practices alignment

    Ontology in JSON format:
    \`\`\`
    ${JSON.stringify(ontology, null, 2)}
    \`\`\`

    Format recommendations as:
    {
        "improvements": {
            "critical": {
                "structural": string[],
                "semantic": string[],
                "logical": string[]
            },
            "recommended": {
                "structural": string[],
                "semantic": string[],
                "documentation": string[]
            },
            "optional": {
                "enhancements": string[],
                "optimizations": string[]
            }
        },
        "implementationGuide": {
            "priorityOrder": string[],
            "potentialImpact": string[],
            "estimatedEffort": string
        }
    }`;

const improvementPromptTemplate = (ontology: any, analyses: AnalysisResult) => `
    As an expert ontology engineer, your task is to update the provided ontology to resolve the identified issues and implement the recommended improvements from the analyses below. The updated ontology should adhere to best practices in ontology engineering, maintain logical consistency, and enhance overall quality.
    
    **Instructions:**
    
    1. **Review the Provided Ontology:**
       - Carefully examine the ontology given in JSON format.
    
    2. **Consider the Analyses and Recommendations:**
       - Analyze the issues and recommendations from the structural, semantic, logical analyses, and overall recommendations.
    
    3. **Update the Ontology:**
       - Modify or add ontology elements to address each identified issue.
       - Implement the suggested improvements thoroughly.
       - Ensure that changes do not introduce new inconsistencies or errors.
       - Follow established ontology design patterns and best practices.
    
    4. **Prepare the Updated Ontology Elements:**
       - Provide only the modified or newly added ontology elements.
       - Ensure that the output can be seamlessly merged with the existing ontology.
    
    **Ontology in JSON format:**
    \`\`\`
    ${JSON.stringify(ontology, null, 2)}
    \`\`\`
    
    **Analyses and Recommendations:**
    \`\`\`
    ${JSON.stringify(analyses, null, 2)}
    \`\`\`
    
    **Provide the updated ontology elements in the following JSON format:**
    \`\`\`
    {
      "updatedOntology": [
        {
          "subject": "string",
          "predicate": "string",
          "object": "string",
          "objectType": "uri" | "literal"
        }
      ]
    }
    \`\`\`
    
    **Important Notes:**
    
    - Do not include the entire ontology; only provide the updated or new elements.
    - Ensure that all URIs and literals are correctly formatted.
    - Maintain consistency of namespaces and prefixes.
    - The updated ontology should be compatible with standard RDF formats.
    - Double-check for logical consistency and adherence to best practices.
    `;
    
export async function generatePrompt(ontologyString: string, options: OntologyAnalysisPromptOptions, analyses?: AnalysisResult): Promise<string> {
    try {
        // Step 1: Parse the RDF using rdflib
        const store = rdfLib.graph();
        const contentType = 'application/rdf+xml';
        const baseUrl = 'http://example.org/';

        const parsePromise = new Promise<void>((resolve, reject) => {
            rdfLib.parse(ontologyString, store, baseUrl, contentType, (err) => {
                if (err) {
                    reject(new Error(`Failed to parse RDF: ${err.message}`));
                } else {
                    console.log("RDF parsed successfully");
                    resolve();
                }
            });
        });

        await parsePromise;

        // Step 2: Convert parsed RDF to JSON structure using store.match()
        const ontologyJson: any = [];
        const triples = store.match(null, null, null); // Получить все триплеты (subject, predicate, object)

        triples.forEach((quad) => {
            ontologyJson.push({
                subject: quad.subject.value,
                predicate: quad.predicate.value,
                object: quad.object.value
            });
        });

        // Step 3: Generate the prompt based on selected options
        switch (options.type) {
            case 'structural':
                return structuralPromptTemplate(ontologyJson);
            case 'semantic':
                return semanticPromptTemplate(ontologyJson);
            case 'logical':
                return logicalPromptTemplate(ontologyJson);
            case 'recommendations':
                return recommendationsPromptTemplate(ontologyJson);
            case 'improvement':
                if (!analyses) {
                    throw new Error('Improvement analysis result is required for this prompt type');
                }
                return improvementPromptTemplate(ontologyJson, analyses);
            default:
                throw new Error('Invalid analysis type specified');
        }
    } catch (err) {
        throw new Error(`Failed to generate prompt: ${err}`);
    }
}



