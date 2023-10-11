import React, { useEffect, useState, useMemo } from 'react'
import { Card, Container, Grid, Select, Stack, TextInput, Title, useMantineTheme, Paper, Textarea, Group, Button, LoadingOverlay, Avatar, Text, ActionIcon, Image, FileInput, Box, Center } from '@mantine/core';
import { DatePicker } from '@mantine/dates';

import { getTheme } from '../../configs/appfunctions';
import { IconAlertCircle, IconCalendarEvent, IconCheck, IconChevronDown, IconX } from '@tabler/icons';
import { SEPARATOR, APP_NAME, NEAR_OBJECT } from '../../configs/appconfig';
import { Helmet } from 'react-helmet';
import { useForm } from "@mantine/form"
import { nanoid } from "nanoid"
import { ShiftALifeFunctionCall } from '../../configs/nearutils';
import { showNotification } from '@mantine/notifications';
import SelectTokenModal from '../../components/common/SelectTokenModal';
import { connectWallet, getCauses } from '../../configs/near/utils';

import { v4 } from 'uuid';
//firebase imports
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Navigate, useNavigate } from 'react-router-dom';


const CreateEvent = () => {

  const [loading, setLoading] = useState(false)
  const [causes, setCauses] = useState<null | any>([])
  const [openModal, setOpenModal] = useState(false)
  const [selectedToken, setSelectedToken] = useState(NEAR_OBJECT)
  // const [openModal, setOpenModal] = useState(false)

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
      date: null,
      venue: "",
      event_type: "",
      channel: null,
      channel_url: null,
      token: "",
      target: "",
      img: "",
    },
    validate: {
      title: value => value === "" ? "Title cannot be empty" : null,
      description: value => value === "" ? "Description cannot be empty" : null,
      cause: value => value === "" ? "Cause cannot be empty" : null,
      date: value => value === null ? "Please select date" : null,
      target: value => value === "" ? "Target amount for the event not set" : null,
      venue: value => value === "" ? "Enter event venue" : null,
    }
  })

  const UploadImage = (file: any) => {
    setUploading(true)
    const imageRef = ref(storage, `images/${file['name'] + v4()}`);
    uploadBytes(imageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log("image")
        setImg(url)
        setUploading(false)
      })

    })
  };

  const handleSubmit = () => {

    const walletConnection = window.walletConnection
    const account = walletConnection?.getAccountId()

    let date: any = form.values["date"]
    const year = date?.getFullYear()
    const month = date?.getMonth()
    const day = date?.getDate()

    const id = nanoid() + Date.now();
    let data = {
      ...form.values,
      date: date?.toString(),
      dates: `${year},${month},${day}`,
      created_by: account,
      img: img,
      id: id,
      token: selectedToken.address,
    }
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
      setLoading(true)
      ShiftALifeFunctionCall(wallet, {
        methodName: "create_event",
        args: data,
        gas: null,
        amount: null
      }).then((res: any) => {
        console.log("Response: ", res)
        showNotification({
          message: "Successfully created an event",
          color: "green",
          icon: <IconCheck />
        })
        form.reset()
        navigate(`/events/${id}`)
      }).catch((e: any) => {
        console.error("Error: ", e)
        showNotification({
          message: "Event creation failed",
          color: "red",
          icon: <IconAlertCircle />
        })
      }).finally(() => {
        setLoading(false)
      })
    }
  }

  const uploadFile = () => {
    UploadImage(form.values['img'])
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
        <title>Create an event {SEPARATOR} {APP_NAME}</title>
      </Helmet>
      <SelectTokenModal select={setSelectedToken} open={openModal} closeModal={() => setOpenModal(false)} selectedToken={selectedToken} />
      <Container size="xl" py="lg">
        <Grid>
          <Grid.Col md={6} offsetMd={3}>
            <Paper radius="lg" p="xs" sx={{ position: "relative" }}>
              <LoadingOverlay visible={loading || uploading} />
              <Title weight={500} align="center" mb="md">Create new event</Title>
              <form onSubmit={form.onSubmit((values) => uploadFile())}>
                <Stack>
                  <TextInput label="Title" placeholder='Event title' radius="md" styles={{
                    input: {
                      // borderColor: getTheme(theme) ? theme.colors.dark[4] : "#242a49",
                      // borderWidth: "2px"
                    }
                  }} {...form.getInputProps('title')} />
                  <Select label="Select cause" placeholder='Cause of the event' radius="md" styles={{
                    input: {
                      // borderColor: getTheme(theme) ? theme.colors.dark[4] : "#242a49",
                      // borderWidth: "2px"
                    }
                  }} data={causes.map((cause: any) => ({ value: cause?.title, label: cause?.title }))}
                    {...form.getInputProps('cause')} />
                  <Textarea minRows={5} placeholder="Describe the event" label="Description" radius="md" styles={{
                    input: {
                      // borderColor: getTheme(theme) ? theme.colors.dark[4] : "#242a49",
                      // borderWidth: "2px"
                    }
                  }} {...form.getInputProps('description')} />
                  <Grid>
                    <Grid.Col md={6}>
                      <DatePicker
                        label="Pick date"
                        placeholder="Pick event date"
                        radius="md"
                        styles={{
                          input: {
                            // borderColor: getTheme(theme) ? theme.colors.dark[4] : "#242a49",
                            // borderWidth: "2px"
                          }
                        }}
                        {...form.getInputProps('date')}
                      />
                    </Grid.Col>
                    <Grid.Col md={6}>
                      <TextInput label="Venue" placeholder='Event venue' radius="md" styles={{
                        input: {
                          // borderColor: getTheme(theme) ? theme.colors.dark[4] : "#242a49",
                          // borderWidth: "2px"
                        }
                      }} {...form.getInputProps('venue')} />
                    </Grid.Col>
                    <Grid.Col md={4}>
                      <Select label="Event type" placeholder='Event type' radius="md" styles={{
                        input: {
                          // borderColor: getTheme(theme) ? theme.colors.dark[4] : "#242a49",
                          // borderWidth: "2px"
                        }
                      }} data={[
                        { value: "online", label: "Online" },
                        { value: "physical", label: "Physical" },
                      ]} {...form.getInputProps('event_type')} />
                    </Grid.Col>
                    <Grid.Col md={4}>
                      <Select label="Channel" placeholder='Online channel' radius="md" styles={{
                        input: {
                          // borderColor: getTheme(theme) ? theme.colors.dark[4] : "#242a49",
                          // borderWidth: "2px"
                        }
                      }} data={[
                        { value: "facebook", label: "Facebook" },
                        { value: "twitter", label: "Twitter" },
                        { value: "google", label: "Google meet" },
                      ]} {...form.getInputProps('channel')} />
                    </Grid.Col>
                    <Grid.Col md={4}>
                      <TextInput label="Channel link" placeholder="Enter link here" radius="md" styles={{
                        input: {
                          // borderColor: getTheme(theme) ? theme.colors.dark[4] : "#242a49",
                          // borderWidth: "2px"
                        }
                      }} {...form.getInputProps('channel_url')} />
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
                      <TextInput label="Target amount" placeholder="Target amount for the event" radius="md" styles={{
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
                        <Button type='submit' leftIcon={<IconCalendarEvent />} color="purple" radius="xl" px="xl">Create Event</Button>
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

export default CreateEvent