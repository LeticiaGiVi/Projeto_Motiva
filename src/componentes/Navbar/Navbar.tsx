import { NavLink } from 'react-router-dom'
 
const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'font-bold' : 'font-normal'
 
function Navbar() {
    return ( 
        <nav className='h-auto'>
            <ul className='flex flex-row gap-6 text-xl items-center'>
                <li><NavLink to="/" end className={linkClass}> Dashboard </NavLink></li>
                <li><NavLink to="/mapas" className={linkClass}> Mapas </NavLink></li>
                <li><NavLink to="/cronogramas" className={linkClass}> Cronograma </NavLink></li>
                <li><NavLink to="/equipes" className={linkClass}> Equipes </NavLink></li>
                <li><NavLink to="/relatorios" className={linkClass}> Relatórios </NavLink></li>
                <li><NavLink to="/config" className={linkClass}> configurações </NavLink></li>
            </ul>
        </nav>
     );
}
 
export default Navbar;
