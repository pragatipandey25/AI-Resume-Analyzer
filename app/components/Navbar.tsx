import {useEffect, useMemo, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router";
import {usePuterStore} from "~/lib/puter";

const Navbar = () => {
    const { auth } = usePuterStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname, location.search]);

    const navLinks = useMemo(() => {
        const links = [
            { label: "Features", to: "/#features" },
            { label: "How it works", to: "/#how-it-works" },
        ];

        if (location.pathname !== "/") {
            return [{ label: "Home", to: "/" }, ...links];
        }

        return links;
    }, [location.pathname]);

    const isHome = location.pathname === "/";
    const isActiveLink = (to: string) => {
        if (to === "/") {
            return location.pathname === "/";
        }

        const [pathname, hash] = to.split("#");
        const normalizedPathname = pathname || "/";

        if (normalizedPathname !== location.pathname) {
            return false;
        }

        return hash ? location.hash === `#${hash}` : true;
    };
    const userInitial = auth.user?.username?.charAt(0).toUpperCase() ?? "U";

    const handleLogout = async () => {
        await auth.signOut();
        setMenuOpen(false);
        navigate("/");
    };

    return (
        <nav className="navbar-shell">
            <div className="navbar">
                <Link to="/" className="navbar-brand" aria-label="Resume Analyzer home">
                    <span className="navbar-mark">RA</span>
                    <span className="navbar-copy">
                        <strong>Pragati Resume Analyzer</strong>
                        <span>AI feedback for faster applications</span>
                    </span>
                </Link>

                <div className="navbar-center hidden items-center gap-2 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            to={link.to}
                            className={isActiveLink(link.to) ? "navbar-link navbar-link-active" : "navbar-link"}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    {auth.isAuthenticated ? (
                        <>
                            <span className="navbar-user-pill">
                                <span className="navbar-user-avatar">{userInitial}</span>
                                <span className="navbar-user-copy">
                                    <strong>Signed in</strong>
                                    <span>{auth.user?.username}</span>
                                </span>
                            </span>
                            <Link to="/upload" className="primary-button navbar-cta px-5 py-3 text-base">
                                {isHome ? "Upload Resume" : "Open Upload"}
                            </Link>
                            <button
                                type="button"
                                className="navbar-logout-button navbar-cta px-5 py-3 text-base"
                                onClick={handleLogout}
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth?next=/upload" className="secondary-button navbar-cta px-5 py-3 text-base">
                                Log In
                            </Link>
                            <Link to="/auth?next=/upload" className="primary-button navbar-cta px-5 py-3 text-base">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    className="navbar-menu-button md:hidden"
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((current) => !current)}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>

            {menuOpen && (
                <div className="navbar-mobile-menu md:hidden">
                    <div className="navbar-mobile-links">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                className={isActiveLink(link.to) ? "navbar-mobile-link navbar-mobile-link-active" : "navbar-mobile-link"}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="navbar-mobile-actions">
                        {auth.isAuthenticated ? (
                            <>
                                <span className="navbar-user-pill navbar-user-pill-mobile">
                                    <span className="navbar-user-avatar">{userInitial}</span>
                                    <span className="navbar-user-copy">
                                        <strong>Signed in</strong>
                                        <span>{auth.user?.username}</span>
                                    </span>
                                </span>
                                <Link to="/upload" className="primary-button navbar-cta w-full px-5 py-3 text-base">
                                    {isHome ? "Upload Resume" : "Open Upload"}
                                </Link>
                                <button
                                    type="button"
                                    className="navbar-logout-button navbar-cta w-full px-5 py-3 text-base"
                                    onClick={handleLogout}
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/auth?next=/upload" className="secondary-button navbar-cta w-full px-5 py-3 text-base">
                                    Log In
                                </Link>
                                <Link to="/auth?next=/upload" className="primary-button navbar-cta w-full px-5 py-3 text-base">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
export default Navbar
