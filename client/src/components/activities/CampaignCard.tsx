import { Paper, Box, Stack, Title, Badge, Button, Group, Text, Anchor, Tooltip } from '@mantine/core'
import { IconCashBanknote, IconCalendar } from '@tabler/icons'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ANY_TOKEN, NEAR_OBJECT } from '../../configs/appconfig'
import { getTimezone } from '../../configs/appfunctions'
import { getReadableTokenBalance } from '../../configs/nearutils'
import bodyStyles from '../styles/bodyStyles'

const CampaignCard = (props: any) => {
    const { details } = props;
    const { theme, classes } = bodyStyles()

    const [tokenDetails, setTokenDetails] = useState<null | any>(null)

    const getTokenMetadata = () => {
        const wallet = window.walletConnection
        if (wallet) {
            if (details.token === "any") {
                setTokenDetails(ANY_TOKEN)
            }
            else if (details.token === "near") {
                setTokenDetails(NEAR_OBJECT)
            }
            else {
                wallet.account().viewFunction(details?.token, "ft_metadata", {}, "3000000000000000").then((res: any) => {
                    setTokenDetails(res)
                }).catch((err: any) => { })
            }
        }
    }

    useEffect(() => {
        getTokenMetadata()
    }, [])

    return (
        <Paper radius="lg" sx={{
            overflow: "hidden !important",
        }}>

            <Box sx={{
                height: "300px",
                position: "relative",
                // borderRadius: theme.radius.lg,
            }}>
                <img loading='lazy' src={details?.img !== "someimageurl" ? details?.img : "https://images.unsplash.com/photo-1420593248178-d88870618ca0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JlZW4lMjBmb3Jlc3R8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        aspectRatio: "16/9",

                    }} />
                <Box p="lg" sx={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    top: 0,
                    left: 0,
                    background: theme.fn.linearGradient(180, "rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 1)"),
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "end"

                }}>
                    <Stack className='w-100' spacing={10}>
                        <Title order={2} color="white" sx={{ textTransform: "capitalize" }} align="center">{details?.title}</Title>
                        <Badge sx={{ width: "fit-content" }} mx="auto" variant='light'>Target: {details?.token === "any" ? details?.currenct_usd : getReadableTokenBalance(details?.current, tokenDetails?.decimals)} / {details?.target} {details?.token === "any" ? "USD" : tokenDetails?.symbol}</Badge>
                        <Anchor to={`/campaigns/${details?.id}`} component={Link} mx="auto">
                            <Button sx={{ width: "fit-content" }} radius="xl" px="xl" color="indigo" leftIcon={<IconCashBanknote />}>Donate</Button>
                        </Anchor>
                        <Group position='apart' align="center" spacing={0}>
                            <Tooltip label={getTimezone(details.start_date)} color="lime" withArrow>
                                <Group align="center" spacing={2}>
                                    <IconCalendar color="white" />
                                    <Text size="xs" color="white">{new Date(details?.start_date).toDateString()}</Text>
                                </Group>
                            </Tooltip>
                            <Tooltip label={getTimezone(details.end_date)} color="lime" withArrow>
                                <Group align="center" spacing={2}>
                                    <IconCalendar color="white" />
                                    <Text size="xs" color="white">{new Date(details?.end_date).toDateString()}</Text>
                                </Group>
                            </Tooltip>
                        </Group>
                    </Stack>
                </Box>
            </Box>
        </Paper>
    )
}

export default CampaignCard