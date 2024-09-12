import { TextField, Checkbox, FormControlLabel, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { props, create } from "@stylexjs/stylex";
import { useState } from "react";
import { WebStyle, Web, Order, WebStatus } from "../data/type";
import Textarea from "@mui/joy/Textarea";
import Button from "@mui/joy/Button";
import { addOrder } from "../firebase";
import { useAuth } from "../auth/use-auth";
import { useNavigate } from "react-router-dom";

const FormPageStyle = create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '2rem',
        backgroundColor: '#cfe6e8',
    },
    card: {
        backgroundColor: '#6e6e6e',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
        width: '100%',
        maxWidth: '1000px',
        textAlign: 'center',
    },
    h2: {
        fontSize: '2rem',
        color: '#fff', // White text color for heading
        marginBottom: '2rem',
    },
    p: {
        fontSize: '1rem',
        color: '#fff',
        textAlign: 'center',
        marginTop: '1rem',
        marginBottom: '1rem',
    },
    inputFields: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'white',
        gap: '1rem',
    },
    formControl: {
        width: '100%',
        maxWidth: '300px',
        marginBottom: '1rem',
        background: 'white'
    },
    textField: {
        width: '100%',
        maxWidth: '300px',
        padding: '1rem',
        borderRadius: '5px',
        backgroundColor: '#fff',
        border: 'none',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    button: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '600px',
        padding: '1rem',
        marginTop: '2rem',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '5px',
        cursor: 'pointer',
        textTransform: 'uppercase',
        border: 'none',
        transition: 'background-color 0.3s ease',
        ':hover': {
            backgroundColor: '#0056b3',
        },
    },
    textArea: {
        width: '100%',
        maxWidth: '300px',
        height: '10rem',
        backgroundColor: '#fff',
        padding: '1rem',
        borderRadius: '5px',
        border: 'none',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    }
});

const WebStyleOptions = Object.values(WebStyle).filter(value => typeof value === 'string');
const WebOptions = Object.values(Web).filter(value => typeof value === 'string');

export default function OrderForm() {
    const [web, setWeb] = useState<Web | ''>('');
    const [style, setStyle] = useState<WebStyle | ''>('');
    const [pages, setPages] = useState<number>(0);
    const [deadline, setDeadline] = useState<Date | ''>('');
    const [price, setPrice] = useState<number | ''>('');
    const [service, setService] = useState<boolean>(false);
    const [notice, setNotice] = useState<string | ''>('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const sendOrder = async () => {
        if (!style || !web || !user) {
            return;
        }

        const newOrder: Order = {
            web,
            style,
            pages: pages || 0,
            deadline: deadline || new Date(),
            price: price || 0,
            service: service || false,
            notice: notice || '',
            status: WebStatus.Processing,
            userId: ""
        };

        try {
            await addOrder(newOrder, user.uid);
            console.log('Order added successfully!');
            setWeb('');
            setStyle('');
            setPages(0);
            setDeadline('');
            setPrice('');
            setService(false);
            setNotice('');
            navigate("/home")
        } catch (error) {
            console.error('Error adding order:', error);
        }
    };

    return (
        <div {...props(FormPageStyle.container)}>
            <div {...props(FormPageStyle.card)}>
                <div>
                    <h2 {...props(FormPageStyle.h2)}>Get in Touch</h2>
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
            </div>
        </div>
    );
}