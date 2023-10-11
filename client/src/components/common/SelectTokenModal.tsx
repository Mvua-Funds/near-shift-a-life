import React, { useState, useEffect } from 'react';

import { Modal, Box, Group, Title, ActionIcon, Divider, TextInput, Paper, Avatar, Stack, Text, ScrollArea, MantineTheme, useMantineTheme, Anchor } from "@mantine/core"


import { IconX } from "@tabler/icons"
import { Carousel } from "@mantine/carousel"
import { NEAR_OBJECT, ANY_TOKEN } from '../../configs/appconfig';
import { getTheme, limitText } from '../../configs/appfunctions';
import { Link } from 'react-router-dom';


interface modalProps {
    select: any,
    open: boolean,
    closeModal: any,
    selectedToken: any
}

const SelectTokenModal = (props: modalProps) => {

    const { select, open, closeModal, selectedToken } = props

    const [tokens, setTokens] = useState([])

    const [searchedToken, setSearchedToken] = useState("")

    const theme = useMantineTheme()

    const getTokens = () => {
        const wallet = window.walletConnection
        const contract = window.contract
        if (wallet) {
            // ShiftALifeFunctionCall(wallet, {
            //     methodName: "get_tokens",
            //     args: {},
            //     gas: null,
            //     amount: null
            // })
            contract.get_tokens().then((res: any) => {
                setTokens(res)
            }).catch((err: any) => {
                console.log("Fetching tokens error", err)
            })
        }
    }


    const filterTokens = () => {
        const filteredTokens = tokens?.filter((token: any) => {
            const regex = new RegExp(searchedToken, 'gi');
            return token.symbol.match(regex) || token.name.match(regex) || token.address.match(regex)
        })
        return filteredTokens
    }

    const selectSingle = (token: any) => {
        select(token);
        closeModal && closeModal();
    }

    useEffect(() => {
        getTokens()
    }, [])

    return (
        <Modal overflow='inside' lockScroll
            opened={open}
            // title={<Title order={2}>Select Token</Title>} 
            withCloseButton={false}
            onClose={() => closeModal && closeModal(false)}
            padding={0}
            overlayBlur={2}
            overlayOpacity={0.3}
            radius="lg" sx={theme => (
                {
                    ".custom-h": {
                        height: "60px",
                    },
                    ".custom-body": {
                        height: "calc(100%)",
                        overflow: "hidden !important",
                    }
                })} styles={{
                    modal: {
                        height: "100vh",
                        overflow: "hidden",
                        background: getTheme(theme) ? theme.colors.dark[9] : "#d3d6e9"
                    },
                    inner: {
                        paddingTop: "0",
                        paddingBottom: "0",
                    },
                    body: {
                        height: "calc(100% - 8px) !important",
                        maxHeight: "calc(100% - 8px) !important",
                        overflow: "hidden"
                    }
                }}>
            <Box className='custom-h' p="md">
                <Group position='apart'>
                    <Title order={2}>Select Token</Title>
                    <ActionIcon onClick={() => closeModal && closeModal(false)}>
                        <IconX />
                    </ActionIcon>
                </Group>
            </Box>
            <Divider />
            <Box className='custom-body' py="xs">
                <Box px="md" py="md" style={{ height: "150px", background: getTheme(theme) ? theme.colors.dark[5] : theme.colors.gray[5] }}>
                    <TextInput value={searchedToken} onChange={e => setSearchedToken(e.target.value)}
                        size='sm' radius="xl"
                        placeholder="Search name, symbol or paste address"
                        className='w-100' mb="md"
                        styles={{
                            input: {
                                // borderStyle: "dashed",
                                borderWidth: "2px !important",
                                outlineOffset: "3px",
                                ":focus-visible": {
                                    outline: `4px solid ${theme.colors.indigo[6]}`,
                                }
                            }
                        }} />
                    <Title order={5} mb="xs" weight={400}>Common tokens</Title>
                    <Carousel slideGap={10} align="start">
                        <Carousel.Slide size={120}>
                            <SelectAssetBtn asset={ANY_TOKEN} select={selectSingle} selectedToken={selectedToken} />
                        </Carousel.Slide>
                        <Carousel.Slide size={120}>
                            <SelectAssetBtn asset={NEAR_OBJECT} select={selectSingle} selectedToken={selectedToken} />
                        </Carousel.Slide>
                        {
                            tokens?.slice(0, 3).map((item, i) => (
                                <Carousel.Slide key={`t_token_s_${i}`} size={120}>
                                    <SelectAssetBtn asset={item} select={selectSingle} selectedToken={selectedToken} />
                                </Carousel.Slide>
                            ))
                        }
                    </Carousel>
                </Box>
                <ScrollArea style={{ height: "calc(100% - 200px)" }} py="xs">
                    <Paper sx={{ background: "transparent" }}>
                        {
                            filterTokens()?.map((item, i) => (
                                <>
                                    <SelectAsset key={`dffd_${i}`} asset={item} select={selectSingle} selectedToken={selectedToken} />
                                    <Divider />
                                </>
                            ))
                        }
                    </Paper>
                    <Group align="center" px="md" my="md">
                        <Text size="sm">Can't locate your token of choice?</Text>
                        <Anchor component={Link} to="/import">
                            <Text size="xs">Import</Text>
                        </Anchor>
                    </Group>
                </ScrollArea>
            </Box>
        </Modal>
    )
}


const SelectAsset = (props: any) => {
    const { asset, select, selectedToken } = props

    return (
        <Paper px="md" sx={theme => ({
            paddingTop: "4px",
            paddingBottom: "4px",
            background: selectedToken?.address === asset?.address ? getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[1] : "transparent",
            cursor: "pointer",
            pointerEvents: selectedToken?.address === asset?.address ? "none" : "all",
            ":hover": {
                background: getTheme(theme) ? theme.colors.dark[4] : theme.colors.gray[1]
            }
        })} onClick={e => select(asset)}>
            <Group>
                <Avatar size="sm" src={asset?.icon} />
                <Stack spacing={-10}>
                    {/* <Title order={6} size="xs">{NEAR_OBJECT.symbol}</Title> */}
                    <Text size="sm"><b>${asset?.symbol}</b></Text>
                    <Text size="xs">{asset?.name}</Text>
                </Stack>
            </Group>
        </Paper>
    )
}

const SelectAssetBtn = (props: any) => {
    const { asset, select, selectedToken } = props

    return (
        <Paper sx={theme => ({
            background: selectedToken?.address === asset?.address ? getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[1] : "transparent",
            borderStyle: "solid",
            borderWidth: "1px",
            borderRadius: "10px",
            borderColor: getTheme(theme) ? theme.colors.dark[4] : theme.colors.gray[4],
            pointerEvents: selectedToken?.address === asset?.address ? "none" : "all",
            padding: "4px 6px",
            cursor: "pointer"
        })} onClick={e => select(asset)}>
            <Group>
                <Avatar size="sm" src={asset?.icon} sx={{ textTransform: "capitalize" }}>
                    {asset?.symbol.substring(0, 1)}
                </Avatar>
                <Text size="sm">{limitText(asset?.symbol, 4)}</Text>
            </Group>
        </Paper>
    )
}

export default SelectTokenModal
