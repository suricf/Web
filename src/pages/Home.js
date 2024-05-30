import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, FormControl, IconButton, InputLabel, List, ListItem, ListItemIcon, ListItemText, MenuItem, Select, Toolbar, Typography, Collapse, Avatar } from '@mui/material'; // Thêm Collapse vào import
import React, { Component } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import launchViewer, { getSelection } from './Viewer/ViewerFunctions';
import ExpandLess from '@mui/icons-material/ExpandLess'; // Thêm ExpandLess vào import
import ExpandMore from '@mui/icons-material/ExpandMore'; // Thêm ExpandMore vào import

// Import các icon cần thiết
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MessageIcon from '@mui/icons-material/Message';
import MapIcon from '@mui/icons-material/Map';
import ArchiveIcon from '@mui/icons-material/Archive';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            drawerOpen: false, // State để kiểm soát Drawer
            doorFinish: "Satin",
            collections: [],
            selectedCollection: '',
            documents: [],
            collectionDetails: {}, // To store the linkanh and urn for each collection
            selectedCarouselIndex: 0, // Track the index of the selected item in the carousel
            showCarousel: true, // State to control the visibility of the carousel
            openProject: false, // State to control the visibility of project list
            selectedItem: null
        };
    }

    componentDidMount() {
        this.fetchCollections();
        fetch('https://revitmongo.onrender.com/zz')
            .then(response => response.json())
            .then(data => {
                if (data.collections) {
                    const collections = data.collections;
                    this.setState({ collections }, () => {
                        this.fetchDocumentsInCollection(collections[0]);

                    });
                } else {
                    console.error('Error: collections data not found in response:', data);
                }
            })
            .catch(error => console.error('Error fetching collections:', error));
    }
    fetchCollections = () => {
        fetch('https://revitmongo.onrender.com/zz')
            .then(response => response.json())
            .then(data => {
                if (data.collections) {
                    const collections = data.collections;
                    this.setState({ collections }, () => {
                        if (collections.length > 0) {
                            this.fetchFirstDocumentDetails(collections[0]);
                        }
                    });
                } else {
                    console.error('Error: collections data not found in response:', data);
                }
            })
            .catch(error => console.error('Error fetching collections:', error));
    }
    fetchFirstDocumentDetails = (collectionName) => {
        fetch(`https://revitmongo.onrender.com/collections/${collectionName}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const firstDocument = data[0];
                    if (firstDocument.linkanh && firstDocument.urn) {
                        this.setState(prevState => ({
                            collectionDetails: {
                                ...prevState.collectionDetails,
                                [collectionName]: {
                                    linkanh: firstDocument.linkanh,
                                    urn: firstDocument.urn,
                                    location: firstDocument.location // Add location field if it exists
                                }
                            },
                            selectedDocument: firstDocument
                        }), () => {
                            const documentId = `urn:${firstDocument.urn}`;
                            launchViewer('viewerDiv', documentId);
                        });
                    }
                }
            })
            .catch(error => console.error(`Error fetching first document of ${collectionName}:`, error));
    }

    fetchDocumentDetails = (document) => {
        this.setState({ selectedDocument: document }, () => {
            const documentId = `urn:${document.urn}`;
            launchViewer('viewerDiv', documentId);
        });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    handleChange = (event) => {
        this.setState({ doorFinish: event.target.value });
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    }

    handleCollectionChange = (event) => {
        const collectionName = event.target.value;
        this.setState({ selectedCollection: collectionName });
        this.fetchDocumentsInCollection(collectionName);
        this.fetchFirstDocumentDetails(collectionName);
    }

    fetchDocumentsInCollection = (collectionName) => {
        if (collectionName) {
            fetch(`https://revitmongo.onrender.com/collections/${collectionName}`)
                .then(response => response.json())
                .then(data => {
                    this.setState({ documents: data });
                })
                .catch(error => console.error('Error fetching documents:', error));
        } else {
            this.setState({ documents: [] });
        }
    }

    handleCarouselChange = (index) => {
        if (this.state.selectedCarouselIndex !== index) {
            this.setState({ selectedCarouselIndex: index });
        }
    }

    handleCarouselItemClick = (index) => {
        const document = this.state.documents[index];
        this.setState({ selectedCarouselIndex: index });
        this.fetchDocumentDetails(document);
    }

    toggleCarouselVisibility = () => {
        this.setState(prevState => ({ showCarousel: !prevState.showCarousel }));
    }

    // Hàm mở Drawer
    handleDrawerOpen = () => {
        this.setState({ drawerOpen: true });
    }

    // Hàm đóng Drawer
    handleDrawerClose = () => {
        this.setState({ drawerOpen: false });
    }
    // Hàm để mở và đóng danh sách dự án con
    handleProjectClick = () => {
        this.setState(prevState => ({
            openProject: !prevState.openProject
        }));
    }

    handleListItemClick = (item, index) => {
        this.setState({
            selectedItem: item,
            selectedItemIndex: index
        });
    }


    render() {
        const { open, doorFinish, collections, selectedCollection, documents, collectionDetails, selectedCarouselIndex, showCarousel, drawerOpen, openProject, selectedItem, selectedDocument } = this.state; // Thêm openProject vào đây

        const selectedCollectionName = collections[selectedCarouselIndex];
        const selectedDocumentUrn = selectedDocument?.urn;


        const responsive = {
            superLargeDesktop: {
                breakpoint: { max: 4000, min: 3000 },
                items: 4
            },
            desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 4
            },
            tablet: {
                breakpoint: { max: 1024, min: 464 },
                items: 2
            },
            mobile: {
                breakpoint: { max: 464, min: 0 },
                items: 1
            }
        };

        return (
            <div className='viewer-home'>
                <AppBar position="static" style={{ marginBottom: 25 }}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={this.handleDrawerOpen}
                        >
                            <MenuIcon />
                        </IconButton>
                      <Avatar src='https://th.bing.com/th/id/OIP.Kq_YUiiLMLNK2gEG6RY9bQHaHa?w=170&h=180&c=7&r=0&o=5&pid=1.7'></Avatar>
                        <Typography variant="h6" component="div" style={{ marginLeft:'10px',flexGrow: 1, fontSize: '14px' }}>
                            Công Ty Cổ Phần Công Trình Cầu Phà Thành Phố Hồ Chí Minh <br/> Xí Nghiệp Công Trình 8
                        </Typography>
                        <Button color="inherit" onClick={this.handleClickOpen}>Update</Button>
                    </Toolbar>
                </AppBar>

                {/* Drawer */}
                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={this.handleDrawerClose}
                >
                    <List>
                        {/* Thông tin của người dùng */}
                        <ListItem style={{  paddingTop: 20, borderRadius: 8 }} >
                            <img src="link-to-user-image" alt="User" style={{ width: 50, height: 50, borderRadius: '50%' }} />
                            <ListItemText primary="Tên Người Dùng" secondary="Chức Vụ" />
                        </ListItem>

                        {/* Mục Dự án */}
                        <ListItem button onClick={this.handleProjectClick} style={{ paddingTop: 20, borderRadius: 8 }} >
                            <ListItemIcon><WorkIcon /></ListItemIcon>
                            <ListItemText primary="Dự án" />
                            {openProject ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={openProject} timeout="auto" unmountOnExit>
                            {/* Danh sách các dự án con */}
                            <div style={{ paddingLeft: 50 }}>
                                <List component="ul">
                                    {collections.map(collection => (
                                        <ListItem 
                                            button 
                                            key={collection} 
                                            style={{ paddingTop: 20, borderRadius: 8,backgroundColor: selectedItem === collection ? '#3177a7' : 'inherit',color: selectedItem === collection ? '#fff' : 'inherit' }} 
                                            onClick={() => this.handleListItemClick(collection)}
                                        >
                                            <ListItemText primary={collection} />
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        </Collapse>


                        {/* Các mục khác */}
                        <ListItem button style={{ paddingTop: 20, borderRadius: 8,backgroundColor: selectedItem === 'manageAccounts' ? '#3177a7' : 'inherit',color: selectedItem === 'manageAccounts' ? '#fff' : 'inherit' }} onClick={() => this.handleListItemClick('manageAccounts')}>
                            <ListItemIcon><ManageAccountsIcon /></ListItemIcon>
                            <ListItemText primary="Quản lý" />
                        </ListItem>
                        <ListItem button style={{ paddingTop: 20, borderRadius: 8,backgroundColor: selectedItem === 'message' ? '#3177a7' : 'inherit',color: selectedItem === 'message' ? '#fff' : 'inherit' }} onClick={() => this.handleListItemClick('message')}>
                            <ListItemIcon><MessageIcon /></ListItemIcon>
                            <ListItemText primary="Tin nhắn" />
                        </ListItem>
                        <ListItem button style={{ paddingTop: 20, borderRadius: 8,backgroundColor: selectedItem === 'map' ? '#3177a7' : 'inherit',color: selectedItem === 'map' ? '#fff' : 'inherit' }} onClick={() => this.handleListItemClick('map')}>
                            <ListItemIcon><MapIcon /></ListItemIcon>
                            <ListItemText primary="Map" />
                        </ListItem>
                        <ListItem button style={{ paddingTop: 20, borderRadius: 8,backgroundColor: selectedItem === 'archive' ? '#3177a7' : 'inherit',color: selectedItem === 'archive' ? '#fff' : 'inherit' }} onClick={() => this.handleListItemClick('archive')}>
                            <ListItemIcon><ArchiveIcon /></ListItemIcon>
                            <ListItemText primary="Lưu trữ" />
                        </ListItem>
                        <ListItem button style={{ paddingTop: 20, borderRadius: 8,backgroundColor: selectedItem === 'calendar' ? '#3177a7' : 'inherit',color: selectedItem === 'calendar' ? '#fff' : 'inherit' }} onClick={() => this.handleListItemClick('calendar')}>
                            <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
                            <ListItemText primary="Lịch" />
                        </ListItem>

                    </List>
                </Drawer>




                {/* Toggle button for carousel */}
                <Button className='buttonHideorShow' onClick={this.toggleCarouselVisibility}>
                    {showCarousel ? 'Hide Carousel' : 'Show Carousel'}
                </Button>

                {/* Conditional rendering of the carousel */}
                {showCarousel && (
                        <div className="carousel-container">
                            <Carousel
                                responsive={responsive}
                                showArrows={true}
                                autoPlay={false}
                                infiniteLoop={true}
                                showThumbs={false}
                                afterChange={this.handleCarouselChange}
                            >
                                {documents.map((document, index) => (
                                    <div
                                        key={index}
                                        className={`carousel-item ${selectedCarouselIndex === index ? 'selected' : ''}`}
                                        onClick={() => this.handleCarouselItemClick(index)}
                                    >
                                        <div className="card">

                                            <img
                                                src={document.linkanh || "https://via.placeholder.com/150"}
                                                className="card-img-top"
                                                alt={`Model ${index + 1}`}
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">{document.name}</h5>
                                                <p className="card-text">{document.location || 'Location not available'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    )}

                
                {selectedDocumentUrn && (
                    <>
                        {
                            (() => {
                                const documentId = `urn:${selectedDocumentUrn}`;
                                launchViewer('viewerDiv', documentId);
                            })()
                        }
                        <div style={{ position: "absolute", width: "100%", height: showCarousel ? "58%" : "84%" }} id="viewerDiv" />
                    </>
                )}

                {/* Dialog */}
                                    {/* Dialog */}
                    <Dialog
                        open={open}
                        onClose={this.handleClose}
                    >
                        <DialogTitle>Door Finish Update</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Please select door finish value.
                            </DialogContentText>
                            <FormControl sx={{ m: 2, minWidth: 200 }} size="small">
                                <InputLabel>Collections</InputLabel>
                                <Select
                                    value={selectedCollection}
                                    label="Collections"
                                    onChange={this.handleCollectionChange}
                                >
                                    <MenuItem value="">Select a collection</MenuItem>
                                    {collections.map(collection => (
                                        <MenuItem key={collection} value={collection}>{collection}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {selectedCollection && (
                                <div>
                                    <h2>Documents in {selectedCollection}</h2>
                                    <pre>{JSON.stringify(documents, null, 2)}</pre>
                                </div>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose}>Cancel</Button>
                            <Button onClick={() => getSelection(doorFinish)}>Save</Button>
                        </DialogActions>
                    </Dialog>

            </div>
        );
    }
}

export default Home;