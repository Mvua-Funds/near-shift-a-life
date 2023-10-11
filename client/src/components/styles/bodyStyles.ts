import { createStyles } from "@mantine/core";
import { getTheme } from '../../configs/appfunctions';


const bodyStyles = createStyles((theme) => ({
    title: {
        color: getTheme(theme) ? theme.white : "#242a49",
        fontSize: 100,
        fontWeight: 400,
        letterSpacing: -2,

        [theme.fn.smallerThan('md')]: {
            fontSize: 70,
        },
    },
    subtitle: {
        color: getTheme(theme) ? theme.white : "#242a49",
        fontSize: 50,
        fontWeight: 400,
        letterSpacing: -2,

        [theme.fn.smallerThan('md')]: {
            fontSize: 30,
        },
    },
    subtitle1: {
        color: getTheme(theme) ? theme.white : "#242a49",
        fontSize: 30,
        fontWeight: 400,
        letterSpacing: -2,

        [theme.fn.smallerThan('md')]: {
            fontSize: 20,
        },
    },
    text: {
        color: getTheme(theme) ? theme.white : "#242a49",
    },
    bold: {
        fontWeight: "bold",
    },
    dotted: {
        borderBottomColor: getTheme(theme) ? theme.colors.dark[3] : "#242a49",
        borderBottomStyle: "dotted",
        borderBottomWidth: "1px",
        cursor: "pointer",
        fontWeight: "bold"
    },
    floatingNumber: {
        position: "absolute",
        bottom: -100,
        right: 0,
        // padding: "20px",
        fontSize: "250px",
        zIndex: 0,
        color: "transparent",
        WebkitTextFillColor: "none",
        WebkitTextStroke: `2px ${getTheme(theme) ? theme.white : "#242a49"}`,
        opacity: 0.3
        
    },
    floatingWord: {
        position: "absolute",
        top: -40,
        right: 0,
        width: "100%",
        height: "200px",
        textAlign: "center",
        fontSize: 150,
        zIndex: 0,
        color: "transparent",
        WebkitTextFillColor: "none",
        WebkitTextStroke: `2px ${getTheme(theme) ? theme.white : "#242a49"}`,
        opacity: 0.3,
        [theme.fn.smallerThan('md')]: {
            fontSize: 100,
            top: 0,
        },
        
    }
}));

export default bodyStyles
