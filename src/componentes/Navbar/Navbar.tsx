import {Link} from 'react-router-dom'

function Navbar() {
    return ( 
        <nav>
            <ul className='flex flex-row gap-2'>
                <li><Link to="/"> Dashboards </Link></li>
                <li><Link to="/mapas"> Mapas </Link></li>
                <li><Link to="/cronogramas"> Cronograma </Link></li>
                <li><Link to="/equipes"> Equipes </Link></li>
                <li><Link to="/relatorios"> Relatorios </Link></li>
                <li><Link to="/config"> Configurações </Link></li>
            </ul>
        </nav>
     );
}

export default Navbar;