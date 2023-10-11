import { Card, Stack, Title, Image } from '@mantine/core'
import React from 'react'
import bodyStyles from '../styles/bodyStyles';

const PartnerCard = (props: any) => {

    const { details } = props

    const { theme, classes } = bodyStyles()
    return (
        <Card shadow="xl" radius="md">
            <Stack>
                <Image mx="auto" sx={{ maxWidth: "60%", aspectRatio: "16/9", }} radius="md" src={details?.logo} />
                <Title order={3} align="center" weight={500} className={classes.text}>{details?.name}</Title>
            </Stack>
        </Card>
    )
}

export default PartnerCard