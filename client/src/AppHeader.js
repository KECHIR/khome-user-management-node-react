

import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";

export default function AppHeader() {
    //assigning location variable
    const location = useLocation();
    //destructuring pathname from location
    const { pathname } = location;
    //Javascript split method to get the name of the path in array
    const splitLocation = pathname.split("/");
    const handleActiveLinkClassName = (linkName) => splitLocation[1] === linkName ? "app-header-nav-item active" : "app-header-nav-item";
    return <header >
        <div className="app-header">
        <div className="app-header-wrap">
            <div className="app-header-title">
                <a href={"/"} className="app-header-title-link"><h2>Gestion utilisateur</h2></a>
            </div>
            <nav className="app-header-nav">
                <div className={handleActiveLinkClassName('user/add')}>
                    <Link to={"/user/add"} className="app-header-nav-item-link">
                        <div className="app-header-nav-item-inside-link">Ajouter/modifier un utilisateur</div>
                    </Link>
                </div>
                <div className={handleActiveLinkClassName('users')}>
                    <Link to={"/users"} className="app-header-nav-item-link">
                        <div className="app-header-nav-item-inside-link">utilisateurs</div>
                    </Link>
                </div>
            </nav>
        </div>
        </div>
     
    </header>
}