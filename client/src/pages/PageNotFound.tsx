import { Center, Container, Stack, Title, Text } from '@mantine/core'
import React from 'react'

const PageNotFound = () => {
    return (
        <Container className='fixed-height'>
            <Center className='h-100'>
                <Stack spacing={4}>
                <Title weight={800} align="center">Page not Found</Title>
                <Text align='center' size="sm">The page you are looking for was not found on the server.</Text>
                </Stack>
            </Center>
        </Container>
    )
}

export default PageNotFound