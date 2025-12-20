import "../styles/Layout.css";
import { NavLink, Outlet } from "react-router";
export const Layout=()=>{
   return ( 

       <>
<header>

    <nav>
    <ul>
        <li>
            <NavLink to={"/"} >Hem</NavLink>
        </li>

        <li>
            <NavLink to={"/ModelPage"} >ModelPage</NavLink>
        </li>

        <li>
            <NavLink to={"/Signup"} >Logga in</NavLink>
        </li>

        <li>
            <NavLink to={"/Contact"} >Kontakta oss</NavLink>
        </li>
    </ul>
</nav>
</header>

<main>
    <Outlet/>
</main>
<footer>
        <div>Social media</div>
        <div>Karta</div>
        <div>Kontaktinfo</div>
      </footer>
</>
    ) 
} 
