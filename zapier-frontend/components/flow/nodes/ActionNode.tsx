import { Handle, Position } from "reactflow";

export default function ActionNode({ data }: any) {
  return (
    <div className="bg-white border px-2 py-1 rounded shadow">
      <strong className="text-sm">Action</strong>
      <div className="flex">
        <img className= "w-4 mr-2"src={`${data.image}`}/>
        <p className="text-xs">{data.label}</p>
        
      </div>
      {/* incoming arrow */}
      <Handle type="target" position={Position.Top} />
      {/* outgoing arrow */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
