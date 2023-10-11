import React, { useState, useEffect } from 'react'
import { Button, Group, Modal, Paper, Stack, Text, Title, useMantineTheme } from '@mantine/core'
import { getTheme } from '../../configs/appfunctions';
import { ShiftALifeViewFunctionCall } from '../../configs/nearutils'
import bodyStyles from '../styles/bodyStyles';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX, IconAlertCircle } from '@tabler/icons';
import { Loader } from '@mantine/core';

const BecomePartnerModal = (props: any) => {

    const { partners_, method, id } = props

    const [partners, setPartners] = useState<null | any>([])
    const [modalOpen, setModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const { theme, classes } = bodyStyles()

    const loadUserPartners = () => {
        const wallet = window.walletConnection
        if (wallet) {
            const account = wallet.getAccountId()
            ShiftALifeViewFunctionCall(wallet, {
                methodName: "get_account_partners",
                args: { account_id: account }
            }).then((res: any) => {
                setPartners(res)
            }).catch((e: any) => {
                console.error("Error: ", e)
            })
        }
    }

    const registerPartner = (partner: string) => {
        // add_campaign_partner
        const contract = window.contract
        if (contract) {
            setLoading(true)
            contract[method]({ id: id, partner: partner }).then((res: any) => {
                if (res === "done") {
                    showNotification({
                        message: "Successfully registered the partner",
                        color: "green",
                        icon: <IconCheck />
                    })
                    return;
                }
                else {
                    showNotification({
                        message: "Something went wrong",
                        color: "red",
                        icon: <IconX />
                    })
                }
            }).catch((e: any) => {
                showNotification({
                    message: "Something went wrong",
                    color: "red",
                    icon: <IconAlertCircle />
                })
            }).finally(() => {
                setLoading(false)
            })

        }
    }

    const checkIfExists = (name: string) => {
        return partners_?.some((x: any) => x.name === name);
    }

    useEffect(() => {
        loadUserPartners()
    }, [])
    return (
        <>
            <Button radius="xl" color="indigo" my="xl" onClick={() => setModalOpen(true)}>Become partner</Button>
            <Modal radius="lg" title="Register as a partner" opened={modalOpen} onClose={() => setModalOpen(false)}
                styles={{
                    modal: {
                        background: getTheme(theme) ? theme.colors.dark[9] : "#d3d6e9"
                    }
                }}
                overlayBlur={2}
                overlayOpacity={0.3} overflow="inside">
                <Text size="sm" className={classes.text}>
                    When become a partner you get a chance to be voted and if you become the top most partner,
                    you get a chance to effect this project. This means you are going to run the project as per the
                    project aim and description.
                </Text>

                <Stack spacing={4} my="xl">
                    {
                        partners.map((partner: any, i: any) => (
                            <Paper key={`partner_${i}`} radius="md" p="md" sx={{
                                background: getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[0]
                            }}>
                                <Group align="center" position="apart">
                                    <Title order={4} weight={400} className={classes.text}>{partner?.name}</Title>
                                    <Button size='sm' radius="xl"
                                        color="indigo"
                                        onClick={() => registerPartner(partner?.id)}
                                        rightIcon={loading ? <Loader size={16} color="white" /> : null}
                                        disabled={checkIfExists(partner?.name)}>
                                        {
                                            checkIfExists(partner?.name) ? "Aready registered" : "Register"
                                        }
                                    </Button>
                                </Group>
                            </Paper>
                        ))
                    }
                </Stack>

            </Modal>
        </>
    )
}

export default BecomePartnerModal