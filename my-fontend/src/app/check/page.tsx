"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
export default function CheckTickets() {
  const [ticketId, setTicketId] = useState<string>("");
  const router = useRouter();
  const handleCheckTickets = () => {
    router.push(`/check/${ticketId}`);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#3b82f6] mb-6 text-center">
          Tra cứu vé xe
        </h1>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="ticketCode"
              className="block text-sm font-medium text-gray-700"
            >
              Nhập mã vé
            </label>
            <input
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              id="ticketCode"
              type="text"
              placeholder="Mã số vé"
              className="mt-1 block w-full px-4 py-2 text-gray-900 border border-[#3b82f6] rounded-lg focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleCheckTickets}
            type="button"
            className="w-full py-2 px-4 bg-[#3b82f6] text-white font-semibold rounded-lg hover:bg-[#3068c3] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
          >
            Tra cứu
          </button>
        </form>
      </div>
    </div>
  );
}
