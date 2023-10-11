import { useState } from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import { Menu, useMantineTheme, NavLink, Anchor } from '@mantine/core';
import { IconSpeakerphone, IconCalendarEvent } from '@tabler/icons';



export const CustomLinkComponentDropdown = (props: any) => {
    const { details: { to, label, icon }, click } = props
    const theme = useMantineTheme()

    let resolved = useResolvedPath(to);
    let match = useMatch({ path: resolved.pathname, end: true });
    let matched = match ? true : false

    return (
        <Anchor to={to} component={Link} style={{ textDecoration: "none" }} >
            <NavLink onClick={click} icon={icon} variant='light' active={matched ? true : false}
                label={label}
                sx={{
                    borderRadius: theme.radius.xl,
                    marginBottom: "2px"
                }} />
        </Anchor>
    )
}

function CreateDropdown() {
    const [open, setOpen] = useState(false)
    const theme = useMantineTheme()

    return (
        <Menu opened={open} onClose={() => setOpen(false)} shadow="md" width={200} radius="lg"
            withArrow transition="slide-up" offset={13} arrowOffset={20} transitionDuration={200}>
            <Menu.Target>
                <NavLink onClick={() => setOpen(o => !o)} px="xl" className='child' variant='filled' label="Create" sx={{
                    borderRadius: theme.radius.md,
                    display: "inline !important",
                    width: "fit-content !important",
                }} />

            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>SELECT</Menu.Label>
                <CustomLinkComponentDropdown click={() => setOpen(false)} details={{ to: "/create/event", label: "Create Event", icon: <IconCalendarEvent size={18} color="indigo" /> }} />
                <CustomLinkComponentDropdown click={() => setOpen(false)} details={{ to: "/create/campaign", label: "Create Campaign", icon: <IconSpeakerphone size={18} color="green" /> }} />
            </Menu.Dropdown>
        </Menu>
    );
}

export default CreateDropdown;