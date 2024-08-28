import { create, props } from '@stylexjs/stylex';
import { Typography, Container, Grid, Paper, IconButton, ImageList, ImageListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper as MuiPaper, Modal, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { useState } from 'react';


const styles = create({
    home: {
        padding: '2rem 0',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#cfe6e8 !important'
    },
    paper: {
        padding: '2rem',
        marginBottom: '2rem',
        backgroundColor: 'gray !important',
        color: 'white !important',
        borderRadius: '2rem !important'
    },
    iconButton: {
        fontSize: '5rem',
        cursor: 'pointer',
        color: 'white',
        backgroundColor: 'blue'
    },
    imageList: {
        width: '100%',
        height: 'auto',
    },
    imageListItem: {
        borderRadius: '1rem',
    },
    modalImage: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
    },
    modalBox: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)',
        padding: '24px',
        width: '80%',
        maxWidth: '1000px',
        height: '80%',
        maxHeight: '500px',
        overflow: 'auto',
    },
    tableContainer: {
        marginTop: '2rem',
        marginBottom: '2rem',
    },
    tableHead: {
        backgroundColor: '#f5f5f5',
    },
    tableRow: {

        backgroundColor: '#f9f9f9',
    },
}
);

const Home = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const handleOpenModal = (imageSrc: string) => {
        setSelectedImage(imageSrc);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedImage('');
        setOpenModal(false);
    };
    const navigate = useNavigate();
    const itemData = [
        {
            img: '/FinishedWorksPictures/webshop-project-home.png',
            title: 'Webshop Project Home Page'
        },
        {
            img: '/FinishedWorksPictures/webshop-project-login.png',
            title: 'Webshop Project Login Page'
        },
        {
            img: '/FinishedWorksPictures/webshop-project-cart.png',
            title: 'Webshop Project Cart Page'
        },
        {
            img: '/FinishedWorksPictures/webshop-project-admin-notice.png',
            title: 'Webshop Project Admin Notice Page'
        },
        {
            img: '/FinishedWorksPictures/webshop-project-admin-addproduct.png',
            title: 'Webshop Project Admin Add Product Page'
        },
    ]

    const priceList = [
        { service: 'Basic Web Development', price: '$500' },
        { service: 'E-commerce Solutions', price: '$800' },
        { service: 'Responsive Web Design', price: '$600' },
        { service: 'Mobile App Development', price: '$1000' },
        { service: 'Webshop Development', price: '$750' },
        { service: 'Service Development', price: '$900' },
    ];

    return (
        <div {...props(styles.home)}>
            <Container>
                <Paper {...props(styles.paper)} elevation={3}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Typography variant="h3" gutterBottom>
                        Welcome to Company Management!
                    </Typography>
                    <Typography variant="h6">
                        Manage Your Digital Vision to Life
                    </Typography>
                </Paper>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper {...props(styles.paper)} elevation={3}>
                            <Typography variant="h3" gutterBottom>
                                Our Services
                            </Typography>
                            <Typography component="ul" variant="h6">
                                <li>Custom Web Application Development</li>
                                <li>E-commerce Solutions</li>
                                <li>Responsive Web Design</li>
                                <li>Mobile App Development</li>
                                <li>Webshop Development</li>
                                <li>Service Development</li>
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper {...props(styles.paper)} elevation={3}>
                            <Typography variant="h3" gutterBottom>
                                About Us
                            </Typography>
                            <Typography variant="h6">
                                Company Managment is a team of passionate professionals
                                dedicated to creating unique digital solutions using
                                cutting-edge technologies.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
                <Paper {...props(styles.paper)} elevation={3}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Typography variant="h3" >
                        Our Works
                    </Typography>
                    <Typography variant="h6">
                        <a href="https://github.com/Sati94/AboutPets"
                            style={{ textDecoration: 'none', color: 'white' }}
                        >About Pets</a>
                    </Typography>

                    <ImageList variant="masonry" cols={3} gap={8} sx={styles.imageList}>
                        {itemData.map((item) => (
                            <ImageListItem key={item.img} sx={styles.imageListItem}>
                                <img
                                    src={`${item.img}?w=248&fit=crop&auto=format`}
                                    srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    alt={item.title}
                                    loading="lazy"
                                    onClick={() => handleOpenModal(item.img)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Paper>
                <Paper {...props(styles.paper)} elevation={3}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Typography variant="h3" gutterBottom>
                        Pricing
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                        The prices are informative, please contact us!
                    </Typography>

                    <TableContainer component={MuiPaper} sx={styles.tableContainer}>
                        <Table>
                            <TableHead>
                                <TableRow sx={styles.tableHead}>
                                    <TableCell><Typography variant="h6">Service</Typography></TableCell>
                                    <TableCell align="right"><Typography variant="h6">Price</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {priceList.map((row) => (
                                    <TableRow key={row.service} sx={styles.tableRow}>
                                        <TableCell>{row.service}</TableCell>
                                        <TableCell align="right">{row.price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                <Paper {...props(styles.paper)} elevation={3}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Typography variant="h4" gutterBottom>
                        Ready to Collaborate?
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                        If you want to place an order, first register on the site!
                    </Typography>
                    <IconButton

                        onClick={() => navigate('/login')}
                        sx={{
                            ...styles.iconButton,
                            backgroundColor: 'white',
                            '&:hover': {
                                backgroundColor: 'darkgray',
                                color: 'white'
                            },
                            marginBottom: '1rem',

                        }}
                    >
                        <ContactPageIcon sx={{
                            fontSize: 50,
                            color: '#1976d2'
                        }} />
                    </IconButton>
                    <Typography variant="h5">
                        Get in Touch
                    </Typography>
                    <Typography variant="h5">
                        Send our team an email:
                    </Typography>
                    <Typography variant="h5">
                        companymanagment@gmail.com
                    </Typography>
                </Paper>

                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box {...props(styles.modalBox)}>
                        <img src={selectedImage} alt="Enlarged view" {...props(styles.modalImage)} />
                    </Box>
                </Modal>

            </Container>

        </div>
    );
}

export default Home;