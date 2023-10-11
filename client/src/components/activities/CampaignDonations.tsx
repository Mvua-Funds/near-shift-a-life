import React, { useEffect, useState } from 'react'
import { ScrollArea, Table, Group, Avatar, Stack, Text, Pagination, Center } from '@mantine/core'
import { useParams } from 'react-router-dom';
import { convertTimestamp, getReadableTokenBalance, ShiftALifeViewFunctionCall } from '../../configs/nearutils';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { NEAR_OBJECT } from '../../configs/appconfig';

const CampaignDonations = (props: any) => {

    const { category, id } = props

    const [donations, setDonations] = useState<null | any>([])
    const [count, setCount] = useState(0)
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)

    const no_of_pages = Math.ceil(count / limit)

    const loadDonations = () => {
        const wallet = window.walletConnection
        if (wallet) {
            const method = category === "campaigns" ? "get_campaign_donations" : "get_event_donations"
            ShiftALifeViewFunctionCall(wallet, {
                methodName: method,
                args: { id: id, page: page, limit: limit }
            }).then((res: any) => {
                const donations_ = donations
                const results: any = res?.results
                const merged = donations_.concat(results).filter((obj: any, index: any, self: any) =>
                    index === self.findIndex((obj2: any) => (
                        obj?.donation?.id === obj2?.donation?.id
                    ))
                );
                setDonations(merged)
                setCount(res?.count)

            }).catch((e: any) => {
                console.error("Error: ", e)
            })
        }
    }

    useEffect(() => {
        loadDonations()
    }, [page])
    return (
        <div>
            <Group position='right'>
                <Pagination total={no_of_pages} page={page} onChange={page => setPage(page)} />
            </Group>
            <ScrollArea my="xl">
                <Table verticalSpacing={16} fontSize="sm" striped>
                    <thead>
                        <tr>
                            <th className='custom-th'>Donor</th>
                            <th className='custom-th'>Token</th>
                            <th className='custom-th'>Amount</th>
                            <th className='custom-th'>Amount USD</th>
                            <th className='custom-th'>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            donations.map((don: any, i: any) => (
                                <tr key={`donation_${don?.donation?.id}`}>
                                    <td>{don?.donation?.donor}</td>
                                    <td>
                                        {
                                            don?.donation?.token === "near" ? (
                                                <Group>
                                                    <Avatar src={NEAR_OBJECT.icon} size="sm" />
                                                    <Stack spacing={-2}>
                                                        <Text size="sm" weight={600}>Near</Text>
                                                        <Text size="xs">Near</Text>
                                                    </Stack>
                                                </Group>
                                            ) : (
                                                <Group>
                                                    <Avatar src={don?.tokenmetadata?.icon} size="sm" />
                                                    <Stack spacing={-2}>
                                                        <Text size="sm" weight={600}>{don?.tokenmetadata?.name}</Text>
                                                        <Text size="xs">{don?.tokenmetadata?.symbol}</Text>
                                                    </Stack>
                                                </Group>
                                            )
                                        }
                                    </td>
                                    <td>
                                        {
                                            don.donation.token === "near" ? getReadableTokenBalance(don?.donation?.amount, 24) : getReadableTokenBalance(don?.donation?.amount, don?.tokenmetadata?.decimals)
                                        }
                                    </td>
                                    <td>
                                        <Group position='apart'>
                                            <Text size="sm">$</Text>
                                            <Text size="sm">{don.donation.amount_usd}</Text>
                                        </Group>
                                    </td>
                                    <td>{convertTimestamp(don.donation.created_at)}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </ScrollArea>
            <Group position='right'>
                <Pagination total={no_of_pages} page={page} onChange={page => setPage(page)} />
            </Group>
        </div>
    )
}

export default CampaignDonations