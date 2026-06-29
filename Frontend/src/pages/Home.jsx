import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Upload, LayoutDashboard, ArrowRight } from 'lucide-react';

export default function Home() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-blue-100">
          <FileText className="w-3.5 h-3.5" />
          AI-Powered Resume Analysis
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
          Ace Your Next Interview<br />with AI Insights
        </h1>
        <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
          Upload your resume and a job description. Get a match score, personalized
          interview questions, skill gaps, and a 7-day prep plan — instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {token ? (
            <>
              <Link
                to="/upload"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                <Upload className="w-4 h-4" />
                Analyze Resume
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/reports"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                View Reports
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: '🎯',
              title: 'Match Score',
              desc: 'Understand how well your resume aligns with the job description on a 0–100 scale.',
            },
            {
              icon: '💬',
              title: 'Interview Questions',
              desc: 'AI-generated technical and behavioral questions tailored to your profile and the role.',
            },
            {
              icon: '📅',
              title: '7-Day Prep Plan',
              desc: 'A personalized roadmap to close skill gaps and prepare for your interview.',
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
            >
              <div className="text-2xl mb-3">{icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
