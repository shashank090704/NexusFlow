"use client";

import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import { useEffect, useState } from "react";

import TriggerNode from "./nodes/TriggerNode";
import ActionNode from "./nodes/ActionNode";
import SelectModal from "../modal/SelectModal";
import ConfigPanel from "./ConfigPanel";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

export default function FlowCanvas({
  onSave,
}: {
  onSave: (nodes: any[]) => void;
}) {
  // -------------------------
  // NODES & EDGES
  // -------------------------
    const {user} = useAuthStore()

  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "trigger",
      type: "trigger",
      
      position: { x: 300, y: 40 },
      data: {
        label: "Choose Trigger",
        image:"data:image/png;base64,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",
        metadata: {},
      },
    },
  ]);
  useEffect(() => {
    onSave(nodes);
    }, [nodes]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // -------------------------
  // AVAILABLE ACTIONS / TRIGGERS
  // -------------------------
  const [availableTriggers, setAvailableTriggers] = useState<any[]>([]);
  const [availableActions, setAvailableActions] = useState<any[]>([]);

  // -------------------------
  // MODAL + CONFIG STATE
  // -------------------------
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [modalType, setModalType] =
    useState<"trigger" | "action" | null>(null);

  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [modal2, setModal2] = useState<any>(null);

  // -------------------------
  // FETCH AVAILABLE DATA
  // -------------------------

  useEffect(() => {
    async function fetchAvailable() {
      const res = await axiosInstance.get("/zap/available");
      setAvailableTriggers(res.data.triggers);
      setAvailableActions(res.data.actions);
    }
    fetchAvailable();
  }, []);

  // -------------------------
  // HANDLE EDGE CONNECT
  // -------------------------
  const onConnect = (connection: Connection) => {
    setEdges((eds) =>
      addEdge(
        { ...connection, type: "smoothstep", animated: true },
        eds
      )
    );
  };

  // -------------------------
  // ADD ACTION NODE
  // -------------------------
  function addAction() {
    const actionCount = nodes.filter((n) => n.type === "action").length;
    const newId = `action-${actionCount + 1}`;

    const newNode = {
      id: newId,
      type: "action",
      
      position: { x: 300, y: 160 + actionCount * 120 },
      data: {
        label: "Choose Action",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjcOE86C5X0eEbUJv8Z9Tne9T82K8le4VFLw&sdata:image/jpeg;base64,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",
        metadata: {},
      },
    };

    const lastNode =
      nodes.length === 1 ? nodes[0] : nodes[nodes.length - 1];

    setNodes((nds) => [...nds, newNode]);

    setEdges((eds ) =>
      addEdge(
        {
          id: `e-${lastNode.id}-${newId}`,
          source: lastNode.id,
          target: newId,
          type: "smoothstep",
          animated: true,
        },
        eds
      )
    );
  }

  // -------------------------
  // HANDLE ACTION/TRIGGER SELECT
  // -------------------------
   function  handleSelect(item: any) {
    if(item.name=="Google Sheet"){
      
      if(!user?.oAuth ){
        alert("Please Sign in using Google to use this feature")
        return 
      }
    }
     setNodes((nds) =>
      nds.map((n) =>
        n.id === activeNodeId
          ? {
              ...n,
              data: {
                ...n.data,
                label: item.name,
                availId: item.id,
                image:item.image,

              },
            }
          : n
      )
    );

    setSelectedNode(
      {
        ...selectedNode,
              data: {
                ...selectedNode.data,
                label: item.name,
                availId: item.id,
                image:item.image,
              },
            }
    )

    setModalType(null);
    setActiveNodeId(null);
    {selectedNode?.type!="trigger" && setModal2(true);}
  }

  // -------------------------
  // UPDATE METADATA FROM CONFIG PANEL
  // -------------------------
  function updateNodeMetadata(metadata: any) {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? {
              ...n,
              data: {
                ...n.data,
                metadata,
              },
            }
          : n
      )
    );

    setSelectedNode((prev: any) => ({
      ...prev,
      data: {
        ...prev.data,
        metadata,
      },
    }));
  }

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <div className="relative h-[650px] border rounded-lg">

      {/* ADD ACTION BUTTON */}
      <button
        onClick={addAction}
        className="absolute z-50 top-4 left-4 px-4 py-2 bg-black text-white rounded shadow"
      >
        + Add Action
      </button>

      {/* REACT FLOW */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => {
          setActiveNodeId(node.id);
          setModalType(node.type as "trigger" | "action");
          setSelectedNode(node);
        }}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
      >
        <Background />
        <Controls />
      </ReactFlow>

      {/* SELECT TRIGGER / ACTION MODAL */}
      {modalType && (
        <SelectModal
          title={ // displayed on the top of modal
            modalType === "trigger"
              ? "Choose Trigger"
              : "Choose Action"
          }
          items={
            modalType === "trigger"
              ? availableTriggers
              : availableActions
          }
          onSelect={handleSelect}
          onClose={() => setModalType(null)}
        />
      )}

      {/* RIGHT-SIDE CONFIG PANEL */}
      {modal2 && selectedNode?.type!="trigger" && (
        <ConfigPanel
          node={selectedNode}
          onChange={updateNodeMetadata}
          onClose={() => {setSelectedNode(null),setModal2(null)}}
        />
      )}
    </div>
  );
}
