import { Handle, Position } from "reactflow";

export default function TriggerNode({ data }: any) {
  return (
    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md w-38">
      <p className="text-xs uppercase opacity-80 mb-1">Trigger</p>
      <div className="flex">
        <img className= "w-3 mr-2"src={`${data.image}`}/>
        <p className="text-xs">{data.label}</p>
        
      </div>
      

      {/* outgoing connection */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
