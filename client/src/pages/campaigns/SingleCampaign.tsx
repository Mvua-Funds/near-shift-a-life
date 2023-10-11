import { ActionIcon, Avatar, Box, Button, Center, ColorSwatch, Container, Grid, Group, List, Loader, LoadingOverlay, Paper, RingProgress, ScrollArea, Stack, Table, Text, TextInput, Title, Tooltip } from '@mantine/core';
import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet';
import { SEPARATOR, APP_NAME, NEAR_OBJECT, ANY_TOKEN, CONTRACT } from '../../configs/appconfig';
import bodyStyles from '../../components/styles/bodyStyles';
import { getTheme, getTimezone } from '../../configs/appfunctions';
import { IconCalendar, IconCashBanknote, IconChevronDown, IconCoin, IconX, IconCheck, IconAlertCircle } from '@tabler/icons';
import { useParams } from 'react-router-dom';
import SelectTokenModal from '../../components/common/SelectTokenModal';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { nanoid } from 'nanoid';
import { getAmtString, getTokenPrice, getUSD, makeArray, ShiftALifeFunctionCall, getReadableTokenBalance } from '../../configs/nearutils';
import CampaignDonations from '../../components/activities/CampaignDonations';
import BecomePartnerModal from '../../components/common/BecomePartnerModal';
import DonDetails from '../../components/activities/DonDetails';
import { connectWallet } from '../../configs/near/utils';
import BigNumber from 'bignumber.js';

