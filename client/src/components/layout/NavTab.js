import React from 'react';
import {Link, Route} from "react-router-dom";
import {NavItem, NavLink} from "reactstrap";


const NavTab = (props) => {
    let {to, name, exact} = props;

    return (
        <Route exact={exact} path={to}>
            {({match}) => (
                // If current path matches what the Route points towards, give it the "active" class
                <NavItem>
                    <NavLink
                        className={match ? "active" : ""}
                        tag={Link}
                        to={to}
                    >
                        {name}
                    </NavLink>
                </NavItem>
            )}
        </Route>
    )
}

export default NavTab;