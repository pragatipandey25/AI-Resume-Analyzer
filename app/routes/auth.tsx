import {usePuterStore} from "~/lib/puter";
import {useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate} from "react-router";

export const meta = () => ([
    { title: 'Pragati Resume Analyzer | Access' },
    { name: 'description', content: 'Log in or sign up to continue with your resume analysis workspace.' },
])

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const location = useLocation();
    const next = useMemo(() => new URLSearchParams(location.search).get('next') || '/', [location.search]);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next, navigate])

    const panelCopy = mode === 'login'
        ? {
            title: 'Welcome back',
            description: 'Log in to review saved resumes, open older feedback, and keep your workspace in sync.',
            action: 'Log In with Puter',
        }
        : {
            title: 'Create your account',
            description: 'Sign up to unlock private resume storage, instant analysis, and AI-powered feedback.',
            action: 'Sign Up with Puter',
        };

    return (
        <main className="auth-page bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center px-4 py-12">
            <div className="auth-shell">
                <section className="auth-copy-panel">
                    <span className="eyebrow">Resume analysis workspace</span>
                    <h1>Sign in once and keep every review in one place.</h1>
                    <p>
                        Use the same Puter account for login and signup. Once you are in, upload resumes, compare roles, and revisit feedback anytime.
                    </p>

                    <div className="auth-points">
                        <div>
                            <strong>Fast access</strong>
                            <span>One flow for new and returning users.</span>
                        </div>
                        <div>
                            <strong>Private storage</strong>
                            <span>Keep resume files and analysis inside Puter.</span>
                        </div>
                        <div>
                            <strong>Clear outcomes</strong>
                            <span>ATS scores, suggestions, and review details in one view.</span>
                        </div>
                    </div>
                </section>

                <div className="gradient-border shadow-lg auth-card-wrap">
                    <section className="auth-card">
                        <div className="auth-toggle">
                            <button
                                type="button"
                                className={mode === 'login' ? 'auth-toggle-active' : 'auth-toggle-inactive'}
                                onClick={() => setMode('login')}
                            >
                                Log In
                            </button>
                            <button
                                type="button"
                                className={mode === 'signup' ? 'auth-toggle-active' : 'auth-toggle-inactive'}
                                onClick={() => setMode('signup')}
                            >
                                Sign Up
                            </button>
                        </div>

                        <div className="auth-header">
                            <h2>{panelCopy.title}</h2>
                            <p>{panelCopy.description}</p>
                        </div>

                        <div className="auth-action">
                            {isLoading ? (
                                <button className="auth-button animate-pulse" type="button">
                                    <p>Connecting to your workspace...</p>
                                </button>
                            ) : auth.isAuthenticated ? (
                                <button className="auth-button" onClick={auth.signOut} type="button">
                                    <p>Log Out</p>
                                </button>
                            ) : (
                                <button className="auth-button" onClick={auth.signIn} type="button">
                                    <p>{panelCopy.action}</p>
                                </button>
                            )}
                        </div>

                        <p className="auth-footnote">
                            By continuing, you use your Puter account to access the resume analyzer and its saved analyses.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}

export default Auth
