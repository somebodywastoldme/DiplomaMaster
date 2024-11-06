import { useEffect, useRef, FC } from 'react';
import { Network, Node as VisNode, Edge as VisEdge } from 'vis-network';
import { DataSet } from 'vis-data';
import * as rdflib from 'rdflib';
import { Term } from 'rdflib/lib/tf-types';

interface NodeData {
  id: string;
  label: string;
  group: string;
  datatypeProperties: { [key: string]: string };
}

interface EdgeData {
  from: string;
  to: string;
  label: string;
  arrows: string;
  color?: string;
}

interface OntologyVisualizationProps {
  rdfData: string;
}

const OntologyVisualization: FC<OntologyVisualizationProps> = ({ rdfData }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (rdfData && containerRef.current) {
      visualizeData();
    }
  }, [rdfData]);

  const visualizeData = () => {
    if (!rdfData || !containerRef.current) return;

    const store = rdflib.graph();

    try {
      rdflib.parse(rdfData, store, 'http://example.org/', 'application/rdf+xml');
    } catch (error) {
      console.error('Ошибка парсинга RDF/XML данных:', error);
      return;
    }

    const nodesMap = new Map<string, NodeData>();
    const edges: EdgeData[] = [];

    const rdf = rdflib.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    // const rdfs = rdflib.Namespace('http://www.w3.org/2000/01/rdf-schema#');
    // const owl = rdflib.Namespace('http://www.w3.org/2002/07/owl#');

    // Обработка всех триплетов в графе
    store.statements.forEach((stmt) => {
      const subject = stmt.subject;
      const predicate = stmt.predicate;
      const object = stmt.object;

      // Обработка узлов
      [subject, object].forEach((node) => {
        if (node.termType === 'BlankNode' || node.termType === 'NamedNode') {
          const nodeId = node.value;
          if (!nodesMap.has(nodeId)) {
            nodesMap.set(nodeId, {
              id: nodeId,
              label: '',
              group: getNodeGroup(node, store),
              datatypeProperties: {},
            });
          }
        }
      });

      const subjectId = subject.value;

      // Обработка дататиповых свойств (где объектом является литерал)
      if ((subject.termType === 'NamedNode' || subject.termType === 'BlankNode') && object.termType === 'Literal') {
        const nodeData = nodesMap.get(subjectId);
        if (nodeData) {
          const propLabel = getLabel(predicate.value);
          nodeData.datatypeProperties[propLabel] = object.value;
        }
      }

      // Обработка объектных свойств (где объектом является узел)
      if ((subject.termType === 'NamedNode' || subject.termType === 'BlankNode') && (object.termType === 'NamedNode' || object.termType === 'BlankNode')) {
        const predicateLabel = getLabel(predicate.value);

        // Исключаем rdf:type, чтобы не перегружать граф
        if (predicate.value !== rdf('type').value) {
          edges.push({
            from: subjectId,
            to: object.value,
            label: predicateLabel,
            arrows: 'to',
            color: getEdgeColor(predicate.value),
          });
        }
      }
    });

    // Генерация меток узлов с включением дататиповых свойств
    nodesMap.forEach((nodeData, nodeId) => {
      const node = rdflib.sym(nodeId);
      const nodeLabel = getNodeLabel(node, store);
      const datatypeProps = nodeData.datatypeProperties;
      let label = nodeLabel;

      Object.entries(datatypeProps).forEach(([prop, value]) => {
        label += `\n${prop}: ${value}`;
      });

      nodeData.label = label;
    });

    // Преобразование данных для vis-network
    const nodesData = Array.from(nodesMap.values());

    const nodes: VisNode[] = nodesData.map((node) => ({
      id: node.id,
      label: node.label,
      group: node.group,
      shape: 'box',
      widthConstraint: {
        minimum: 150,
      },
    }));

    const data = {
      nodes: new DataSet<VisNode>(nodes),
      edges: new DataSet<VisEdge>(edges),
    };

    const options = {
      nodes: {
        shape: 'box',
        font: {
          align: 'left',
        },
      },
      edges: {
        smooth: false,
        arrows: {
          to: {
            enabled: true,
            type: 'arrow',
            scaleFactor: 1,
          },
        },
        color: {
          color: '#848484',
          inherit: false,
        },
        font: {
          align: 'middle',
        },
      },
      groups: {
        class: {
          color: { background: '#FFD700', border: '#000' },
          shape: 'box',
        },
        individual: {
          color: { background: '#7BE141', border: '#000' },
          shape: 'ellipse',
        },
        property: {
          color: { background: '#6E6EFD', border: '#000' },
          shape: 'diamond',
        },
        blankNode: {
          color: { background: '#AAAAAA', border: '#000' },
          shape: 'circle',
        },
      },
      layout: {
        improvedLayout: true,
      },
      physics: {
        enabled: true,
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 25,
        },
        solver: 'repulsion',
        repulsion: {
          nodeDistance: 100,
          centralGravity: 0.02,
          springLength: 200,
          springConstant: 0.05,
          damping: 0.09,
        },
        minVelocity: 0.75,
        timestep: 0.5,
      },
      interaction: {
        dragNodes: true,
        dragView: true,
        zoomView: true,
        navigationButtons: true,
        keyboard: true,
      },
    };

    networkRef.current = new Network(containerRef.current, data, options);
  };

  const getNodeLabel = (node: Term, store: rdflib.IndexedFormula): string => {
    if (node.termType === 'NamedNode') {
      const labelStatements = store.statementsMatching(node as rdflib.NamedNode, rdflib.sym('http://www.w3.org/2000/01/rdf-schema#label'), null);
      if (labelStatements.length > 0) {
        return labelStatements[0].object.value;
      } else {
        return getLabel(node.value);
      }
    } else if (node.termType === 'BlankNode') {
      // Попробуем получить тип анонимного узла
      const typeStatements = store.statementsMatching(node as rdflib.NamedNode | rdflib.BlankNode, rdflib.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), null);
      if (typeStatements.length > 0) {
        return `[${getLabel(typeStatements[0].object.value)}]`;
      } else {
        return '[Анонимный узел]';
      }
    } else {
      return node.value;
    }
  };

  const getNodeGroup = (node: Term, store: rdflib.IndexedFormula): string => {
    if (node.termType === 'NamedNode') {
      // Проверяем, является ли узел классом
      if (store.holds(node as rdflib.NamedNode, rdflib.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), rdflib.sym('http://www.w3.org/2002/07/owl#Class'))) {
        return 'class';
      }
      // Проверяем, является ли узел свойством
      if (
        store.holds(node as rdflib.NamedNode, rdflib.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), rdflib.sym('http://www.w3.org/2002/07/owl#ObjectProperty')) ||
        store.holds(node as rdflib.NamedNode, rdflib.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), rdflib.sym('http://www.w3.org/2002/07/owl#DatatypeProperty'))
      ) {
        return 'property';
      }
      // Иначе считаем его индивидуумом
      return 'individual';
    } else if (node.termType === 'BlankNode') {
      return 'blankNode';
    } else {
      return 'literal';
    }
  };

  const getLabel = (uri: string) => {
    const fragmentIndex = uri.indexOf('#');
    if (fragmentIndex !== -1) {
      return uri.slice(fragmentIndex + 1);
    } else {
      const parts = uri.split('/');
      return parts[parts.length - 1] || uri;
    }
  };

  // Функция для определения цвета ребра в зависимости от типа свойства
  const getEdgeColor = (predicateUri: string): string => {
    // Вы можете настроить цвета для различных типов свойств
    if (predicateUri.includes('predatorOf') || predicateUri.includes('preyOf')) {
      return '#FF0000'; // Красный для отношений хищник-добыча
    } else if (predicateUri.includes('relatedTo')) {
      return '#0000FF'; // Синий для родственных связей
    } else {
      return '#848484'; // Стандартный цвет
    }
  };

  return (
    <div ref={containerRef} style={{ minHeight: '800px', minWidth: '1200px', border: '1px solid lightgray' }}></div>
  );
};

export default OntologyVisualization;
