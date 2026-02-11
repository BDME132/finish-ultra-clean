"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Newsletter, SubscribersResponse } from "@/types/newsletter";

interface DashboardData {
  subscriberCount: number;
  newsletters: Newsletter[];
  loading: boolean;
  error: string | null;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    subscriberCount: 0,
    newsletters: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/subscribers");
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const json: SubscribersResponse = await res.json();
        setData({
          subscriberCount: json.count || 0,
          newsletters: [], // Newsletters will be fetched separately if needed
          loading: false,
          error: null,
        });
      } catch (err) {
        setData((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }));
      }
    }
    fetchData();
  }, []);

  if (data.loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error: {data.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subscriber Count Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            Total Subscribers
          </h2>
          <p className="text-4xl font-bold text-blue-600">
            {data.subscriberCount}
          </p>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-600 mb-4">
            Quick Actions
          </h2>
          <Link
            href="/admin/newsletter"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send Newsletter
          </Link>
        </div>
      </div>

      {/* Recent Newsletters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-600 mb-4">
          Recent Newsletters
        </h2>
        {data.newsletters.length === 0 ? (
          <p className="text-gray-500">No newsletters sent yet.</p>
        ) : (
          <div className="divide-y">
            {data.newsletters.map((newsletter) => (
              <div key={newsletter.id} className="py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{newsletter.subject}</h3>
                    <p className="text-sm text-gray-500">
                      Sent to {newsletter.recipient_count} recipients
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(newsletter.sent_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
