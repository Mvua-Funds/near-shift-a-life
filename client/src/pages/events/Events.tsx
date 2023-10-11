import React, { useEffect, useState, useMemo } from 'react'
import { Container, Grid, Box, Stack, Title, Group, Button, Text, Image, Paper, Center, Pagination, Anchor } from '@mantine/core';
import { Helmet } from 'react-helmet';
import { SEPARATOR, APP_NAME } from '../../configs/appconfig';
import bodyStyles from '../../components/styles/bodyStyles';
import { getTheme } from '../../configs/appfunctions';
import EventsCustomCalendar from '../../components/calendar/EventsCustomCalendar';

import EventCard from '../../components/activities/EventCard';
import { ShiftALifeViewFunctionCall } from '../../configs/nearutils';
import { useScrollIntoView } from '@mantine/hooks';
import { Link } from 'react-router-dom';


const Events = () => {

  const [events, setEvents] = useState<null | any>([])
  const [count, setCount] = useState(0)
  const [limit, setLimit] = useState(8)
  const [page, setPage] = useState(1)

  const no_of_pages = Math.ceil(count / limit)

  const { classes, theme } = bodyStyles()
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({ offset: 120 });

  const getEvents = () => {
    const wallet = window.walletConnection
    if (wallet) {
      ShiftALifeViewFunctionCall(wallet, {
        methodName: 'get_events',
        args: { page: page, limit: limit }
      }).then((res: any) => {
        const events_ = events
        const results: any = res?.results
        const merged = events_.concat(results).filter((obj: any, index: any, self: any) =>
          index === self.findIndex((obj2: any) => (
            obj.id === obj2.id
          ))
        );
        setEvents(merged)
        setCount(res?.count)
      }).catch((e: any) => {
        console.error("Error: ", e)
      })
    }
  }

  const wait = useMemo(() => {
    return {
      page
    }
  }, [page])

  useEffect(() => {
    getEvents()
  }, [wait])

  return (
    <>
      <Helmet>
        <title>Events {SEPARATOR} {APP_NAME}</title>
      </Helmet>
      <Container py="xs" size="xl" sx={{ marginBottom: "70px" }}>
        <Grid>
          <Grid.Col className='fixed-height position-relative' md={7}>
            <Box py="xl" sx={{
              position: "absolute",
              bottom: "60px",
              left: 0,
            }}>
              <Stack>
                {
                  getTheme(theme) ? (
                    <Image src='/near/no_margin/built-rev_nomargin.png' width="150px" />
                  ) : (
                    <Image src='/near/no_margin/built_nomargin.png' width="150px" />
                  )
                }
                <Title className={classes.title}>Events</Title>
                <Text className={classes.text}>
                  Events are short term activities that we carry out in relation to making donations to help <span className={classes.bold}>Shift a Life</span> of somebody or a community.
                </Text>
                <Group mt="xl">
                  <Button radius="xl" px="xl" color="purple" onClick={() => scrollIntoView({ alignment: 'center' })}>View all</Button>
                  <Anchor to="/create/event" component={Link}>
                  <Button radius="xl" px="xl" color="purple" variant="outline">Create Event</Button>
                  </Anchor>
                </Group>
              </Stack>
            </Box>
          </Grid.Col>
          <Grid.Col md={5} className='fixed-height' py="xl">
            <Center className='h-100'>
              <Paper p="xs" radius="lg">
                <EventsCustomCalendar custom={false} allowdatechange={false} />
              </Paper>
            </Center>
          </Grid.Col>
        </Grid>
        <Box>
          <Stack spacing={0} mb="md">
            <Title className={classes.subtitle} order={2}>Events display</Title>
            <Text size="sm" className={classes.text}>
              Preview all the events on the calendar
            </Text>
          </Stack>
          <EventsCustomCalendar custom={true} allowdatechange={true} />
        </Box>
        <Stack spacing={0} my="xl">
          <Title className={classes.subtitle}>Make Donations</Title>
          <Text className={classes.text}>
            Events are short term activities that we carry out in relation to making donations to help <span className={classes.bold}>Shift a Life</span> of somebody or a community.
          </Text>
        </Stack>
        <Group position='right'>
          <Pagination total={no_of_pages} page={page} onChange={page => setPage(page)} />
        </Group>
        <Grid ref={targetRef}>
          {
            events.map((c: any, i: any) => (
              <Grid.Col md={3} key={`event_a_${c.id}`}>
                <EventCard details={c} />
              </Grid.Col>
            ))
          }
        </Grid>
        <Group position='right'>
          <Pagination total={no_of_pages} page={page} onChange={page => setPage(page)} />
        </Group>
      </Container>
    </>
  )
}

export default Events