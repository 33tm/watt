import {useContext, useState} from 'react';
import {Menu} from 'react-feather';

// Contexts
import UserDataContext, {SgyPeriod} from '../../contexts/UserDataContext';
import SgyDataContext from '../../contexts/SgyDataContext';

// Utilities
import {findClassesList} from '../../pages/Classes';
import {bgColor} from '../../util/progressBarColor';
import {shortify} from '../../util/sgyHelpers';


type ClassesSidebarProps = { selected: SgyPeriod | 'A', setSelected: (selected: SgyPeriod | 'A') => void };
export default function ClassesSidebar(props: ClassesSidebarProps) {
    const { selected, setSelected } = props;
    const userData = useContext(UserDataContext);

    // collapsed?
    const [collapsed, setCollapsed] = useState(true);
    const { sgyData } = useContext(SgyDataContext);

    const classes = findClassesList(sgyData, userData);

    return (
        <div className={'classes-sidebar w-20 fixed right-0 bg-sidebar dark:bg-sidebar-dark flex flex-col gap-3 px-[15px] items-end ' + (collapsed ? 'collapsed' : 'expanded')}>
            {classes.map((c) => (
                <ClassesSidebarItem
                    key={c.period}
                    {...c}
                    collapsed={collapsed}
                    active={selected === c.period}
                    onClick={() => setSelected(c.period)}
                />
            ))}
            <Menu size={40} style={{marginTop: 'auto', cursor:'pointer'}} onClick={() => setCollapsed(!collapsed)} />
        </div>
    )
}

// TODO: we can probably do this in a similar way to <Sidebar>, where the items themselves don't care whether
// they are collapsed or not and the `hidden` is just set in CSS.
// Maybe this is a better pattern though, unsure; at the very least we could extract into a separate file for
// organizational purposes.
type ClassesSidebarItemProps = {
    collapsed: boolean, name: string, color: string, period: string,
    onClick: () => void, active: boolean
}
function ClassesSidebarItem(props: ClassesSidebarItemProps) {
    const {collapsed, name, color, period, onClick, active} = props;

    if (collapsed) {
        return (
            <div
                style={{
                    backgroundColor: color,
                    border: active ? `3px solid ${bgColor(color)}` : ''
                }}
                className="classes-sidebar-bubble"
                onClick={onClick}
            >
                {period}
            </div>
        );
    }

    return (
        <div className='classes-sidebar-item'>
            <div className='classes-sidebar-text'>{shortify(name, 20)}</div>
            <div
                style={{
                    backgroundColor: color,
                    border: active ? `3px solid ${bgColor(color)}` : ''
                }}
                className="classes-sidebar-bubble "
                onClick={onClick}
            >
                {period}
            </div>
        </div>
    );
}