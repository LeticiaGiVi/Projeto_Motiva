import Navbar from "../Navbar/Navbar";

function Header() {
    return ( 
    <header className="flex flex-row bg-violet-700 w-full p-5 text-gray-50 justify-between">
        <img src="../../assets/LOGO.svg"></img>
        <Navbar/>
    </header>
    );
}

export default Header;