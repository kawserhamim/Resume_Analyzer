import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import {
  LayoutDashboard, AlertCircle, Loader2, FileText,
  ChevronRight, Calendar, Star
} from 'lucide-react';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get('/files/all');
        setReports(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm">Loading your reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-blue-600" />
              My Reports
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {reports.length} report{reports.length !== 1 ? 's' : ''} generated
            </p>
          </div>
          <button
            onClick={() => navigate('/upload')}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
          >
            + New Analysis
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-5 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Empty state */}
        {!error && reports.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h2 className="text-gray-700 font-semibold mb-1">No reports yet</h2>
            <p className="text-gray-400 text-sm mb-4">Upload your resume to generate your first report.</p>
            <button
              onClick={() => navigate('/upload')}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Analyze Resume
            </button>
          </div>
        )}

        {/* Reports List */}
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report._id}
              onClick={() => navigate(`/reports/${report._id}`)}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Score badge */}
                  <div className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl font-bold text-lg ${getScoreColor(report.matchScore)}`}>
                    {report.matchScore}
                    <span className="text-xs font-normal">/ 100</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {report.name}
                    </h2>
                    <p className="text-sm text-gray-500 truncate mt-0.5">{report.title}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(report.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {report.technicalQuestions?.length || 0} questions
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
