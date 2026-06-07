import {usePuterStore} from "~/lib/puter";
import {Link} from "react-router";

const Navbar = () => {
    const { auth } = usePuterStore();

    return (
        <nav className="navbar">
            <Link to="/">
                <div className="space-y-1">
                    <p className="text-2xl font-bold text-gradient">RESUME ANALYZER</p>
                    <p className="text-sm text-gray-500">Optimize your resume with AI insights</p>
                </div>
            </Link>
            <div className="flex items-center gap-3 max-sm:flex-col max-sm:items-stretch">
                {auth.isAuthenticated ? (
                    <>
                        <span className="hidden text-sm text-gray-500 md:block">
                            Signed in as {auth.user?.username}
                        </span>
                        <Link to="/upload" className="primary-button w-fit px-5 py-3 text-base">
                            Upload Resume
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/auth?next=/upload" className="secondary-button w-fit px-5 py-3 text-base">
                            Log In
                        </Link>
                        <Link to="/auth?next=/upload" className="primary-button w-fit px-5 py-3 text-base">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}
export default Navbar
