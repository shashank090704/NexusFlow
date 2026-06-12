"use client";
import { useState } from "react";

type Props = {
  node: any;
  onChange: (metadata: any) => void;
  onClose: () => void;
};

export default function ConfigPanel({ node, onChange, onClose }: Props) {
  // We use state to track inputs locally before the user hits "Submit"
  const [field1, setField1] = useState(""); // Used for 'To' or 'Address' or sheetId
  const [field2, setField2] = useState(""); // Used for 'Body' or 'Amount' or sheetName
  const [field3, setField3] = useState(""); // Used for values

  const label = node.data.label.toLowerCase();
  const metadata = node.data.metadata || {};

  const handleSubmit = () => {
    // Determine the keys based on the label
    const updatedMetadata = { ...metadata };

    if (label === "send email") {
      updatedMetadata.email = field1;
      updatedMetadata.body = field2;
    } else if (label === "send money") {
      updatedMetadata.address = field1;
      updatedMetadata.amount = field2;
      updatedMetadata.senderKey = field3;
    }
    else if(label ==="google sheet"){
      updatedMetadata.sheetId = field1;
      updatedMetadata.sheetName = field2;
      updatedMetadata.values = field3;
    }

    onChange(updatedMetadata);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[110]">
      <div className="bg-white w-[400px] rounded-[2rem] p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-blue-600"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Step Settings</span>
          </div>
          <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase">
            {node.data.label}
          </h2>
        </div>

        <div className="space-y-5">
          {/* CONDITIONALLY RENDER FIELDS */}
          {label === "send email" && (
            <>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">To Email</label>
                <input 
                  className="w-full border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 bg-gray-50/50 font-medium" 
                  placeholder="{comment.email}" 
                  onChange={(e) => setField1(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Message Body</label>
                <textarea 
                  rows={3}
                  className="w-full border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 bg-gray-50/50 font-medium resize-none" 
                  placeholder="Write your email content..." 
                  onChange={(e) => setField2(e.target.value)} 
                />
              </div>
            </>
          )}
          
          {label === "send money" && (
            <>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Wallet Address Reciever</label>
                <input 
                  className="w-full border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 bg-gray-50/50 font-medium" 
                  placeholder="{comment.address}" 
                  onChange={(e) => setField1(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Amount (SOL)</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 bg-gray-50/50 font-medium" 
                  placeholder="{comment.amount}" 
                  onChange={(e) => setField2(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1 text-red-400">Secret Key</label>
                <input 
                  type="text" 
                  className="w-full border border-red-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-red-500/10 focus:border-red-400 outline-none transition-all placeholder:text-gray-400 bg-red-50/20 font-mono" 
                  placeholder="Secret Key of your temperary wallet" 
                  onChange={(e) => setField3(e.target.value)} 
                />
                <h6 className="text-[10px] font-bold text-red-500 mt-2 italic px-1">
                  Caution : Make a seperate wallet for automation
                </h6>
              </div>
            </>
          )}

          {label === "google sheet" && (
            <>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Sheet ID</label>
                <input 
                  className="w-full border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 bg-gray-50/50 font-medium" 
                  placeholder="Between d/..../edit in url" 
                  onChange={(e) => setField1(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Sheet Name</label>
                <input 
                  className="w-full border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 bg-gray-50/50 font-medium" 
                  placeholder="written at bottom left" 
                  onChange={(e) => setField2(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Values</label>
                <input 
                  className="w-full border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 bg-gray-50/50 font-medium" 
                  placeholder="[{comment.email}, {comment.amount}...]" 
                  onChange={(e) => setField3(e.target.value)} 
                />
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end items-center space-x-4">
          <button 
            onClick={onClose} 
            className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            Save Node
          </button>
        </div>
      </div>
    </div>
  );
}


// "use client";


// import { useState } from "react";

// type Props = {
//   node: any;
//   onChange: (metadata: any) => void;
//   onClose: () => void;
// };

// export default function ConfigPanel({ node, onChange, onClose }: Props) {
//   // We use state to track inputs locally before the user hits "Submit"
//   const [field1, setField1] = useState(""); // Used for 'To' or 'Address' or sheetId
//   const [field2, setField2] = useState(""); // Used for 'Body' or 'Amount' or sheetName
//   const [field3, setField3] = useState(""); // Used for values

//   const label = node.data.label.toLowerCase();
//   const metadata = node.data.metadata || {};

//   const handleSubmit = () => {
//     // Determine the keys based on the label
//     const updatedMetadata = { ...metadata };

//     if (label === "send email") {
//       updatedMetadata.email = field1;
//       updatedMetadata.body = field2;
//     } else if (label === "send money") {
//       updatedMetadata.address = field1;
//       updatedMetadata.amount = field2;
//       updatedMetadata.senderKey = field3;
//     }
//     else if(label ==="google sheet"){
//       updatedMetadata.sheetId = field1;
//       updatedMetadata.sheetName = field2;
//       updatedMetadata.values = field3;
//     }

//     onChange(updatedMetadata);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white w-96 rounded-lg p-6 shadow-xl">
//         <h2 className="text-lg font-bold mb-4 border-b pb-2 uppercase">
//           {node.data.label} Configuration
//         </h2>

//         <div className="space-y-4">
//           {/* CONDITIONALLY RENDER FIELDS */}
//           {label === "send email" && (
//             <>
//               <div>
//                 <label className="block text-xs font-bold uppercase text-gray-500">To Email</label>
//                 <input 
//                   className="w-full border p-2 rounded" 
//                   placeholder="{comment.email}" 
//                   onChange={(e) => setField1(e.target.value)} 
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold uppercase text-gray-500">Message Body</label>
//                 <textarea 
//                   className="w-full border p-2 rounded" 
//                   placeholder="Write your email content..." 
//                   onChange={(e) => setField2(e.target.value)} 
//                 />
//               </div>
//             </>
//           )}
          
//           {label === "send money" && (
//             <>
//               <div>
//                 <label className="block text-xs font-bold uppercase text-gray-500">Wallet Address Reciever</label>
//                 <input 
//                   className="w-full border p-2 rounded" 
//                   placeholder="{comment.address}" 
//                   onChange={(e) => setField1(e.target.value)} 
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold uppercase text-gray-500">Amount (SOL)</label>
//                 <input 
//                   type="text" 
//                   className="w-full border p-2 rounded" 
//                   placeholder="{comment.amount}" 
//                   onChange={(e) => setField2(e.target.value)} 
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold uppercase text-gray-500">Secret Key</label>
//                 <input 
//                   type="text" 
//                   className="w-full border p-2 rounded" 
//                   placeholder="Secret Key of your temperary wallet" 
//                   onChange={(e) => setField3(e.target.value)} 
//                 />
//                 <h6 className="text-sm text-red-500 mt-2">Caution : Make a seperate wallet for automation</h6>
//               </div>
//             </>
//           )}

//           {label === "google sheet" && (
//             <>
//               <div>

//                 <label className="block text-xs font-bold uppercase text-gray-500">Sheet ID</label>
                
//                 <input 
//                   className="w-full border p-2 rounded" 
//                   placeholder="Between d/..../edit in url of sheet" 
//                   onChange={(e) => setField1(e.target.value)} 
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold uppercase text-gray-500">Sheet Name</label>
//                 <input 
//                   className="w-full border p-2 rounded" 
//                   placeholder="written at bottom left of the sheet" 
//                   onChange={(e) => setField2(e.target.value)} 
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold uppercase text-gray-500">Values</label>
//                 <input 
//                   className="w-full border p-2 rounded" 
//                   placeholder="[{comment.email}, {comment.amount}...]" 
//                   onChange={(e) => setField3(e.target.value)} 
//                 />
//               </div>
//             </>
//           )}
//         </div>

//         <div className="mt-6 flex justify-end space-x-2">
//           <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-bold"
//           >
//             Save Configuration
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }