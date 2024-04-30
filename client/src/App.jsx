import {Button, Container, Paper, Stack, TextField, Typography,} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {io} from "socket.io-client";

const App = () => {
  // useMemo is used to create a socket connection and memoize it to prevent re-creation on every render
  const socket = useMemo(() => io("http://localhost:3000", {withCredentials: true}), []);

  // useState is a Hook that allows you to add React state to function components
  // Here we're creating state variables for message, room and socketId
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");

  const [messages, setMessages] = useState([]);

  const [roomName, setRoomName] = useState("");

  // This function is called when the user tries to join a room
  const joinRoomHandler = (e) => {
    e.preventDefault();
    // Emit a "join-room" event to the server, with the room name as data
    socket.emit("join-room", roomName);
    // Clear the room name field
    setRoomName("");
  };

  // This function is called when the user submits the form to send a message
  const submitHandler = (e) => {
    e.preventDefault();
    // Emit a "message" event to the server, with the message, room, and socketId as data
    socket.emit("message", {message, room, socketId});
    // Clear the message field
    setMessage("");
  };

  // useEffect is a Hook that allows you to perform side effects in function components
  // useEffect runs after the first render and after every update
  // useEffect takes a callback function as its first argument
  // The second argument is an array of dependencies that the effect depends on
  // 3 scenarios:
  // 1. Empty array: runs once after the first render
  // 2. No array: runs after every render
  // 3. Array with dependencies: runs when the dependencies change
  // unmount: return a function that cleans up the effect
  // componentDidMount, componentDidUpdate, and componentWillUnmount
  // componentDidMount: runs after the first render
  // componentDidUpdate: runs after every render
  // componentWillUnmount: runs when the component unmounts
  useEffect(() => {
    // When the socket connects, set the socketId state to the socket's id
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    // When a "receive-message" event is received from the server, add the message to the messages state
    socket.on("receive-message", ({message, sid}) => {
      message.length && setMessages((messages) => [...messages, `${sid}: ${message}`]);
    });

    // When the component unmounts, disconnect the socket
    return () => {
      socket.disconnect();
    };
  }); // Empty dependency array means this effect runs once on mount and clean up on unmount


  const renderTypography = (variant, sx, text) => (
    <Typography variant={variant} sx={sx}>
      {text}
    </Typography>
  );

  const renderTextField = (id, label, sx, value, onChange) => (
    <TextField
      id={id}
      label={label}
      variant="outlined"
      sx={sx}
      value={value}
      onChange={onChange}
    />
  );

  const renderButton = (type, variant, color, sx, text) => (
    <Button type={type} variant={variant} color={color} sx={sx}>
      {text}
    </Button>
  );

  const renderForm = (onSubmit, children) => (
    <form onSubmit={onSubmit}>
      <Stack
        direction={{xs: "column", sm: "row"}}
        spacing={2}
        sx={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {children}
      </Stack>
    </form>
  );

  const renderPaper = (sx, children) => (
    <Paper sx={sx}>
      {children}
    </Paper>
  );

  return (
    <Container>
      {renderTypography("h2", {
        fontWeight: "bold",
        marginBottom: {xs: "4rem", sm: "6rem"},
        textAlign: "center"
      }, "Welcome to Socket.IO!")}
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        height: "100vh",
        backgroundColor: "rgba(100, 30, 25, 0.1)",
        padding: "2rem",
      }}
    >

      {renderTypography("h5", {marginBottom: "2rem"}, `Socket: ${socketId}`)}

      {renderPaper({
        padding: "2rem",
        height: {xs: "auto", sm: "25vh"},
        width: {xs: "90%", sm: "50vw"},
        display: "flex",
        alignItems: "center",
        minHeight: "250px",
        justifyContent: "center",
      }, renderForm(joinRoomHandler, [
        renderTextField("outlined-basic", "Room Name", {
          marginBottom: "1rem",
          marginRight: "1rem",
          height: "50px"
        }, roomName, (e) => setRoomName(e.target.value)),
        renderButton("submit", "contained", "primary", {
          marginBottom: "1rem",
          marginRight: "1rem",
          justifySelf: "center",
          height: "50px"
        }, "Join Room")
      ]))}

      {renderPaper({
        padding: "2rem",
        height: {xs: "auto", sm: "25vh"},
        width: {xs: "90%", sm: "50vw"},
        display: "flex",
        alignItems: "center",
        minHeight: "250px",
        justifyContent: "center",
      }, renderForm(submitHandler, [
        renderTextField("outlined-basic", "Message", {
          marginBottom: "1rem",
          marginRight: "1rem",
          height: "50px"
        }, message, (e) => setMessage(e.target.value)),
        renderTextField("outlined-basic", "Room", {
          marginBottom: "1rem",
          marginRight: "1rem",
          height: "50px"
        }, room, (e) => setRoom(e.target.value)),
        renderButton("submit", "contained", "primary", {
          marginBottom: "1rem",
          marginRight: "1rem",
          justifySelf: "center",
          height: "50px"
        }, "Send")
      ]))}

      {renderPaper({
        padding: "2rem",
        height: {xs: "auto", sm: "25vh"},
        width: {xs: "90%", sm: "50vw"},
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "250px",
        justifyContent: "center",
        backgroundColor: "rgba(100, 30, 25, 0.5)",
        color: "white",
        marginTop: "2rem",
      }, <Stack sx={{
        width: "100%",
        overflow: "auto"
      }}>{messages.map((msg) => renderTypography(null, null, msg))}</Stack>)}
    </Stack>
    </Container>
  );
};

export default App;