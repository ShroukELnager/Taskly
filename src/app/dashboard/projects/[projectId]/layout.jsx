
export default function Sidebarlayout({ children }) {
  return (
    <div className="h-screen flex bg-[#F9F9FF] ">

        <div className="flex-1 p-4 ">
          {children}

        </div>

      </div>

    
  );
}