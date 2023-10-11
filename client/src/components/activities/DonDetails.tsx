import { Grid, Text } from "@mantine/core"
import bodyStyles from "../styles/bodyStyles"


const DonDetails = (props: any) => {
  const { label, value } = props
  const { classes } = bodyStyles()
  return (
    <Grid>
      <Grid.Col span={4}>
        <Text className={classes.text} weight={600}>{label}</Text>
      </Grid.Col>
      <Grid.Col span={8}>
        <Text className={classes.text}>{value}</Text>
      </Grid.Col>
    </Grid>
  )
}

export default DonDetails