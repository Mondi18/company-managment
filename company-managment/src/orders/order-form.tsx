import { TextField, Checkbox, FormControlLabel, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { props, create } from "@stylexjs/stylex";
import { useState } from "react";
import { WebStyle, Web, Order, WebStatus } from "../data/type";
import Textarea from "@mui/joy/Textarea";
import Button from "@mui/joy/Button";
import { addOrder } from "../firebase";

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
        gap: '1rem',
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
        width: '35rem'
    },
    textArea: {
        width: '400px',
        height: '10rem'
    }
});

const WebStyleOptions = Object.values(WebStyle).filter(value => typeof value === 'string');
const WebOptions = Object.values(Web).filter(value => typeof value === 'string');

export default function OrderForm() {
    const [web, setWeb] = useState<Web | ''>('');
    const [style, setStyle] = useState<WebStyle | ''>('');
    const [pages, setPages] = useState<number | ''>('');
    const [deadline, setDeadline] = useState<Date | ''>('');
    const [price, setPrice] = useState<number | ''>('');
    const [service, setService] = useState<boolean>(false);
    const [notice, setNotice] = useState<string | ''>('');

    const sendOrder = async () => {
        if (!pages || !style || !web || !deadline || !price || !service) {
            return;
        }

        const newOrder: Order = {
            web,
            style,
            pages,
            deadline,
            price,
            service,
            notice,
            status: WebStatus.Processing
        };
        console.log('AA');
        
        try {
            await addOrder(newOrder);
            console.log('Order added successfully!');
            setWeb('');
            setStyle('');
            setPages('');
            setDeadline('');
            setPrice('');
            setService(false);
            setNotice('');
        } catch (error) {
            console.error('Error adding order:', error);
        }
    };

    return (
        <>
            <div>
                <h1 {...props(FormPageStyle.h1)}>Get in Touch</h1>
                <p {...props(FormPageStyle.p)}>
                    We’re here to assist with all your web design needs! If you have any questions, need a quote, or just want to discuss your project,
                    <br />don’t hesitate to reach out. You can email us at contact@webdesigner.com or call us at (123) 456-7890.<br />
                    Our team is available Monday through Friday, from 9 AM to 5 PM, and we strive to respond to all inquiries within 24 hours.
                    <br />Follow us on social media for the latest updates and insights into our work. We look forward to hearing from you!
                </p>
            </div>
            <div {...props(FormPageStyle.inputFields)}>
                <TextField
                    placeholder="Pages"
                    type="number"
                    value={pages}
                    onChange={(e) => setPages(Number(e.target.value))}
                    {...props(FormPageStyle.textField)}
                />
                <FormControlLabel
                    control={<Checkbox checked={service} onChange={(e) => setService(e.target.checked)} />}
                    label="Service"
                />
                <TextField
                    placeholder="Deadline"
                    type="date"
                    value={deadline ? deadline.toISOString().split('T')[0] : ''}
                    onChange={(e) => setDeadline(new Date(e.target.value))}
                    {...props(FormPageStyle.textField)}
                />
                <TextField
                    placeholder="Price ($)"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    {...props(FormPageStyle.textField)}
                />

                <FormControl variant="filled" {...props(FormPageStyle.formControl)}>
                    <InputLabel id="web-style-label">Web Style</InputLabel>
                    <Select
                        labelId="web-style-label"
                        id="web-style-select"
                        value={style}
                        onChange={(e) => setStyle(e.target.value as WebStyle)}
                    >
                        {WebStyleOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl variant="filled" {...props(FormPageStyle.formControl)}>
                    <InputLabel id="web-label">Web</InputLabel>
                    <Select
                        labelId="web-label"
                        id="web-select"
                        value={web}
                        onChange={(e) => setWeb(e.target.value as Web)}
                    >
                        {WebOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Textarea
                    minRows={2}
                    value={notice}
                    placeholder="How can we help you?"
                    color="neutral"
                    onChange={(e) => setNotice(e.target.value)}
                    {...props(FormPageStyle.textArea)}
                />
                <Button size="lg" onClick={sendOrder}>Send</Button>
            </div>
        </>
    );
}
