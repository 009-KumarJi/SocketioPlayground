import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  // useMemo is used to create a socket connection and memoize it to prevent re-creation on every render
  const socket = useMemo(() => io("http://localhost:3000", { withCredentials: true }), []);

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

    // When a "recieve-message" event is received from the server, add the message to the messages state
    socket.on("recieve-message", ({message, sid}) => {
      message.length && setMessages((messages) => [...messages, `${sid}: ${message}`]);
    });

    // When the component unmounts, disconnect the socket
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array means this effect runs once on mount and clean up on unmount

  // The component returns a JSX element that renders the web interface
  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        width: "100vw",
        overflow: 'auto',
      }}
    >
      <Typography
  variant="h2"
  sx={{
    fontWeight: "bold",
    marginBottom: { xs: "2rem", sm: "6rem" }, 
    textAlign: "center", 
  }}
>
  Welcome to Socket.IO!
</Typography>

      <Typography variant="h5" sx={{ marginBottom: "2rem" }}>
        Socket: {socketId}
      </Typography>
      {/* JOIN room */}
      <Paper
        sx={{
          padding: "2rem",
          height: { xs: "auto", sm: "25vh" }, 
          width: { xs: "90%", sm: "50vw" }, 
          display: "flex",
          alignItems: "center",
          minHeight: "250px",
          justifyContent: "center",
        }}
      >
        <form onSubmit={joinRoomHandler}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <TextField
              id="outlined-basic"
              label="Room Name"
              variant="outlined"
              sx={{
                marginBottom: "1rem",
                marginRight: "1rem",
                height: "50px",
              }}
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                marginBottom: "1rem",
                marginRight: "1rem",
                justifySelf: "center",
                height: "50px",
              }}
            >
              Join Room
            </Button>
          </Stack>
        </form>
      </Paper>

      <Paper
        sx={{
          padding: "2rem",
          height: { xs: "auto", sm: "25vh" }, // auto height for small screens
          width: { xs: "90%", sm: "50vw" }, // 90% width for small screens
          display: "flex", 
          alignItems: "center",
          minHeight: "250px",
          justifyContent: "center",
        }}
      >
        <form onClick={submitHandler}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <TextField
              id="outlined-basic"
              label="Message"
              variant="outlined"
              sx={{
                marginBottom: "1rem",
                marginRight: "1rem",
                height: "50px",
              }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Room"
              variant="outlined"
              sx={{
                marginBottom: "1rem",
                marginRight: "1rem",
                height: "50px",
              }}
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                marginBottom: "1rem",
                marginRight: "1rem",
                justifySelf: "center",
                height: "50px",
              }}
            >
              Send
            </Button>
          </Stack>
        </form>
      </Paper>
      <Paper
      sx={{
        padding: "2rem",
        height: { xs: "auto", sm: "25vh" }, // auto height for small screens
        width: { xs: "90%", sm: "50vw" }, // 90% width for small screens
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "250px",
        justifyContent: "center",
        backgroundColor: "rgba(100, 30, 25, 0.5)",
        color: "white",
        marginTop: "2rem",
      }}
      >
        <Stack
          sx={{
            width: "100%",
            overflow: "auto",
          }}
        >
          {messages.map((msg, index) => (
            <Typography key={index}>{msg}</Typography>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
};

export default App;