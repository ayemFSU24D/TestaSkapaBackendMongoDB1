import "../styles/Layout.css";
import { NavLink, Outlet } from "react-router";
export const Layout=()=>{
   return ( 

       <>
<header>

    <nav>
    <ul>
        <li>
            <NavLink to={"/"} >Home</NavLink>
        </li>

        <li>
            <NavLink to={"/ModelPage"} >ModelPage</NavLink>
        </li>

        <li>
            <NavLink to={"/Signup"} >Sign in</NavLink>
        </li>

        <li>
            <NavLink to={"/Contact"} >Contact us</NavLink>
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
