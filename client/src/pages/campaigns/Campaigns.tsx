import React, { useEffect, useMemo, useState } from 'react'
import { SEPARATOR, APP_NAME } from '../../configs/appconfig'
import { Helmet } from 'react-helmet';
import { Grid, Container, Box, Button, Center, Group, Paper, Stack, Title, Image, Text, Pagination, Anchor } from '@mantine/core';
import CampaignsCustomCalendar from '../../components/calendar/CampaignsCustomCalendar';
import { getTheme } from '../../configs/appfunctions';
import bodyStyles from '../../components/styles/bodyStyles';
import CampaignCard from '../../components/activities/CampaignCard';
import { ShiftALifeViewFunctionCall } from '../../configs/nearutils';
import { useScrollIntoView } from '@mantine/hooks';
import { Link } from 'react-router-dom';


const Campaigns = () => {

  const [campaigns, setCampaigns] = useState<null | any>([])
  const [count, setCount] = useState(0)
  const [limit, setLimit] = useState(8)
  const [page, setPage] = useState(1)

  const no_of_pages = Math.ceil(count / limit)

  const { classes, theme } = bodyStyles()
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({ offset: 120 });
 
  const getCampaigns = () => {
    const wallet = window.walletConnection
    if (wallet) {
      ShiftALifeViewFunctionCall(wallet, {
        methodName: 'get_campaigns',
        args: { page: page, limit: limit }
      }).then((res: any) => {
        const campaigns_ = campaigns
        const results: any = res?.results
        const merged = campaigns_.concat(results).filter((obj: any, index: any, self: any) =>
          index === self.findIndex((obj2: any) => (
            obj.id === obj2.id
          ))
        );
        setCampaigns(merged)
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
    getCampaigns()
  }, [wait])

  return (
    <>
      <Helmet>
        <title>Campaigns {SEPARATOR} {APP_NAME}</title>
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
                <Title className={classes.title}>Campaigns</Title>
                <Text className={classes.text}>
                  Campaigns are long term activities that we carry out in relation to making donations to help <span className={classes.bold}>Shift a Life</span> of somebody or a community.
                </Text>
                <Group mt="xl">
                  <Button radius="xl" px="xl" color="purple" onClick={() => scrollIntoView({ alignment: 'center' })}>View all</Button>
                  <Anchor to="/create/campaign" component={Link}>
                  <Button radius="xl" px="xl" color="purple" variant="outline">Create Campaign</Button>
                  </Anchor>
                </Group>
              </Stack>
            </Box>
          </Grid.Col>
          <Grid.Col md={5} className='fixed-height' py="xl">
            <Center className='h-100'>
              <Paper p="xs" radius="lg">
                <CampaignsCustomCalendar custom={false} allowdatechange={false} />
              </Paper>
            </Center>
          </Grid.Col>
        </Grid>
        <Box>
          <Stack spacing={0} mb="md">
            <Title className={classes.subtitle} order={2}>Campaigns display</Title>
            <Text size="sm" className={classes.text}>
              Preview all the campaigns on the calendar
            </Text>
          </Stack>
          <CampaignsCustomCalendar custom={true} allowdatechange={true} />
        </Box>

        <Stack spacing={0} my="xl">
          <Title className={classes.subtitle}>Make Donations</Title>
          <Text className={classes.text}>
            Campaigns are long term activities that we carry out in relation to making donations to help <span className={classes.bold}>Shift a Life</span> of somebody or a community.
          </Text>
        </Stack>
        <Group position='right'>
          <Pagination total={no_of_pages} page={page} onChange={page => setPage(page)} />
        </Group>
        <Grid my="md" ref={targetRef}>
          {
            campaigns.map((c: any, i: any) => (
              <Grid.Col md={3} key={`ds_campaign_${c.id}`}>
                <CampaignCard details={c} />
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

export default Campaigns

