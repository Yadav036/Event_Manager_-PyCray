"use client";
import { useState } from "react";
import Link from "next/link";
import EventsLayout from './events/layout';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-4">
      <div className="max-w-md w-full bg-gradient-to-br from-black to-gray-900 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">Event Manager</h1>
        <p className="mb-6 text-center">
        </p>
        <div className="flex justify-center">
          <Link
            href="/events"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Click here for /Events
          </Link>
        </div>
      </div>
    </div>
  );
}
