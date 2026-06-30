import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Upload, FileText, Briefcase, AlertCircle, CheckCircle, Loader2, X } from 'lucide-react';

function FileDropzone({ label, name, icon: Icon, accept, file, onChange, onClear }) {
  const inputRef = useRef();

  const isAccepted = (f) => {
    if (!f) return false;
    if (accept === '.pdf') return f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (!dropped) return;
    if (!isAccepted(dropped)) {
      onChange({ target: { name, files: [], invalid: `${label} must be a PDF file.` } });
      return;
    }
    onChange({ target: { name, files: [dropped] } });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {file ? (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <Icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
          <button
            type="button"
            onClick={onClear}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-lg px-4 py-8 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition group"
        >
          <Icon className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
          <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors font-medium">
            Click or drag &amp; drop
          </p>
          <p className="text-xs text-gray-400">PDF ONLY</p>
          <input
            ref={inputRef}
            type="file"
            name={name}
            accept={accept}
            onChange={onChange}
            className="hidden"
            onClick={(e) => { e.target.value = null; }}
          />
        </div>
      )}
    </div>
  );
}

export default function UploadPage() {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFile = (e) => {
    const { name, files, invalid } = e.target;
    if (invalid) {
      setError(invalid);
      if (name === 'resume') setResume(null);
      if (name === 'jd') setJd(null);
      return;
    }
    if (name === 'resume') setResume(files[0] || null);
    if (name === 'jd') setJd(files[0] || null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume || !jd) {
      setError('Please upload both the resume and job description files.');
      return;
    }
    if (resume.type !== 'application/pdf' && !resume.name.toLowerCase().endsWith('.pdf')) {
      setError('Resume must be a PDF file.');
      setResume(null);
      return;
    }
    if (jd.type !== 'application/pdf' && !jd.name.toLowerCase().endsWith('.pdf')) {
      setError('Job description must be a PDF file.');
      setJd(null);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jd', jd);

    try {
      await API.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Report generated successfully! Redirecting to reports...');
      setTimeout(() => navigate('/reports'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analyze Resume</h1>
          <p className="text-gray-500 text-sm mt-1">
            Upload your resume and a job description to get an AI-powered analysis report.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          {/* Alerts */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3 mb-5 text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <FileDropzone
              label="Resume"
              name="resume"
              icon={FileText}
              accept=".pdf,application/pdf"
              file={resume}
              onChange={handleFile}
              onClear={() => setResume(null)}
            />
            <FileDropzone
              label="Job Description"
              name="jd"
              icon={Briefcase}
              accept=".pdf,application/pdf"
              file={jd}
              onChange={handleFile}
              onClear={() => setJd(null)}
            />

            <button
              type="submit"
              disabled={loading || !resume || !jd}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing... this may take a moment
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Generate Report
                </>
              )}
            </button>
          </form>

          {/* Info note */}
          <p className="text-xs text-gray-400 mt-4 text-center">
            Only PDF files are accepted · Max file size: 10MB
          </p>
        </div>

        {/* How it works */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">How it works</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Upload Files', desc: 'Add your resume and the job description' },
              { step: '2', title: 'AI Analysis', desc: 'Gemini AI analyzes the match and gaps' },
              { step: '3', title: 'Get Report', desc: 'Review questions, score, and prep plan' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center mx-auto mb-2">
                  {step}
                </div>
                <p className="text-sm font-medium text-gray-700">{title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
