import {
    Anchor,
    Button,
    NavLink, Text, useMantineTheme
} from '@mantine/core';

import { Link, useMatch, useResolvedPath } from "react-router-dom";

const CustomLinkComponent = (props: any) => {
    const { to, label } = props.details
    const theme = useMantineTheme()
    
    let resolved = useResolvedPath(to);
    let match = useMatch({ path: resolved.pathname, end: true });
    let matched = match ? true : false

    return (
        <Anchor to={to} component={Link} style={{ textDecoration: "none" }} >
            <NavLink px="xl" className='child' variant='filled' active={matched ? true : false} label={label} sx={{
                borderRadius: theme.radius.md
            }} />
            {/* <Button radius="md" px="xl" color={matched ? 'purple' : 'transparent !important'} variant={matched ? "filled" : "default"}>
                {label}
            </Button> */}
        </Anchor>
    )
}

export default CustomLinkComponent