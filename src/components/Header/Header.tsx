import './Header.css'
import {ChangeEvent} from "react";

function Header(props: {setTriggerSearch: (t: string) => void}){

    function startSearching(e: ChangeEvent<HTMLInputElement>): void{
        setTimeout(()=>{
            props.setTriggerSearch(e.target.value);
        },500);
    }

    return(
        <header className="header">
            <input type="text" className="search-field" placeholder="Введите запрос" onChange={startSearching}/>
        </header>
    );
}

export default Header;