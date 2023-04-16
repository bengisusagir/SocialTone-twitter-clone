import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { Form, TextArea, Grid, Image } from "semantic-ui-react";
import { red, purple } from "@mui/material/colors";
import SendIcon from "@mui/icons-material/Send";
import img from "./img.png";
import { db, storage } from "../config/firebase";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { formatDistanceToNow } from "date-fns";


import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import EditIcon from "@mui/icons-material/Edit";

const Home = () => {
  const [authUser, setAuthUser] = useState(null);
  const [lick, setLick] = useState([]);
  const [newLick, setNewLick] = useState("");
  const [fileUpload, setFileUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");




  const licksCollectionRef = collection(db, "moods");

  

  const onSubmit = async () => {
    try {
      await addDoc(licksCollectionRef, {
        text: newLick,
        userid2: authUser.email,
        displayName: authUser.displayName,
        photoURL: authUser.photoURL,
        createdAt: Date.now(),

      });
    } catch (err) {
      console.error(err);
    }
  };



  useEffect(() => {
    const getLicks = async () => {
      try {
        const data = await getDocs(licksCollectionRef);

        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setLick(filteredData);
      } catch (err) {
        console.error(err);
      }
    };
    getLicks();
  }, [onSubmit]);

  const deleteLick = async (id) => {
    const lickDoc = doc(db, "moods", id);
    await deleteDoc(lickDoc);
  };

  const submitLick = () => {
    onSubmit();
    setNewLick("");
  };

  const uploadFile = async (file, authUser, setLoading) => {
    const fileRef = ref(storage, "images/" + authUser.email + ".png");


    setLoading(true);
    const snapshot = await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);
    updateProfile(authUser, { photoURL });
    
    console.log(photoURL);

    setLoading(false);
    setFileUpload(null);
  };

  
  const [show, setShow] = useState(false);

  const handleClose2 = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (authUser?.photoURL) {
      setUrl(authUser.photoURL);
    }
  }, [authUser]);


  const changeUsername = async () => {
    try {
      await updateProfile(authUser, { displayName: newName });
      setIsEditing(false);
      console.log("hop");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
      })
      .catch((error) => console.log(error));
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    handleClose();
    userSignOut();
  };
  const navigate = useNavigate();
  const navigateToGiris = () => {
    navigate("/");
  };

  return (
    <div>
      {authUser ? (
        <>
          <Modal show={show} onHide={handleClose2} centered size="lg">
            <Modal.Header closeButton>
              <Modal.Title>
                <h2 style={{ marginLeft: 300 }}>Profile Settings</h2>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container className="container">
                <Row>
                  <Col xs={3}>
                    <Avatar
                      style={{ width: 250, height: 250 }}
                      src={authUser.photoURL}
                      ></Avatar>
                  </Col>
                  <Col xs={2}>
                    <div style={{ marginLeft: 60, marginTop: 200 }}>
                      <input
                        accept="image/*"
                        id="icon-button-file"
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => setFileUpload(e.target.files[0])}
                      />
                      <label htmlFor="icon-button-file">
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                        >
                          <AddAPhotoIcon></AddAPhotoIcon>
                        </IconButton>
                      </label>
                      <IconButton
                        color="success"
                        disabled={loading || !fileUpload}
                        onClick={() =>
                          uploadFile(fileUpload, authUser, setLoading)
                        }
                      >
                        <CheckCircleIcon></CheckCircleIcon>
                      </IconButton>
                    </div>
                  </Col>
                  <Col xs={7}>
                    <div class="ui card fluid">
                      <div class="content">
                        <div style={{ height: 250, textAlign: "center" }}>
                          <IconButton
                            style={{ float: "right" }}
                            color="success"
                            disabled={!isEditing}
                            onClick={changeUsername}
                          >
                            <CheckCircleIcon></CheckCircleIcon>
                          </IconButton>
                          <IconButton
                            style={{ float: "right" }}
                            color="primary"
                            onClick={() => setIsEditing(true)}
                          >
                            <EditIcon />
                          </IconButton>

                          <h1>Username:</h1>

                          {isEditing ? (
                            <Form.Input
                              type="text"
                              onChange={(e) => setNewName(e.target.value)}
                            />
                          ) : (
                            <h1>{authUser.displayName}</h1>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
          </Modal>
          <Navbar>
            <Container>
              <Navbar.Brand>
                <h1 style={{ color: "#69427a", tabSize: 10 }}>
                  <img
                    style={{ width: 55, height: 35, marginBottom: 2 }}
                    className="resim"
                    src={img}
                  ></img>{" "}
                  SocialTone
                </h1>
              </Navbar.Brand>
              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                  <Box>
                    <Tooltip title="Account settings">
                      <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                      >
                        <Avatar
                          src={authUser.photoURL}
                          sx={{ width: 32, height: 32 }}
                        ></Avatar>
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem onClick={handleShow}>
                      <Avatar
                        src={authUser.photoURL}
                        sx={{ width: 32, height: 32 }}
                      ></Avatar>
                      {authUser.displayName}
                    </MenuItem>
                    <Divider />

               
                    <MenuItem onClick={() => logout()}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </Navbar.Text>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <style>{`
                    .del {
                      float: right;
                     
                    .resim{
                      max-width: 100%;
                      height: auto;  
                    }
                    
                   
                    }
                    `}</style>
          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column width={4}></Grid.Column>
              <Grid.Column width={8}>
                <div>
                  <Form>
                    <TextArea
                      placeholder="Tell us more"
                      onChange={(e) => setNewLick(e.target.value)}
                      style={{ minHeight: 20 }}
                      value={newLick}
                    />
                  </Form>
                  <br />
                  <br />

                  {lick
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .map((mod) => (
                      <div>
                        <div class="ui card fluid">
                          <div class="content">
                            <div class="header">
                              <Avatar
                                src={mod.photoURL}
                                sx={{ width: 32, height: 32,float:"left",marginRight:2 }}
                              ></Avatar>
                              {mod.displayName}
                            </div>
                            {formatDistanceToNow(mod.createdAt,{
                                addSuffix: true,
                                unit: 's'
                              })}
                              
                          </div>
                          <div class="content" >
                            <div class="description" >{mod.text}</div>
                            
                          </div>
                          <div>
                 

                            <IconButton
                              className="del"
                              name="delete"
                              disabled={!(mod.userid2 == authUser.email)}
                              onClick={() => deleteLick(mod.id)}
                              sx={{ color: red[500], marginRight: 1 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        </div>

                        <br></br>
                      </div>
                    ))}
                </div>
              </Grid.Column>
              <Grid.Column width={4}>
                <br></br>
                <IconButton>
                  <SendIcon
                    sx={{ color: purple[400] }}
                    fontSize="large"
                    onClick={submitLick}
                  />
                </IconButton>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </>
      ) : (
        navigateToGiris()
      )}
    </div>
  );
};

export default Home;
