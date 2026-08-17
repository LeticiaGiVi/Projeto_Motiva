import Navbar from "../Navbar/Navbar";
import LOGO from "../../assets/LOGO.svg";

function Header() {
    return ( 
    <header className="flex flex-row bg-violet-700 w-full p-5 text-gray-50 justify-between align-middle">
        <img src={LOGO} className="w-20"></img>
        <Navbar/>
    </header>
    );
}

export default Header;