import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  // Create a socket connection and memoize it to prevent re-creation on every render
  const socket = useMemo(() => io("http://localhost:3000"), []);

  // State variables for message, room and socketId
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");

  const [messages, setMessages] = useState([]);

  // Handler for form submission
  const submitHandler = (e) => {
    e.preventDefault();
    // Emit the message to the server
    socket.emit("message", {message, room});
    // Clear the message field
    setMessage("");
  };

  useEffect(() => {
    // Listen for connection event
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    // Listen for incoming messages
    socket.on("recieve-message", (data) => {
      data.length && console.log(data);
    });

    // Clean up function to disconnect when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array means this effect runs once on mount and clean up on unmount

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        width: "100vw",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: "bold",
          marginBottom: "6rem",
          textAlign: "center", 
        }}
      >
        Welcome to Socket.IO!
      </Typography>

      <Typography variant="h5" sx={{ marginBottom: "2rem" }}>
        Socket: {socketId}
      </Typography>

      <Paper
        sx={{
          padding: "2rem",
          height: "25vh",
          width: "50vw",
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
    </Box>
  );
};

export default App;