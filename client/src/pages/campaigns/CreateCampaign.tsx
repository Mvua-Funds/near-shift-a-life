import React, { useMemo } from 'react'
import { Card, Container, Grid, Select, Stack, TextInput, Title, useMantineTheme, Paper, Textarea, Group, Button, LoadingOverlay, Text, ActionIcon, Avatar, Center, Image, FileInput, Box } from '@mantine/core';
import { DatePicker, DateRangePicker } from '@mantine/dates';

import { getTheme } from '../../configs/appfunctions';
import { IconAlertCircle, IconCheck, IconChevronDown, IconSpeakerphone, IconX } from '@tabler/icons';
import { Helmet } from 'react-helmet';
import { SEPARATOR, APP_NAME, NEAR_OBJECT } from '../../configs/appconfig';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { nanoid } from 'nanoid';
import { ShiftALifeFunctionCall } from '../../configs/nearutils';
import SelectTokenModal from '../../components/common/SelectTokenModal';
import { getCauses, connectWallet } from '../../configs/near/utils';
import { useEffect } from 'react';

import { v4 } from 'uuid';
//firebase imports
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';


const CreateCampaign = () => {

  const [loading, setLoading] = useState(false)
  const [causes, setCauses] = useState<null | any>([])
  const [openModal, setOpenModal] = useState(false)
  const [selectedToken, setSelectedToken] = useState(NEAR_OBJECT)

  const [uploading, setUploading] = useState(false)
  const [img, setImg] = useState<any>(null)

  const theme = useMantineTheme()
  const navigate = useNavigate()

  const loadCauses = () => {
    getCauses().then((res: any) => {
      setCauses(res)
    }).catch((err: any) => { })
  }

  const form = useForm({
    initialValues: {
      title: "",
      cause: "",
      description: "",
      target: "",
      token: "",
      start_date: "",
      start_dates: "",
      end_date: "",
      end_dates: "",
      img: "someimgurl"
    },
    validate: {
      title: value => value === "" ? "Title cannot be empty" : null,
      cause: value => value === "" ? "Select the cause of the campaign" : null,
      description: value => value === "" ? "Kindly describe the aim of the campaign" : null,
      target: value => value === "" ? "Target amount needs to be set" : null,
      start_date: value => value === "" ? "Please select starting date of the campaign" : null,
      end_date: value => value === "" ? "Please select ending date" : null,
    }
  })

  const UploadImage = (file: any) => {
    setUploading(true)
    const imageRef = ref(storage, `images/${file['name'] + v4()}`);
    uploadBytes(imageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImg(url)
        setUploading(false)
      })

    })
  };

  const uploadFile = () => {
    UploadImage(form.values['img'])
  }

  const handleSubmit = () => {

    const walletConnection = window.walletConnection
    const account = walletConnection?.getAccountId()

    let start_date: any = form.values["start_date"]
    const s_year = start_date?.getFullYear()
    const s_month = start_date?.getMonth()
    const s_day = start_date?.getDate()

    let end_date: any = form.values["end_date"]
    const e_year = end_date?.getFullYear()
    const e_month = end_date?.getMonth()
    const e_day = end_date?.getDate()

    const id =  nanoid() + Date.now()
    let data = {
      ...form.values,
      start_date: start_date?.toString(),
      start_dates: `${s_year},${s_month},${s_day}`,
      end_date: end_date?.toString(),
      end_dates: `${e_year},${e_month},${e_day}`,
      created_by: account,
      img: img,
      id:id,
      token: selectedToken.address,
    }

    setLoading(true)
    const wallet = window.walletConnection
    const contract = window?.contract
    if(img === null){
      showNotification({
        message: "Select an image",
        color: "red"
      })
      return
    }
    if (contract) {
      ShiftALifeFunctionCall(wallet, {
        methodName: "create_campaign",
        args: data,
        gas: null,
        amount: null
      }).then((res: any) => {
        console.log("Response: ", res)
        showNotification({
          message: "Successfully created a campaign",
          color: "green",
          icon: <IconCheck />
        })
        form.reset()
        setImg(null)
        navigate(`/campaigns/${id}`)
      }).catch((e: any) => {
        console.error("Error: ", e)
        showNotification({
          message: "Campaign creation failed",
          color: "red",
          icon: <IconAlertCircle />
        })
      }).finally(() => {
        setLoading(false)
      })
    }
  }

  const isSignedIn = window?.walletConnection?.isSignedIn()

  useEffect(() => {
    loadCauses()
  }, [])

  const waitChange = useMemo(() => {
    return {
      continue: img ? true : false
    }
  }, [img])
 
  useEffect(() => {
    if (img) {
      handleSubmit()
    }
  }, [waitChange])

  return (
    <>
      <Helmet>
        <title>Create an campaign {SEPARATOR} {APP_NAME}</title>
      </Helmet>
      <SelectTokenModal select={setSelectedToken} open={openModal} closeModal={() => setOpenModal(false)} selectedToken={selectedToken} />
      <Container size="xl" py="lg">
        <Grid>
          <Grid.Col md={6} offsetMd={3}>
            <Paper radius="lg" p="xs" sx={{ position: "relative" }}>
              <LoadingOverlay visible={loading || uploading} />
              <Title weight={500} align="center" mb="md">Create new campaign</Title>
              <form onSubmit={form.onSubmit((values) => uploadFile())}>
                <Stack>
                  <TextInput label="Title" placeholder='Campaign title' radius="md" styles={{
                    input: {
                      // borderColor: getTheme(theme) ? theme.colors.dark[4] : "#242a49",
                      // borderWidth: "2px"
                    }
                  }} {...form.getInputProps('title')} />
                  <Select label="Select cause" placeholder='Cause of the campaign' radius="md" styles={{
                    input: {
                      // borderColor: getTheme(theme) ? theme.colors.dark[4] : "#242a49",
                      // borderWidth: "2px"
                    }
                  }} data={causes.map((cause: any) => ({ value: cause?.title, label: cause?.title }))}
                    {...form.getInputProps('cause')} />
                  <Textarea minRows={5} placeholder="Describe the campaign" label="Description" radius="md" styles={{
                    input: {
                      // borderColor: getTheme(theme) ? theme.colors.dark[4] : "#242a49",
                      // borderWidth: "2px"
                    }
                  }} {...form.getInputProps('description')} />
                  <Grid>
                    <Grid.Col md={6}>
                      <DatePicker
                        label="Pick start date"
                        placeholder="Pick campaign starting date"
                        radius="md"
                        styles={{
                          input: {
                            // borderColor: getTheme(theme) ? theme.colors.dark[4] : "#242a49",
                            // borderWidth: "2px"
                          }
                        }}
                        {...form.getInputProps('start_date')}
                      />
                    </Grid.Col>
                    <Grid.Col md={6}>
                      <DatePicker
                        label="Pick end date"
                        placeholder="Pick campaign ending date"
                        radius="md"
                        styles={{
                          input: {
                            // borderColor: getTheme(theme) ? theme.colors.dark[4] : "#242a49",
                            // borderWidth: "2px"
                          }
                        }}
                        {...form.getInputProps('end_date')}
                      />
                    </Grid.Col>
                  </Grid>

                  <Grid>
                    <Grid.Col md={6}>
                      <Paper radius="md" sx={{
                        background: getTheme(theme) ? theme.colors.dark[5] : theme.colors.gray[1],
                        padding: "4px"
                      }}>
                        <Text size="sm">Select Token</Text>
                        <Group onClick={() => setOpenModal(true)} px="xs" align="center" position='apart' sx={{
                          background: getTheme(theme) ? theme.colors.dark[6] : theme.colors.gray[0],
                          borderRadius: theme.radius.md,
                          cursor: "pointer"
                        }}>
                          <Group>
                            <Avatar src={selectedToken?.icon} color="indigo">
                              {selectedToken?.symbol.substring(0, 1)}
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
                    </Grid.Col>
                    <Grid.Col md={6}>
                      <TextInput label="Target amount" placeholder="Target amount for the campaign" radius="md" styles={{
                        input: {
                          // borderColor: getTheme(theme) ? theme.colors.dark[4] : "#242a49",
                          // borderWidth: "2px"
                        }
                      }} {...form.getInputProps('target')} />
                    </Grid.Col>
                    <Grid.Col>
                      <FileInput accept="image/png,image/jpeg, image/jpg, image/webp" label="Campaing Image" placeholder='Select banner' {...form.getInputProps('img')} />
                    </Grid.Col>
                  </Grid>

                  <Group align="center" position='center'>
                    {
                      !isSignedIn ? <Button radius="xl" px="xl" color="purple" onClick={connectWallet}>Connect wallet</Button>
                        :
                        <Button type='submit' leftIcon={<IconSpeakerphone />} color="purple" radius="xl" px="xl">Create Campaign</Button>
                    }

                  </Group>
                </Stack>
              </form>
              <Box my="xl">
                <Title order={3} align="center" mb="md">Image</Title>
                <Center>
                  {
                    img ? <Image radius="lg" src={img} /> : null
                  }
                </Center>
              </Box>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  )
}

export default CreateCampaign