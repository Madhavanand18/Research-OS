"use client";

import React, { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType
} from "reactflow";
import "reactflow/dist/style.css";
import { Entity, Relationship } from "../types/research";
import { Network } from "lucide-react";

interface KnowledgeGraphProps {
  entities: Entity[];
  relationships: Relationship[];
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphProps> = ({ entities, relationships }) => {
  const { nodes, edges } = useMemo(() => {
    const calculatedNodes: Node[] = entities.map((ent, i) => {
      // Calculate simple circular/grid coordinates
      const angle = (i / Math.max(entities.length, 1)) * 2 * Math.PI;
      const radius = 220;
      const x = 360 + radius * Math.cos(angle);
      const y = 260 + radius * Math.sin(angle);

      return {
        id: ent.name,
        data: {
          label: (
            <div className="p-2 text-center">
              <div className="text-[10px] uppercase font-bold text-zinc-400">
                {ent.entity_type}
              </div>
              <div className="text-xs font-semibold text-zinc-900 mt-0.5">
                {ent.name}
              </div>
            </div>
          ),
        },
        position: { x, y },
        style: {
          background: "#ffffff",
          border: "1px solid #e4e4e7",
          borderRadius: "8px",
          width: 140,
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        },
      };
    });

    const calculatedEdges: Edge[] = relationships.map((rel, i) => ({
      id: `e-${i}`,
      source: rel.source_entity,
      target: rel.target_entity,
      label: rel.relation_type,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color: "#71717a",
      },
      style: { stroke: "#a1a1aa", strokeWidth: 1.5 },
      labelStyle: { fill: "#52525b", fontSize: 10, fontWeight: 500 },
    }));

    return { nodes: calculatedNodes, edges: calculatedEdges };
  }, [entities, relationships]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center space-x-2">
            <Network className="w-6 h-6 text-zinc-700" />
            <span>Knowledge Graph</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Causal relationships and entities triangulated from research findings.
          </p>
        </div>
      </div>

      <div className="h-[600px] w-full bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        {entities.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-400 text-xs">
            No knowledge graph entities extracted yet.
          </div>
        ) : (
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <Background color="#e4e4e7" gap={16} />
            <Controls />
            <MiniMap
              nodeColor={() => "#e4e4e7"}
              maskColor="rgba(240, 240, 240, 0.6)"
            />
          </ReactFlow>
        )}
      </div>
    </div>
  );
};
