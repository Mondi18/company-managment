import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Grid, Box } from "@mui/material";
import { props, create } from "@stylexjs/stylex";
import { useState } from "react";
import { WebStyle } from "../data/type";
import { Web } from "../data/type";

const FormPageStyle = create({
    h1: {
        display: 'flex',
        justifyContent: 'center',
        fontSize: '3rem',
        marginTop: '5rem'
    },
    p: {
        display: 'flex',
        justifyContent: 'center',
        fontSize: '1.5rem',
        textAlignLast: 'justify',
        marginTop: '5rem'
    },
    inputFields: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
    },
    formControl: {
        width: '200px'
    },
    textField: {
        width: '200px',
    },
    button: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '5rem',
        textAlign: 'center',
        width:'35rem'
    }
});

export default function OrderForm() {
    const [type, setType] = useState<WebStyle | ''>('');
    const [web, setWeb] = useState<Web | ''>('');

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <h1 {...props(FormPageStyle.h1)}>Get in Touch</h1>
            <p {...props(FormPageStyle.p)}>
                We’re here to assist with all your web design needs! If you have any questions, need a quote, or just want to discuss your project,
                <br />don’t hesitate to reach out. You can email us at contact@webdesigner.com or call us at (123) 456-7890.<br />
                Our team is available Monday through Friday, from 9 AM to 5 PM, and we strive to respond to all inquiries within 24 hours.
                <br />Follow us on social media for the latest updates and insights into our work. We look forward to hearing from you!
            </p>
            <Box width="100%" maxWidth="600px"> 
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="first-name"
                            label="What can we help you?"
                            variant="filled"
                            {...props(FormPageStyle.textField)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="full-name"
                            label="Full Name"
                            variant="filled"
                            {...props(FormPageStyle.textField)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="email"
                            label="Email"
                            variant="filled"
                            {...props(FormPageStyle.textField)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="phone-number"
                            label="Phone Number"
                            variant="filled"
                            {...props(FormPageStyle.textField)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl variant="filled" {...props(FormPageStyle.formControl)}>
                            <InputLabel id="type-type-label">Type</InputLabel>
                            <Select
                                labelId="type-type-label"
                                id="type-type-select"
                                value={type}
                                onChange={(event) => setType(event.target.value as WebStyle)}
                            >
                                {Object.values(WebStyle).filter(value => typeof value === 'string').map((value) => (
                                    <MenuItem key={value} value={value}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl variant="filled" {...props(FormPageStyle.formControl)}>
                            <InputLabel id="web-type-label">Web Type</InputLabel>
                            <Select
                                labelId="web-type-label"
                                id="web-type-select"
                                value={web}
                                onChange={(event) => setWeb(event.target.value as Web)}
                            >
                                {Object.values(Web).filter(value => typeof value === 'string').map((value) => (
                                    <MenuItem key={value} value={value}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                
                <Box  {...props(FormPageStyle.button)}>
                    <Button variant="contained">Send</Button>
                </Box>
                
            </Box>
        </Box>
    );
}
