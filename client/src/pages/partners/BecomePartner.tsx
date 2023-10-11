import { Button, Center, Container, FileInput, Grid, Group, Image, LoadingOverlay, Paper, Text, TextInput, Title } from '@mantine/core'
import React from 'react'
import { Helmet } from 'react-helmet';
import { SEPARATOR, APP_NAME } from '../../configs/appconfig';
import { useForm } from '@mantine/form';
import { useState, useEffect } from 'react';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX, IconAlertCircle } from '@tabler/icons';
import { v4 } from 'uuid';
import { useNavigate } from "react-router-dom";


//firebase imports
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { url } from 'inspector';
import { useMemo } from 'react';
import { Stack } from '@mantine/core';
import bodyStyles from '../../components/styles/bodyStyles';
import { getTheme } from '../../configs/appfunctions';


const BecomePartner = () => {
  const [loading, setLoading] = useState(false)

  const [uploading, setUploading] = useState(false)
  const [logo, setLogo] = useState<any>(null)
  const [banner, setBanner] = useState<any>(null)

  const { classes, theme } = bodyStyles()


  //variable to store entire image folder
  // const imageListRef = ref(storage, "images/")

  const UploadImage = (upload_type: string, file: any) => {
    setUploading(true)
    const imageRef = ref(storage, `images/${file['name'] + v4()}`);
    uploadBytes(imageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        if (upload_type === "logo") {
          setLogo(url)
        }
        else if (upload_type === "banner") {
          setBanner(url)
        }
        setUploading(false)
      })

    })
  };

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      website: "",
      logo: null,
      banner: null
    },
    validate: {
      name: value => value === "" || value.length < 5 ? "Enter partner name" : null,
      description: value => value === "" || value.length < 5 ? "Enter description" : null,
      website: value => value === "" || value.length < 5 ? "Enter website url" : null,
      logo: value => value === null ? "Enter logo" : null,
      banner: value => value === null ? "Enter banner image" : null,
    }
  })

  const uploadFiles = () => {
    UploadImage('logo', form.values["logo"])
    UploadImage('banner', form.values["banner"])
  }

  const handleSubmit = () => {

    const wallet = window.walletConnection
    const contract = window.contract
    if (contract) {
      const data = {
        ...form.values,
        logo: logo,
        banner: banner,
        id: form.values["name"],
      }
      setLoading(true)
      contract.register_as_partner(data).then((res: any) => {
        if (res === "success") {
          showNotification({
            message: "Partner successfully registered",
            color: "green",
            icon: <IconCheck />
          })
          form.reset()
          navigate("/partners")
          return
        } else {
          showNotification({
            message: "Partner already exists",
            color: "red",
            icon: <IconX />
          })
        }
      }).catch((e: any) => {
        showNotification({
          message: "Partner registration failed",
          color: "red",
          icon: <IconAlertCircle />
        })
      }).finally(() => {
        setLoading(false)
      })
    }
  }
  //varable to navigate to Partners page
  let navigate = useNavigate();

  const waitChange = useMemo(() => {
    return {
      continue: (logo && banner) ? true : false
    }
  }, [logo, banner])

  useEffect(() => {
    if (logo && banner) {
      handleSubmit()
    }
  }, [waitChange])

  return (
    <>
      <Helmet>
        <title>Register Partner {SEPARATOR} {APP_NAME} </title>
      </Helmet> 
      <Container py="xl" size="lg">
        <Grid>
          {/* <Grid.Col md={6}></Grid.Col> */}
          <Grid.Col md={6} offsetMd={3}>
            <Paper radius="lg" p="xs" py="xl" px="xl" sx={{
              position: "relative",
              borderWidth: "2px",
              borderStyle: "solid",
              borderColor: getTheme(theme) ? theme.colors.dark[5] : theme.colors.gray[5]
            }}>

              <Stack>
                <Title align='center' className={classes.subtitle}>Partner Registration </Title>

                <LoadingOverlay visible={loading || uploading} />
                <form onSubmit={form.onSubmit((values) => uploadFiles())}>
                  <Stack>
                    <TextInput radius="md" label={<Text className={classes.text} size="sm">Partner name</Text>} placeholder='Enter partner name' {...form.getInputProps('name')} />

                    <TextInput radius="md" label={<Text className={classes.text} size="sm">Partner description</Text>} placeholder='Enter description' {...form.getInputProps('description')} />
                    <TextInput radius="md" label={<Text className={classes.text} size="sm">Partner's company website</Text>} placeholder='Enter website link' {...form.getInputProps('website')} />
                    <FileInput radius="md" accept="image/png,image/jpeg, image/jpg, image/svg+xml, image/webp" label={<Text className={classes.text} size="sm">Partner Logo</Text>} placeholder='Select logo' {...form.getInputProps('logo')} />
                    <FileInput radius="md" accept="image/png,image/jpeg, image/jpg, image/webp" label={<Text className={classes.text} size="sm">Partner Banner</Text>} placeholder='Select banner' {...form.getInputProps('banner')} />
                    <Grid>
                      <Grid.Col md={6}>

                        <Center>
                          {
                            logo ? (
                              <Stack spacing={4}>
                                <Title order={3} align="center" className={classes.text}>Logo</Title>
                                <Image radius="lg" src={logo} />
                              </Stack>
                            ) : null
                          }
                        </Center>
                      </Grid.Col>
                      <Grid.Col md={6}>
                        <Center>
                          {
                            banner ? (
                              <Stack spacing={4}>
                                <Title order={3} align="center" className={classes.text}>Banner</Title>
                                <Image radius="lg" src={banner} />
                              </Stack>
                            ) : null
                          }
                        </Center>
                      </Grid.Col>
                    </Grid>
                    <Group position='center'>
                      <Button type='submit' radius="xl" fullWidth size='lg' color="indigo">Register</Button>
                    </Group>
                  </Stack>
                </form>
              </Stack>

            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  )
}

export default BecomePartner