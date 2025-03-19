import './Header.module.css'
import {ChangeEvent} from "react";
import HeaderStyles from './Header.module.css';

function Header(props: {setTriggerSearch: (t: string) => void}){

    function startSearching(e: ChangeEvent<HTMLInputElement>): void{
        setTimeout(()=>{
            props.setTriggerSearch(e.target.value);
        },500);
    }

    return(
        <header className={HeaderStyles.header}>
            <div className={HeaderStyles.inputWrapper}>
                <input type="text" className={HeaderStyles.searchField} placeholder="Введите запрос" onChange={startSearching}/>
            </div>
        </header>
    );
}

export default Header;