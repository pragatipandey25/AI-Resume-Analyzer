import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import {usePuterStore} from "~/lib/puter";
import {Link} from "react-router";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pragati Resume Analyzer" },
    { name: "description", content: "A polished AI resume analyzer with fast feedback and ATS insights." },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const [resumeCount, setResumeCount] = useState<number | null>(null);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      setResumeCount(null);
      return;
    }

    let cancelled = false;

    const loadResumeCount = async () => {
      const resumes = await kv.list('resume:*', false);

      if (!cancelled) {
        setResumeCount(Array.isArray(resumes) ? resumes.length : 0);
      }
    };

    loadResumeCount();

    return () => {
      cancelled = true;
    };
  }, [auth.isAuthenticated, kv]);

  const featureCards = [
    {
      title: 'ATS-ready scoring',
      description: 'See how your resume maps to the job description before you apply.',
    },
    {
      title: 'Clear feedback',
      description: 'Get structured advice on tone, content, skills, and layout in one place.',
    },
    {
      title: 'Private storage',
      description: 'Keep uploads, previews, and analyses inside your Puter workspace.',
    },
  ];

  const steps = [
    'Create an account or log in with Puter.',
    'Upload a PDF resume and the role you want.',
    'Review the ATS score and apply the suggestions.',
  ];

  return <main className="home-page bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section className="landing-shell">
      <div className="hero-grid">
        <div className="space-y-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur">
            <span className="size-2 rounded-full bg-[#6678ef]" />
            AI resume analysis built for fast decisions
          </div>

          <div className="space-y-5">
            <h1>Turn every resume into a clearer shot at the next interview.</h1>
            <p className="max-w-2xl text-xl leading-8 text-dark-200">
              Upload a resume, compare it to a role, and get polished ATS feedback with a guided workflow that feels simple from the first click.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/auth?next=/upload" className="primary-button w-fit px-7 py-4 text-lg font-semibold">
              Get Started
            </Link>
            <a href="#how-it-works" className="secondary-button w-fit px-7 py-4 text-lg font-semibold">
              See How It Works
            </a>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            <span className="rounded-full bg-white/80 px-4 py-2 shadow-sm">Puter auth and storage</span>
            <span className="rounded-full bg-white/80 px-4 py-2 shadow-sm">ATS score and feedback</span>
            <span className="rounded-full bg-white/80 px-4 py-2 shadow-sm">PDF upload and preview</span>
          </div>
        </div>

        <div className="preview-panel">
          <div className="preview-card preview-card-top">
            <img src="/images/resume_01.png" alt="Resume preview 1" />
          </div>
          <div className="preview-card preview-card-middle">
            <img src="/images/resume_02.png" alt="Resume preview 2" />
          </div>
          <div className="preview-card preview-card-bottom">
            <img src="/images/resume_03.png" alt="Resume preview 3" />
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">One-click auth</p>
          <p className="stat-value">Log in or sign up with Puter</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Feedback focus</p>
          <p className="stat-value">ATS, skills, structure, and tone</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Personal workspace</p>
          <p className="stat-value">{auth.isAuthenticated ? `${resumeCount ?? 0} saved resume${resumeCount === 1 ? '' : 's'}` : 'Keep your analysis private'}</p>
        </div>
      </div>

      <div id="features" className="section-card">
        <div className="section-heading">
          <span className="eyebrow">Why it works</span>
          <h2>Built to make resume review feel sharp, visual, and fast.</h2>
        </div>

        <div className="feature-grid">
          {featureCards.map((card) => (
            <article key={card.title} className="feature-card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div id="how-it-works" className="section-card split-card">
        <div className="section-heading">
          <span className="eyebrow">How it works</span>
          <h2>Three steps from resume upload to actionable feedback.</h2>
        </div>

        <div className="steps-list">
          {steps.map((step, index) => (
            <div key={step} className="step-item">
              <span className="step-number">0{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {auth.isAuthenticated && (
        <div className="section-card cta-card">
          <div>
            <span className="eyebrow">Signed in</span>
            <h2>Continue where you left off.</h2>
            <p className="text-dark-200">Your workspace is ready. Upload a new resume or review the latest analysis now.</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/upload" className="primary-button w-fit px-7 py-4 text-lg font-semibold">
              Upload Resume
            </Link>
            <Link to="/auth" className="secondary-button w-fit px-7 py-4 text-lg font-semibold">
              Manage Account
            </Link>
          </div>
        </div>
      )}
    </section>
  </main>
}
