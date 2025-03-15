// app/middleware.js
import { NextResponse } from 'next/server';

// Define which routes should be protected
const protectedRoutes = [
  '/dashboard',
  '/',
  '/profile',
  // Add any other routes that need protection
];

export function middleware(request) {
  // Get the path from the request URL
  const path = request.nextUrl.pathname;

  // Check if the path is in the protected routes array
  const isProtectedRoute = protectedRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
  
  // Get the session cookie
  const sessionId = request.cookies.get('sessionId')?.value;

  // If trying to access a protected route without a session, redirect to login
  if (isProtectedRoute && !sessionId) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // If trying to access login page with a valid session, redirect to dashboard
  if (path === '/login' && sessionId) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }
  
  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

// app/page.js - Landing page (protected by middleware)
export default function LandingPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-center pt-8">Welcome to Your Dashboard</h1>
      <LandingPageClient />
    </>
  );
}

// app/LandingPageClient.js - Client component
"use client";

export default function LandingPageClient() {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard content */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Projects</span>
              <span className="font-medium">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completed</span>
              <span className="font-medium">18</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">In Progress</span>
              <span className="font-medium">6</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-medium">Project XYZ completed</p>
              <p className="text-sm text-gray-500">Yesterday at 2:30 PM</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-medium">New task assigned</p>
              <p className="text-sm text-gray-500">Today at 9:15 AM</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
              Create New Project
            </button>
            <button className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// app/dashboard/page.js - Dashboard page (also protected by middleware)
export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p>This page is protected by middleware. Only authenticated users can access it.</p>
    </div>
  );
}