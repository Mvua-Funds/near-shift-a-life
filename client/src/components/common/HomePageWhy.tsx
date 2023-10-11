import { Card, Center, Grid, Stack } from '@mantine/core'
import React from 'react'
import { Avatar } from '@mantine/core';
import { Title } from '@mantine/core';
import bodyStyles from '../styles/bodyStyles';
import { Text } from '@mantine/core';

const whys = [
    {
        id: 1,
        title: "Contribute to the world",
        description: "Make, help, give, create, act, influence, innovate, participate, cooperate, share, develop, support, better, contribute, inspire, inspire others, improve, enrich, promote, build.",
        icon: "https://cdn.pixabay.com/photo/2015/01/15/16/17/hands-600497__340.jpg"
    },
    {
        id: 2,
        title: "Comfortable country",
        description: "Calm, peaceful, natural, serene, idyllic, scenic, tranquil, relaxation, rustic, rural, enjoyable, peacefulness, contentment, bucolic, stress-free, slow-paced, cozy, homely, friendly, hospitable.",
        icon: "https://www.aljazeera.com/wp-content/uploads/2021/11/wajirArticle1.jpg?resize=770%2C513&quality=80"
    },
    {
        id: 3,
        title: "Humane Treatment",
        description: "Compassionate, kind, respectful, gentle, caring, understanding, dignified, non-abusive, tolerant, ethical, fair, considerate, empathetic, patient, non-judgmental, protective, non-violent, thoughtful.",
        icon: "https://grdiocese.org/wp-content/uploads/2021/09/usccb-humane-treatment-haitians-other-migrants-featured.png"
    },
]

const HomePageWhy = () => {
    const { theme, classes } = bodyStyles()
    return (
        <>
            <Grid>
                {
                    whys.map((why: any, i: any) => (
                        <Grid.Col md={4} key={`why_${why.id}`}>
                            <Card radius="lg" shadow="xl">
                                <Stack>
                                    <Avatar mx="auto" size="xl" radius="md" src={why.icon} />
                                    <Title align='center' order={3} weight={400} className={classes.text} >{why.title}</Title>
                                    <Text className={classes.text} align="center">
                                        {why?.description}
                                    </Text>
                                </Stack>
                            </Card>
                        </Grid.Col>
                    ))
                }
            </Grid>
        </>
    )
}

export default HomePageWhy