const SingleCampaign = () => {

  const [data, setData] = useState<null | any>(null)
  const [tokenDetails, setTokenDetails] = useState<null | any>(null)
  const [loading, setLoading] = useState(false)
  const [voting, setVoting] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectedToken, setSelectedToken] = useState(NEAR_OBJECT)
  const [amt, setAmt] = useState("")
  const [tokenPrice, setTokenPrice] = useState(0)

  const { theme, classes } = bodyStyles()
  const modals = useModals()
  const { cid } = useParams()

  const partners = makeArray(data?.partners)

  const amIaVoter = (voter: any) => {
    return data?.voters.some((x: any) => x === voter);
  }

  const getCampaign = () => {
    const contract = window.contract
    const wallet = window.walletConnection

    if (cid && wallet) {
      setLoading(true)
      contract.get_campaign({ id: cid }).then((res: any) => {
        setData(res)
      }).catch((err: any) => {
        console.log(err)
      }).finally(() => {
        setLoading(false)
      })
    }
  }

  const getTokenMetadata = () => {
    const wallet = window.walletConnection
    if (wallet) {
      wallet.account().viewFunction(data?.token, "ft_metadata", {}, "3000000000000000").then((res: any) => {
        setTokenDetails(res)
      }).catch((err: any) => { })
    }
  }

  const nearDonate = () => {
    const wallet = window.walletConnection
    const contract = window.contract
    if (contract) {
      const amount = getAmtString(amt, 24)
      contract.near_donation({
        id: nanoid() + Date.now(),
        token: "near",
        amount: amount,
        amount_usd: getUSD(amt, tokenPrice),
        target: "campaign",
        event: "null",
        campaign: cid,
      }, "300000000000000", amount).then((res: any) => { }).catch((err: any) => { })
    }
  }

  const tokenDonate = (address: string) => {
    const wallet = window.walletConnection
    if (wallet) {
      const id = nanoid() + Date.now()
      const amt_ = data?.token === "any" ? getAmtString(amt, selectedToken?.decimals) : getAmtString(amt, tokenDetails?.decimals)

      const amt_usd = getUSD(amt, tokenPrice)
      const msg = `${id}:campaign:${cid}:null:${amt_usd}`
      wallet.account()
        .functionCall(address, "ft_transfer_call", { receiver_id: CONTRACT, amount: amt_, msg: msg }, 100000000000000, 1)
        .then((res: any) => { }).catch((err: any) => { })
    }
  }

  const donate = () => {

    if (data?.token === "any") {
      if (selectedToken?.address === "near") {
        // Near donation
        nearDonate()
        return
      }
      else {
        // Token donation - just transfer with the right msg - Use selectedToken?.address to get token address
        tokenDonate(selectedToken?.address)
        return
      }
    }
    else {
      if (tokenDetails?.address === "near") {
        // Near donation
        nearDonate()
        return
      }
      else {
        // Token donation - just transfer with the right msg - Use data?.token to get token address
        tokenDonate(data?.token)
        return
      }
    }
  }

  const showModal = () => {
    if (amt === "" || amt === null) {
      showNotification({
        message: "Amount required.Please enter the amount you wish to donate to this campaign",
        color: "red",
      })
      return
    }
    else {
      modals.openConfirmModal({
        title: 'Make donation',
        centered: true,
        children: (
          <>
            <DonDetails label="Amount" value={amt} />
            <DonDetails label="Token" value={data?.token === "any" ? selectedToken?.symbol : tokenDetails?.symbol} />
            <DonDetails label="Token Price" value={`${tokenPrice} USD`} />
            <DonDetails label="Estimated USD" value={parseFloat(amt) * tokenPrice} />
            <Text size="sm" mt="md" className={classes.text}>
              <b>NB:/-</b> Not all tokens load there approximate USD prices.
              0 USD might mean that we could not fetch the price of the token since it is not available on
              &nbsp;<b>Ref Finance</b>
            </Text>
          </>
        ),
        labels: { confirm: 'Donate', cancel: "Cancel" },
        confirmProps: { color: 'indigo', radius: "xl" },
        cancelProps: { radius: "xl" },
        onCancel: () => { },
        onConfirm: () => { donate() },
        radius: "lg",
        styles: {
          modal: {
            background: getTheme(theme) ? theme.colors.dark[6] : "#d3d6e9"
          }
        }
      })
    }
  }

  const loadTokenPrice = async (address: string) => {
    console.log("Loading token price: ", address)
    let res = await getTokenPrice(address)
    if (res === "N/A" || res?.price === "N/A") {
      setTokenPrice(0)
      return;
    }
    else {
      setTokenPrice(res?.price)
      return;
    }
  }

  const voteForPartner = (partner: string) => {
    const contract = window.contract
    if (contract) {
      setVoting(true)
      contract.campaign_vote({ id: cid, partner: partner }).then((res: any) => {
        if (res === "done") {
          showNotification({
            message: "You have successfully voted.",
            color: "green",
            icon: <IconCheck />
          })
          return;
        }
        if (res === "voter not found") {
          showNotification({
            message: "You can't vote to this campaign",
            color: "indigo",
            icon: <IconAlertCircle />
          })
          return
        }
        if (res === "not found") {
          showNotification({
            message: "Campaign not found",
            color: "yellow",
            icon: <IconAlertCircle />
          })
        }
      }).catch((err: any) => {
        showNotification({
          message: "An error occured, please try again later!",
          color: "red",
          icon: <IconX />
        })
      }).finally(() => {
        setVoting(false)
      })
    }
  }

  const isSignedIn = window?.walletConnection?.isSignedIn()

  const getCurrentPercentage = () => {
    if (data?.token === "any") {
      // return (parseFloat(data?.current_usd ) / parseFloat(data?.target)) * 100
      return new BigNumber(data?.current_usd).dividedBy(data?.target).multipliedBy(100).toNumber()
    }
    else {
      let cur = new BigNumber(data?.current).dividedBy(10 ** tokenDetails?.decimals)
      // return (cur.toNumber() / data?.target) * 100
      return new BigNumber(cur).dividedBy(data?.target).multipliedBy(100).toNumber()
    }
  }

  useEffect(() => {
    if (data?.token.toLowerCase() === "near") {
      setTokenDetails(NEAR_OBJECT)
    }
    else if (data?.token.toLowerCase() === "any") {
      setTokenDetails(ANY_TOKEN)
    } else {
      getTokenMetadata()
    }
  }, [data])

  useEffect(() => {
    if (data?.token.toLowerCase() === "near") {
      loadTokenPrice('wrap.testnet')
      return;
    }
    else if (data?.token.toLowerCase() === "any") {
      if (selectedToken?.address === "near") {
        loadTokenPrice("wrap.testnet")
        return;
      }
      else {
        loadTokenPrice(selectedToken?.address)
        return;
      }
    } else if (data?.token !== "near" || data?.token !== "any") {
      loadTokenPrice(data?.token)
      return;
    }
  }, [selectedToken, data])

  const call_cid = useMemo(() => {
    return {
      cid: cid
    }
  }, [cid])

  useEffect(() => {
    getCampaign()
  }, [call_cid])

  return (
    <>
      <Helmet>
        <title>{`${data?.title || ""}`} {SEPARATOR} {APP_NAME}</title>
      </Helmet>
      <SelectTokenModal select={setSelectedToken} open={openModal} closeModal={() => setOpenModal(false)} selectedToken={selectedToken} />
      <Container size="lg" py="xl" sx={{ paddingBottom: "60px", position: "relative" }}>
        <LoadingOverlay visible={loading} />
        <Grid>
          <Grid.Col md={7}>
            <Box>
              <Title order={1} className={classes.subtitle} mb="xl">{data?.title}</Title>
              <img loading='lazy' src={data?.img !== "" ? data?.img : "https://images.unsplash.com/photo-1420593248178-d88870618ca0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JlZW4lMjBmb3Jlc3R8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  aspectRatio: "16/9",
                  borderRadius: theme.radius.lg,
                }} />
              <Paper p="xs" radius="lg" my="md">
                Cause: {data?.cause}
              </Paper>
              <Paper p="xs" radius="lg" my="md">
                <Text className={classes.text} p="xs" sx={{
                  whiteSpace: "pre-wrap"
                }}>
                  {data?.description}
                </Text>
              </Paper>
              <Paper p="xs" radius="lg">
                <Grid>
                  <Grid.Col md={6}>
                    <Tooltip label={getTimezone(data?.start_date)} color="lime" withArrow>
                      <Group align="center" spacing={6}>
                        <Text>Start Date:</Text>
                        <IconCalendar />
                        <Text size="xs">{new Date(data?.start_date).toDateString()}</Text>
                      </Group>
                    </Tooltip>
                  </Grid.Col>
                  <Grid.Col md={6}>
                    <Tooltip label={getTimezone(data?.end_date)} color="lime" withArrow>
                      <Group align="center" spacing={6}>
                        <Text>End Date:</Text>
                        <IconCalendar />
                        <Text size="xs" >{new Date(data?.end_date).toDateString()}</Text>
                      </Group>
                    </Tooltip>
                  </Grid.Col>
                  <Grid.Col md={6}>
                    <Tooltip label="Targetted amount" color="lime" withArrow>
                      <Group align="center" spacing={6}>
                        <Text>Target:</Text>
                        <IconCoin />
                        <Text size="xs" >{data?.target} {tokenDetails?.symbol === "any" ? "USD" : tokenDetails?.symbol}</Text>
                      </Group>
                    </Tooltip>
                  </Grid.Col>
                  <Grid.Col md={6}>
                    <Tooltip label="Token for donation" color="lime" withArrow>
                      <Group align="center" spacing={10}>
                        {/* <Text>Token:</Text> */}
                        <Avatar src={tokenDetails?.icon} size="sm" color="indigo">
                          {tokenDetails?.symbol?.substring(0, 1)}
                        </Avatar>
                        <Stack spacing={0}>
                          <Text size="sm">{tokenDetails?.name} - {tokenDetails?.symbol}</Text>
                          <Text size="xs">{data?.token}</Text>
                        </Stack>
                      </Group>
                    </Tooltip>
                  </Grid.Col>
                </Grid>
              </Paper>
            </Box>
          </Grid.Col>
          <Grid.Col md={5}>
            <Paper radius="lg" p="xs">
              <Title order={3} className={classes.text} mb="sm" align='center'>Make donation</Title>
              <Stack>
                {
                  data?.token?.toLowerCase() === "any" ? (
                    <Paper radius="md" sx={{
                      background: getTheme(theme) ? theme.colors.dark[5] : theme.colors.gray[1],
                      padding: "4px"
                    }}>
                      <Text size="md" mb="xs">Select Donation Token</Text>
                      <Group onClick={() => setOpenModal(true)} px="xs" align="center" position='apart' sx={{
                        background: getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[0],
                        borderRadius: theme.radius.md,
                        cursor: "pointer"
                      }}>
                        <Group>
                          <Avatar src={selectedToken?.icon} size="sm" color="indigo">
                            {selectedToken?.symbol?.substring(0, 1)}
                          </Avatar>
                          <Stack spacing={0}>
                            <Text size="sm" weight={600}>{selectedToken?.name}</Text>
                            <Text size="xs">{selectedToken?.symbol}</Text>
                          </Stack>
                        </Group>
                        <ActionIcon color="indigo" variant="light">
                          {
                            false ? <IconX /> : <IconChevronDown />
                          }
                        </ActionIcon>
                      </Group>
                    </Paper>
                  ) : null
                }
                <TextInput value={amt}
                  onChange={e => setAmt(e.target.value)}
                  radius="lg"
                  placeholder={`Amt in ${data?.token === "any" ? selectedToken?.symbol : tokenDetails?.symbol}`}
                  label={<Text className={classes.text} mb="xs">Enter Amount to Donate</Text>} size="md"
                  sx={{ overflow: "hidden" }}
                  icon={<Avatar size="sm" src={tokenDetails?.icon} sx={{
                    // background: getTheme(theme) ? theme.colors.dark[5] : theme.colors.gray[1],
                    width: "30px",
                    height: "30px",
                    minWidth: "30px !important",
                    minHeight: "30px !important",
                    maxWidth: "30px !important",
                    maxHeight: "30px !important",
                    padding: "4px",

                    textTransform: "capitalize"
                  }}>{tokenDetails?.symbol?.substring(0, 1)}</Avatar>} />
                <Text size="xs" align="center">This campaign is set to receive <b>{tokenDetails?.symbol}</b> Tokens</Text>

                {
                  !isSignedIn ? <Button radius="xl" fullWidth px="xl" color="purple" onClick={connectWallet}>Connect wallet</Button>
                    :
                    <Button color="indigo" size="md"
                      leftIcon={<IconCashBanknote />} radius="xl" fullWidth
                      onClick={showModal}>
                      Donate
                    </Button>
                }
                {/* <Text size="xs" align='center'>
                  Each msg attached to token deposits should have the following separated by : <br />
                  donation_id, target, campaign_id, event_id, amount_usd ie <br />
                  don_1:general|event|campaign:campaign_1:event_1:0
                </Text> */}
                <Title order={3} className={classes.text} align='center'>Total donations</Title>
                <Center>
                  <Avatar src={tokenDetails?.icon} sx={{ textTransform: "capitalize" }} color="indigo">
                    {tokenDetails?.symbol?.substring(0, 1)}
                  </Avatar>
                </Center>
                <Text className={classes.text} align="center" weight={600}>
                  {data?.token === "any" ? data?.current_usd : getReadableTokenBalance(data?.current, tokenDetails?.decimals)}
                  &nbsp;
                  {data?.token === "any" ? "USD" : tokenDetails?.symbol}
                </Text>
              </Stack>
            </Paper>

            <Paper my="md" radius="lg" px="xs" py="xl">
              <Stack spacing={0}>
                <Title order={3} className={classes.text} align='center'>Progress</Title>
                <Center>
                  <RingProgress
                    thickness={20}
                    roundCaps
                    size={250}
                    label={
                      <Stack spacing={0}>
                        <Text className={classes.text} align='center' size="sm">Target: {data?.target} </Text>
                        <Text className={classes.text} size="xs" align="center" weight={600} color="green">
                          {getCurrentPercentage()} % complete
                        </Text>
                        <Text className={classes.text} align='center' size="sm">
                          {data?.token === "any" ? "USD" : tokenDetails?.symbol}
                        </Text>
                      </Stack>
                    }
                    sections={[
                      { value: getCurrentPercentage(), color: theme.colors.green[7] },
                      { value: 100 - getCurrentPercentage(), color: theme.colors.indigo[7] },
                    ]}
                  />
                </Center>
                <Group position='center'>
                  <Group align="center" spacing={6}>
                    <ColorSwatch color={theme.colors.indigo[7]} radius="md" />
                    <Text size="sm" className={classes.text} >
                      Target - {data?.target} {data?.token === "any" ? "USD" : tokenDetails?.symbol}
                    </Text>
                  </Group>
                  <Group align="center" spacing={6}>
                    <ColorSwatch color={theme.colors.green[7]} radius="md" />
                    <Text size="sm" className={classes.text} >
                      Current - {data?.token === "any" ? data?.current_usd : getReadableTokenBalance(data?.current, tokenDetails?.decimals)} {data?.token === "any" ? "USD" : tokenDetails?.symbol}
                    </Text>
                  </Group>
                </Group>
              </Stack>
            </Paper>

          </Grid.Col>
        </Grid>
        <Paper radius="lg" p="xs" my="xl">
          <Group align="center" position='apart'>
            <Stack spacing={0} mb="md">
              <Title className={classes.subtitle} order={3}>All Donations</Title>
              <Text size="sm" className={classes.text}>
                Donations for this campaign
              </Text>
            </Stack>
            <Stack spacing={0}>
              <Text size="md" className={classes.text} align="end" weight={700}>
                Total: {data?.token === "any" ? data?.current_usd : getReadableTokenBalance(data?.current, tokenDetails?.decimals)} {data?.token === "any" ? "USD" : tokenDetails?.symbol}
              </Text>
              <Text size="xs" className={classes.text} align="end">Approximately: {data?.current_usd} USD </Text>
            </Stack>
          </Group>
          <CampaignDonations category="campaigns" id={cid} />
        </Paper>
        <Paper radius="lg" p="xs" my="xl">
          <Group align="center" position='apart'>
            <Stack spacing={0} mb="md">
              <Title className={classes.subtitle1} order={4}>Campaign extra information</Title>
              <Text size="sm" className={classes.text}>
                Extra infor about the campaign.
              </Text>
            </Stack>
            <Stack spacing={0}>
              <Text size="md" className={classes.text} align="end" weight={700}>
                Total: {data?.token === "any" ? data?.current_usd : getReadableTokenBalance(data?.current, tokenDetails?.decimals)} {data?.token === "any" ? "USD" : tokenDetails?.symbol}
              </Text>
              <Text size="xs" className={classes.text} align="end">Approximately: {data?.current_usd} USD </Text>
            </Stack>
          </Group>
          <Title order={4}>Partners</Title>
          <Text size="sm" className={classes.text}>Who are partners? <span className={classes.dotted}>Read More</span> </Text>
          <ScrollArea>
            <Table>
              <thead>
                <tr>
                  <th style={{ width: "100px" }}>Position</th>
                  <th style={{ minWidth: "200px" }}>Partner</th>
                  <th style={{ minWidth: "200px" }}>Votes</th>
                  {
                    amIaVoter(window.walletConnection?.getAccountId()) ? <th style={{ minWidth: "200px" }}>UpVote</th> : null
                  }

                </tr>
              </thead>
              <tbody>
                {
                  partners?.sort((a: any, b: any) => b?.votes - a?.votes).map((partner: any, i: any) => (
                    <tr key={`_partner_${partner?.name}`}>
                      <td>{i + 1}</td>
                      <td>{partner?.name}</td>
                      <td>{partner?.votes}</td>
                      {
                        amIaVoter(window.walletConnection?.getAccountId()) ? (
                          <td>
                            <Button radius="xl"
                              color="indigo" size='xs'
                              px="xl"
                              onClick={() => voteForPartner(partner?.name)}
                              rightIcon={voting ? <Loader size={16} color="white" /> : null}>
                              Vote
                            </Button>
                          </td>
                        ) : null
                      }

                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </ScrollArea>
          <BecomePartnerModal partners_={partners} method="add_campaign_partner" id={cid} />
        </Paper>
      </Container>
    </>
  )
}

export default SingleCampaign