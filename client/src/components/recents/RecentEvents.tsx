import { Anchor, Button, Grid, Group, Stack, Title } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { ShiftALifeViewFunctionCall } from '../../configs/nearutils';
import EventCard from '../activities/EventCard';
import bodyStyles from '../styles/bodyStyles';

const RecentEvents = () => {

    const [events, setEvents] = useState<null | any>([])

    const { theme, classes } = bodyStyles()

    const getEvents = () => {
        const wallet = window.walletConnection
        if (wallet) {
            ShiftALifeViewFunctionCall(wallet, {
                methodName: 'get_events',
                args: { page: 1, limit: 3 }
            }).then((res: any) => {
                setEvents(res.results)
            }).catch((e: any) => {
                console.error("Error: ", e)
            })
        }
    }

    useEffect(() => {
        getEvents()
    }, [])

    return (
        <>
            <Stack>
                <Group position='apart' align="center">
                    <Title order={2} weight={500} className={classes.subtitle}>Recent Events</Title>
                    <Anchor component={Link} to="/events">
                        <Button variant='outline' radius="md" color="indigo" rightIcon={<IconArrowRight />}>View all</Button>
                    </Anchor>
                </Group>
                <Grid>
                    {
                        events.map((c: any, i: any) => (
                            <Grid.Col md={4} key={`event_a_${c.id}`}>
                                <EventCard details={c} />
                            </Grid.Col>
                        ))
                    }
                </Grid>
            </Stack>
        </>
    )
}

export default RecentEvents