"use client";
import Image from "next/image";
import { useState } from "react";

interface MemberData {
  Member_Name: string;
  Division_Name: string;
  UC: string;
  Tehsil_Name: string;
  Post_Office: string;
  CNIC: string;
}

export default function Home() {
  const [cnic, setCnic] = useState("");
  const [data, setData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    if (!cnic.trim()) {
      setError("Please enter a valid CNIC.");
      setShowModal(true);
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch(`/api/view-result?CNIC=${cnic}`);

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to fetch data.");
      }

      const result = await response.json();

      if (!result || !result.result) {
        throw new Error(result.message || "Invalid response from the server.");
      }

      setData(result.result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-10 bg-gray-100">
      <main className="flex flex-col gap-6 items-center bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md">
        <Image src="/logo.svg" alt="Logo" width={150} height={32} priority />

        <h1 className="text-lg sm:text-xl font-semibold text-black text-center">
          Enter Your CNIC Number
        </h1>

        {/* Input Section */}
        <div className="flex w-full gap-2 flex-col sm:flex-row">
          <input
            type="text"
            placeholder="321021*******"
            value={cnic}
            onChange={(e) => setCnic(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm text-black"
          />
          <button
            onClick={fetchData}
            className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Search
          </button>
        </div>

        {/* Display Data */}
        {loading && <p className="text-blue-600">Loading...</p>}

        {data && (
          <div className="bg-gray-100 p-4 rounded-lg w-full mt-4 text-black text-sm sm:text-base">
            <h2 className="text-lg font-semibold">Member Details</h2>

            <p>
              <strong>CNIC:</strong> {data.CNIC}
            </p>

            <p>
              <strong>Name:</strong> {data.Member_Name}
            </p>
            <p>
              <strong>Division:</strong> {data.Division_Name}
            </p>
            <p>
              <strong>UC:</strong> {data.UC}
            </p>
            <p>
              <strong>Tehsil:</strong> {data.Tehsil_Name}
            </p>
            <p>
              <strong>Post Office:</strong> {data.Post_Office}
            </p>
          </div>
        )}
      </main>

      <footer className="mt-6 text-gray-800 text-xs sm:text-sm text-center">
        Developed By Ghulam Shabbir ❤️
      </footer>

      {/* Error Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold text-red-600">Error</h2>
            <p className="text-black mt-2">{error}</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
