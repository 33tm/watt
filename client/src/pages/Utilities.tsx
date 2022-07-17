import {Outlet} from 'react-router-dom';
import HeaderPage from '../components/layout/HeaderPage';
import NavTab from '../components/layout/NavTab';


export default function Utilities() {
    return (
        <HeaderPage
            heading="Utilities"
            nav={<>
                <NavTab to="." name="Barcode" />
                {/* <NavTab to="graphing" name="Graphing Calculator"/> */}
                <NavTab to="map" name="Map" />
                <NavTab to="calculator" name="Finals Calc." />
                <NavTab to="staff" name="Staff" />
                <NavTab to="courses" name="Courses" />
                <NavTab to="resources" name="Resources" />
            </>}
        >
            <Outlet />
        </HeaderPage>
    );
}
