import {Link} from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/">
                <div>
                    <p className="text-2xl font-bold text-gradient">RESUME ANALYZER</p>
                    <p className="text-sm text-gray-500">Optimize your resume with AI insights</p>
                </div>
            </Link>
            <Link to="/upload" className="primary-button w-fit">
                Upload Resume
            </Link>
        </nav>
    )
}
export default Navbar
