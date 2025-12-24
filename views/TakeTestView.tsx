
import React, { useState, useRef } from 'react';
import { MCQ } from '../types';
import { generateMCQs } from '../geminiService';

interface TakeTestViewProps {
  onBack: () => void;
}

type TestState = 'upload' | 'generating' | 'taking' | 'results';

const TakeTestView: React.FC<TakeTestViewProps> = ({ onBack }) => {
  const [testState, setTestState] = useState<TestState>('upload');
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const QUESTION_COUNT_OPTIONS = [5, 10, 20, 25, 30];

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    
    setTestState('generating');
    
    let content = "";
    if (file.type === 'text/plain') {
      content = await file.text();
    } else {
      // Mocked content for binary files in this demo environment
      content = `Simulated content from ${file.name}. 
      Topic: Academic Study Skills and Knowledge retention. 
      Details: Effective study involves active recall, spaced repetition, and interleaving. 
      Active recall is better than passive reading. 
      Interleaving is mixing different subjects during a study session.`;
    }

    try {
      const generated = await generateMCQs(content, file.name, questionCount);
      if (generated && generated.length > 0) {
        setQuestions(generated);
        setUserAnswers(new Array(generated.length).fill(-1));
        setTestState('taking');
      } else {
        alert("Failed to generate questions. Please try again with different content.");
        setTestState('upload');
      }
    } catch (err) {
      console.error(err);
      setTestState('upload');
    }
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) score++;
    });
    return score;
  };

  if (testState === 'upload') {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
        <nav aria-label="Breadcrumb" className="flex items-center text-xs md:text-sm text-slate-500 dark:text-slate-400">
          <button onClick={onBack} className="hover:text-primary transition-colors">Dashboard</button>
          <span className="material-symbols-outlined text-base mx-2 text-slate-400" aria-hidden="true">chevron_right</span>
          <span className="font-medium text-slate-900 dark:text-white" aria-current="page">Take Test</span>
        </nav>

        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">AI Test Generator</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Generate a personalized test from your study materials.</p>
        </div>

        <div className="flex flex-col items-center gap-4 mb-2">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Select Question Count</p>
          <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Question count selection">
            {QUESTION_COUNT_OPTIONS.map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                role="radio"
                aria-checked={questionCount === count}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                  questionCount === count
                    ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                    : 'bg-white dark:bg-[#1a2632] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary/50'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileUpload(e.dataTransfer.files);
          }}
          className={`relative border-2 border-dashed rounded-[32px] p-16 flex flex-col items-center justify-center transition-all cursor-pointer ${
            isDragging 
              ? 'border-primary bg-primary/5 scale-[0.99] shadow-inner' 
              : 'border-slate-200 dark:border-slate-800 hover:border-primary/50 bg-white dark:bg-[#1a2632]'
          }`}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Upload study material to start test"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.docx,.pptx,.txt"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <div className="size-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6" aria-hidden="true">
            <span className="material-symbols-outlined text-4xl">cloud_upload</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Drop study materials here</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 text-center max-w-sm">AI will generate a practice test based on your file. Supports PDF, DOCX, PPTX, and TXT.</p>
          <button 
            className="bg-primary text-white px-10 py-3.5 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-[#101922]"
            aria-label="Browse files on your computer"
          >
            Start Generation
          </button>
        </div>
      </div>
    );
  }

  if (testState === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-in fade-in zoom-in-95 duration-700">
        <div className="relative size-32 mb-8">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" aria-hidden="true"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-primary animate-pulse" aria-hidden="true">psychology</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Crafting your exam...</h2>
        <p className="text-slate-500 dark:text-slate-400">Gemini AI is analyzing your materials to generate {questionCount} high-quality questions.</p>
      </div>
    );
  }

  if (testState === 'taking') {
    const q = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => { if(window.confirm('Quit test? Progress will be lost.')) setTestState('upload'); }}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-lg p-1"
            aria-label="Cancel test and return to upload"
          >
            <span className="material-symbols-outlined text-base" aria-hidden="true">close</span>
            Cancel
          </button>
          <div className="flex flex-col items-end">
            <span className="text-xs font-black text-primary uppercase tracking-widest">Question {currentQuestionIndex + 1} of {questions.length}</span>
            <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden" role="progressbar" aria-valuenow={currentQuestionIndex + 1} aria-valuemin={1} aria-valuemax={questions.length}>
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-8 leading-snug">
            {q.question}
          </h2>

          <div className="flex flex-col gap-3" role="radiogroup" aria-labelledby="question-text">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(idx)}
                role="radio"
                aria-checked={userAnswers[currentQuestionIndex] === idx}
                className={`p-5 rounded-2xl text-left font-medium transition-all flex items-center gap-4 group border focus:outline-none focus:ring-2 focus:ring-primary ${
                  userAnswers[currentQuestionIndex] === idx
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary/50 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <div className={`size-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                  userAnswers[currentQuestionIndex] === idx 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white dark:bg-slate-700 text-slate-400 group-hover:text-primary'
                }`} aria-hidden="true">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span>{opt}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button 
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            className="flex-1 py-4 bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-30 flex items-center justify-center gap-2 focus:ring-2 focus:ring-primary"
            aria-label="Previous question"
          >
            <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_back</span>
            Previous
          </button>
          
          {currentQuestionIndex === questions.length - 1 ? (
            <button 
              disabled={userAnswers[currentQuestionIndex] === -1}
              onClick={() => setTestState('results')}
              className="flex-[2] py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-emerald-400"
              aria-label="Submit test results"
            >
              <span className="material-symbols-outlined text-base" aria-hidden="true">check_circle</span>
              Submit Test
            </button>
          ) : (
            <button 
              disabled={userAnswers[currentQuestionIndex] === -1}
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              className="flex-[2] py-4 bg-primary hover:bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-primary"
              aria-label="Next question"
            >
              Next Question
              <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (testState === 'results') {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-4xl mx-auto flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col md:flex-row gap-8 items-center bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="relative size-40 flex-shrink-0" aria-label={`Score: ${percentage} percent`}>
            <svg className="size-full" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
              <circle 
                cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                strokeDasharray={`${percentage * 2.82} 282`} 
                strokeLinecap="round" 
                className={`transition-all duration-1000 transform -rotate-90 origin-center ${
                  percentage >= 80 ? 'text-emerald-500' : percentage >= 50 ? 'text-amber-500' : 'text-red-500'
                }`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">{percentage}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Score</span>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Test Complete!</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
              You correctly answered {score} out of {questions.length} questions. 
              {percentage >= 80 ? ' Amazing work!' : percentage >= 50 ? ' Good job, keep practicing.' : ' Keep studying, you will get it!'}
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <button 
                onClick={() => {
                  setTestState('taking');
                  setCurrentQuestionIndex(0);
                  setUserAnswers(new Array(questions.length).fill(-1));
                }}
                className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:brightness-110 transition-all flex items-center gap-2 shadow-md shadow-primary/20"
                aria-label="Try the test again"
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">replay</span>
                Try Again
              </button>
              <button 
                onClick={() => setTestState('upload')}
                className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
                aria-label="Upload new material to generate another test"
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">upload_file</span>
                New Material
              </button>
              <button 
                onClick={onBack}
                className="px-6 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                aria-label="Return to dashboard"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Detailed Review</h3>
          {questions.map((q, idx) => (
            <div key={idx} className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm overflow-hidden relative">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${userAnswers[idx] === q.correctAnswer ? 'bg-emerald-500' : 'bg-red-500'}`} aria-hidden="true"></div>
              
              <div className="flex items-start gap-4">
                <div className={`size-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs ${userAnswers[idx] === q.correctAnswer ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-400'}`} aria-hidden="true">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4 pr-12 leading-relaxed">{q.question}</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {q.options.map((opt, oIdx) => (
                      <div 
                        key={oIdx}
                        className={`p-3 rounded-xl text-xs font-medium border flex items-center gap-2 ${
                          oIdx === q.correctAnswer 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-900/40 dark:text-emerald-400' 
                            : oIdx === userAnswers[idx]
                              ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-900/40 dark:text-red-400'
                              : 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 text-slate-500'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                          {oIdx === q.correctAnswer ? 'check_circle' : oIdx === userAnswers[idx] ? 'cancel' : 'radio_button_unchecked'}
                        </span>
                        {opt}
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                    <p className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-1">Explanation</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default TakeTestView;
