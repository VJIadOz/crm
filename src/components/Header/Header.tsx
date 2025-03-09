import './Header.css'

function Header(){
    return(
        <header className="header">
            <input type="text" className="search-field" placeholder="Введите запрос"/>
        </header>
    );
}

export default Header;