"use client";

type Item = {
  id: string;
  name: string;
  image?: string; // Included image in type definition based on your usage
};

export default function SelectModal({
  title,
  items,
  onSelect,
  onClose,
}: {
  title: string;
  items: Item[];
  onSelect: (item: Item) => void;
  onClose: () => void;
}) {
  return (
    /* Softened background with backdrop blur to match our pretty theme */
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[120]">
      <div className="bg-white w-[400px] rounded-[2rem] p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-blue-600"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 italic">Select Service</span>
          </div>
          <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase">{title}</h2>
        </div>

        {/* Items List */}
        <div className="space-y-2 max-h-72 overflow-auto pr-2 custom-scrollbar">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full group flex items-center justify-between px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl hover:bg-white hover:border-blue-400 hover:shadow-md hover:shadow-blue-50 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-100 group-hover:border-blue-100 transition-colors">
                  <img className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100 transition-opacity" src={`${item.image}`} alt={item.name}/>
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 tracking-tight">{item.name}</span>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

// "use client";

// type Item = {
//   id: string;
//   name: string;
// };

// export default function SelectModal({
//   title,
//   items,
//   onSelect,
//   onClose,
// }: {
//   title: string;
//   items: Item[];
//   onSelect: (item: Item) => void;
//   onClose: () => void;
// }) {
//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white w-96 rounded-lg p-4">
//         <h2 className="text-lg font-bold mb-3">{title}</h2>

//         <div className="space-y-2 max-h-60 overflow-auto">
//           {items.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => onSelect(item)}
//               className="w-full text-left px-3 py-2 border rounded hover:bg-gray-100"
//             >
//              <div className="flex"><img className= "w-5 mr-2"src={`${item.image}`}/>    {item.name}</div>
//             </button>
//           ))}
//         </div>

//         <button
//           onClick={onClose}
//           className="mt-4 text-sm text-gray-500"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// }
