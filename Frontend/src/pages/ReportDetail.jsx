import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import {
  ArrowLeft, Loader2, AlertCircle, User, Briefcase,
  Target, MessageSquare, Users, AlertTriangle, BookOpen,
  ChevronDown, ChevronUp, Calendar
} from 'lucide-react';

function ScoreRing({ score }) {
  const color = score >= 75 ? '#16a34a' : score >= 50 ? '#ca8a04' : '#dc2626';
  const bg = score >= 75 ? '#f0fdf4' : score >= 50 ? '#fefce8' : '#fef2f2';
  return (
    <div
      className="flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 font-bold text-2xl"
      style={{ borderColor: color, color, backgroundColor: bg }}
    >
      {score}
      <span className="text-xs font-normal" style={{ color }}>/ 100</span>
    </div>
  );
}

function Section({ icon: Icon, title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 font-semibold text-gray-800">
          <Icon className="w-5 h-5 text-blue-500" />
          {title}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-gray-100">{children}</div>}
    </div>
  );
}

function QnACard({ question, intention, answer, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800">{question}</p>
          <p className="text-xs text-gray-400 mt-0.5">{intention}</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
          <p className="text-sm text-gray-700 mt-3 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await API.get('/files/all');
        const found = (res.data.data || []).find((r) => r._id === id);
        if (!found) throw new Error('Report not found');
        setReport(found);
      } catch (err) {
        setError(err.message || 'Failed to load report.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold">{error || 'Report not found'}</p>
          <button
            onClick={() => navigate('/reports')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
          >
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/reports')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Reports
        </button>

        {/* Hero card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <ScoreRing score={report.matchScore} />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900">{report.name}</h1>
              <p className="text-blue-600 font-medium text-sm mt-0.5 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                {report.title}
              </p>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">{report.candidate_introduction}</p>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Generated on {formatDate(report.createdAt)}
              </p>
            </div>
          </div>

          {/* Skill Gaps inline */}
          {report.skillGaps?.length > 0 && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                Skill Gaps
              </p>
              <div className="flex flex-wrap gap-2">
                {report.skillGaps.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {/* Technical Questions */}
          <Section icon={MessageSquare} title={`Technical Questions (${report.technicalQuestions?.length || 0})`} defaultOpen>
            <div className="space-y-2 mt-3">
              {report.technicalQuestions?.map((q, i) => (
                <QnACard key={i} index={i} {...q} />
              ))}
            </div>
          </Section>

          {/* Behavioral Questions */}
          <Section icon={Users} title={`Behavioral Questions (${report.behavioralQuestions?.length || 0})`}>
            <div className="space-y-2 mt-3">
              {report.behavioralQuestions?.map((q, i) => (
                <QnACard key={i} index={i} {...q} />
              ))}
            </div>
          </Section>

          {/* Preparation Plan */}
          <Section icon={BookOpen} title="7-Day Preparation Plan">
            <div className="mt-3 space-y-3">
              {report.preparationPlan?.map((item) => (
                <div key={item.day} className="flex gap-4">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      {item.day}
                    </div>
                    {item.day < 7 && <div className="w-px flex-1 bg-gray-200 my-1" />}
                  </div>
                  <div className="pb-4 flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm">{item.focus}</p>
                    <ul className="mt-1.5 space-y-0.5">
                      {item.tasks?.map((task, ti) => (
                        <li key={ti} className="text-xs text-gray-500 flex items-start gap-1.5">
                          <span className="mt-1 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Resume */}
          <Section icon={User} title="Resume Content">
            <pre className="mt-3 text-xs text-gray-600 whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
              {report.resume}
            </pre>
          </Section>
        </div>
      </div>
    </div>
  );
}
