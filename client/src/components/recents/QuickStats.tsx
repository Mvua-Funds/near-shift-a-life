import { Box, Container, Grid, Card, Stack, Title, Image, Text } from '@mantine/core'
import React from 'react'
import { getTheme } from '../../configs/appfunctions'
import { theme } from '../../ThemeProvider'
import bodyStyles from '../styles/bodyStyles';
import { useState } from 'react';
import { ShiftALifeViewFunctionCall } from '../../configs/nearutils';
import { useEffect } from 'react';

const QuickStats = () => {
    const [stats, setStats] = useState<null | any>(null)
    const { classes, theme } = bodyStyles()

    const getStats = () => {
        const wallet = window.walletConnection
        if (wallet) {
            ShiftALifeViewFunctionCall(wallet, {
                methodName: 'get_donations_stats',
                args: { page: 1, limit: 3 }
            }).then((res: any) => {
                setStats(res)
            }).catch((e: any) => {
                console.error("Error: ", e)
            })
        }
    }

    useEffect(() => {
        getStats()
    } ,[])

    return (
        <>
            <Box py="md" className='custom-mb' sx={{
                // background: "linear-gradient(30deg, rgba(20, 20, 255, 0.3), rgba(0, 0, 255, 0.2)), url(https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?auto=compress&cs=tinysrgb&w=600) no-repeat",
                // mixBlendMode: "difference",
                backgroundPosition: "center",
                background: `radial-gradient(
                                    ellipse at top left,
                                    rgba(29, 39, 54, 0.3) 0%,
                                    rgba(29, 39, 54, 0) 72%)`
            }}>
                <Container size="lg">
                    <Grid>
                        <Grid.Col xs={6} md={4}>
                            <Card radius="lg" sx={{
                                background: getTheme(theme) ? "#242a49" : theme.colors.gray[0]
                            }}>
                                <Stack align="center" spacing={0}>
                                    <Image src="/imgs/deal.png" width="100px" mx="auto" sx={{ aspectRatio: "16 / 9", maxHeight: "100px" }} />
                                    <Text className={classes.text} size="xl">Partners</Text>
                                    <Title className={classes.subtitle} order={2}>{stats?.partners}</Title>
                                </Stack>
                            </Card>
                        </Grid.Col>
                        <Grid.Col xs={6} md={4}>
                            <Card radius="lg" sx={{
                                background: getTheme(theme) ? "#242a49" : theme.colors.gray[0]
                            }}>
                                <Stack align="center" spacing={0}>
                                    <Image src="/imgs/box.png" width="100px" mx="auto" sx={{ aspectRatio: "16 / 9", maxHeight: "100px" }} />
                                    <Text className={classes.text} size="xl">Causes</Text>
                                    <Title className={classes.subtitle} order={2}>{stats?.causes}</Title>
                                </Stack>
                            </Card>
                        </Grid.Col>
                        <Grid.Col md={4}>
                            <Card radius="lg" sx={{
                                background: getTheme(theme) ? "#242a49" : theme.colors.gray[0]
                            }}>
                                <Stack align="center" spacing={0}>
                                    <Image src="/imgs/tokens.png" width="100px" mx="auto" sx={{ aspectRatio: "16 / 9", maxHeight: "100px" }} />
                                    <Text className={classes.text} size="xl">Tokens</Text>
                                    <Title className={classes.subtitle} order={2}>{stats?.tokens}</Title>
                                </Stack>
                            </Card>
                        </Grid.Col>
                        <Grid.Col xs={6} md={6} offsetMd={3}>
                            <Card radius="lg" sx={{
                                // background: getTheme(theme) ? "#242a49" : theme.colors.gray[0],
                                // background: "#6a3093",  /* fallback for old browsers */
                                // background: "-webkit-linear -gradient(to right, #a044ff, #6a3093)",  /* Chrome 10-25, Safari 5.1-6 */
                                background: "linear-gradient(to right, #a044ff, #6a3093)", /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

                            }}>
                                <Stack align="center" spacing={0}>
                                    <Image src="/imgs/donation.png" width="100px" mx="auto" sx={{ aspectRatio: "16 / 9", maxHeight: "100px" }} />
                                    <Text className={classes.text} sx={{ color: "white" }} size="xl">Donations</Text>
                                    <Title className={classes.subtitle} sx={{ color: "white" }} order={2}>$ {stats?.total_usd}</Title>
                                </Stack>
                            </Card>
                        </Grid.Col>
                        <Grid.Col md={6}>
                            <Card radius="lg" sx={{
                                background: getTheme(theme) ? "#242a49" : theme.colors.gray[0]
                            }}>
                                <Stack align="center" spacing={0}>
                                    <Image src="/imgs/planner.png" width="100px" mx="auto" sx={{ aspectRatio: "16 / 9", maxHeight: "100px" }} />
                                    <Text className={classes.text} size="xl">Events</Text>
                                    <Title className={classes.subtitle} order={2}>{stats?.events}</Title>
                                </Stack>
                            </Card>
                        </Grid.Col>
                        <Grid.Col md={6}>
                            <Card radius="lg" sx={{
                                background: getTheme(theme) ? "#242a49" : theme.colors.gray[0]
                            }}>
                                <Stack align="center" spacing={0}>
                                    <Image src="/imgs/group.png" width="100px" mx="auto" sx={{ aspectRatio: "16 / 9", maxHeight: "100px" }} />
                                    <Text className={classes.text} size="xl">Campaigns</Text>
                                    <Title className={classes.subtitle} order={2}>{stats?.campaigns}</Title>
                                </Stack>
                            </Card>
                        </Grid.Col>
                    </Grid>
                </Container>
            </Box>
        </>
    )
}

export default QuickStats