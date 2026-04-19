import {Link} from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/">
                <div>
                    <p className="text-2xl font-bold text-gradient">PRAGATI RESUME ANALYZER</p>
                    <p className="text-xs text-gray-500">Owned by Pragati Pandey</p>
                </div>
            </Link>
            <Link to="/upload" className="primary-button w-fit">
                Upload Resume
            </Link>
        </nav>
    )
}
export default Navbar
