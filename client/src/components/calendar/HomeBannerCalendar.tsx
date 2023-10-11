import { Center, Stack, SegmentedControl, Group, Paper, Text, Image, useMantineTheme } from '@mantine/core'
import { Calendar, CalendarBase } from '@mantine/dates'
import { IconCalendarEvent, IconSpeakerphone } from '@tabler/icons'
import React from 'react'
import { useState } from 'react';
import { getTheme } from '../../configs/appfunctions';
import CampaignsCustomCalendar from './CampaignsCustomCalendar';
import EventsCustomCalendar from './EventsCustomCalendar';

const HomeBannerCalendar = () => {
    const [activeSegment, setActiveSegment] = useState('events')
    const theme = useMantineTheme()
    return (
        <Center className='h-100'>
            <Stack className='w-100' my="xl" spacing={16}>
                <SegmentedControl
                    fullWidth
                    radius="xl"
                    color="indigo"
                    onChange={seg => setActiveSegment(seg)}
                    data={[
                        {
                            label: (
                                <Group position='center'>
                                    <IconCalendarEvent />
                                    <Text>Events</Text>
                                </Group>
                            ), value: 'events'
                        },
                        {
                            label: (
                                <Group position='center'>
                                    <IconSpeakerphone />
                                    <Text>Campaigns</Text>
                                </Group>
                            ), value: 'campaigns'
                        },
                    ]}
                />
                <Paper p="xs" radius="lg">
                    {
                        activeSegment === 'events' ? (
                            <EventsCustomCalendar custom={false} allowdatechange={false} />
                        ) : null
                    }
                    {
                        activeSegment === 'campaigns' ? (
                            <CampaignsCustomCalendar custom={false} allowdatechange={false} />
                        ) : null
                    }
                </Paper>
                <Center>
                    {
                        getTheme(theme) ? (
                            <Image src='/near/no_margin/built-rev_nomargin.png' width="150px" />
                        ) : (
                            <Image src='/near/no_margin/built_nomargin.png' width="150px" />
                        )
                    }
                </Center>
            </Stack>
        </Center>
    )
}

export default HomeBannerCalendar