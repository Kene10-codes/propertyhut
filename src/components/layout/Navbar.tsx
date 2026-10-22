import { NavLink } from "react-router-dom"

const Navbar = () => {
  return (
    <nav>
       <NavLink 
         to={"/"} 
         >
          Property<span>Hut</span>
       </NavLink>
    </nav>
  )
}

export default Navbar
