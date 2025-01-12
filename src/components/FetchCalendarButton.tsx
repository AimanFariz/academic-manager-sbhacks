import { useRouter } from 'next/navigation';

export default function FetchCalendarButton() {
  const router = useRouter();

  const handleFetch = () => {
    router.push('./landingpage'); 
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={handleFetch}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        Fetch Calendar
      </button>
    </div>
  );
};

