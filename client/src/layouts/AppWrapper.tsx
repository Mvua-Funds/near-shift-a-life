import { useState } from 'react';
import {
    AppShell,
    Header,
    MediaQuery,
    Burger,
    useMantineTheme,
    Group,
    Title,
    Button,
    Image,
    Divider,
    Modal,
    Drawer,
    Anchor,
    Stack,
    Text,
} from '@mantine/core';
import CustomLinkComponent from '../components/common/CustomNavlink';
import { getTheme } from '../configs/appfunctions';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { connectWallet, disconnectWallet } from '../configs/near/utils';
import CreateDropdown from '../components/common/CreateDropdown';
import Footer from '../components/common/Footer';
import { APP_NAME } from '../configs/appconfig';
import { Link } from 'react-router-dom';

const navlinks = [
    { to: "/", label: "Home" },
    { to: "/campaigns", label: "Campaigns" },
    { to: "/events", label: "Events" },
]

// Text color for light mode: #1f1f30
 
export default function AppWrapper(props: any) {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const isSignedIn = window?.walletConnection?.isSignedIn()
    return (
        <AppShell
            styles={{
                main: {
                    background: getTheme(theme) ? theme.colors.dark[8] : "#d3d6e9",
                    zIndex: 2,
                },
            }}
            layout="alt"
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            padding={0}
            header={
                <Header height={{ base: 50, md: 60 }} p="md" sx={theme => ({
                    background: getTheme(theme) ? theme.colors.dark[6] : "#d3d6e9"
                })}>
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: "space-between" }}>

                        <Group align="center">
                            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                                <Burger
                                    opened={opened}
                                    onClick={() => setOpened((o) => !o)}
                                    size="sm"
                                    color={theme.colors.gray[6]}
                                />
                            </MediaQuery>
                            <Anchor component={Link} to="/" sx={{
                                textDecoration: "none !important",
                                ".lis": {
                                    color: getTheme(theme) ? theme.colors.gray[1] : theme.colors.dark[8],
                                    textDecoration: "none",
                                    ":hover": {
                                        textDecoration: "none !important"
                                    }
                                }
                            }}>
                                <Stack spacing={-10}>
                                    <Title order={2} className="lis">SaL</Title>
                                    <Text size="xs" className="lis">DONATE</Text>
                                </Stack>
                            </Anchor>
                            <Divider orientation='vertical' />
                            {
                                getTheme(theme) ? (
                                    <Image src='/near/no_margin/built-rev_nomargin.png' width="100px" />
                                ) : (
                                    <Image src='/near/no_margin/built_nomargin.png' width="100px" />
                                )
                            }
                        </Group>

                        <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
                            <Group>
                                {
                                    navlinks.map((l: any, i: any) => (
                                        <CustomLinkComponent key={`navlink_${i}`} details={l} />
                                    ))
                                }
                                <CreateDropdown />
                            </Group>
                        </MediaQuery>

                        <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
                            <Group>
                                <Button radius="xl" px="xl" color="indigo" onClick={isSignedIn ? disconnectWallet : connectWallet}>{isSignedIn ? "Disconnect wallet" : "Connect wallet"}</Button>
                                <ColorSchemeToggle />
                            </Group>
                        </MediaQuery>
                    </div>
                </Header>
            }
        >
            <Drawer
                opened={opened}
                onClose={() => setOpened(false)}
                title={`${APP_NAME} - Menu`}
                padding="xl"
                size="md"
            >
                {
                    navlinks.map((l: any, i: any) => (
                        <CustomLinkComponent key={`navlink_${i}`} details={l} />
                    ))
                }
            </Drawer>
            <div className='min-height'>
                {props.children}
            </div>
            <Footer />
        </AppShell>
    );
}