import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  /*
  useMemo is a React hook that memorizes the value of the function passed to it. 
  It is used to optimize performance by preventing the re-execution of the function.
  In simple terms, useMemo is used to store the value of a function so that it is not re-executed every time the component re-renders.

  useEffect is a React hook that is used to perform side effects in function components.
  It is similar to componentDidMount, componentDidUpdate, and componentWillUnmount in class components.
  useEffect takes two arguments: a function that contains the side effect and an array of dependencies.
  The function is executed after the component is rendered, and it is executed every time the component re-renders.
  The array of dependencies is used to specify the values that the side effect depends on.
  If the array is empty, the side effect is only executed once after the initial render.
  If the array contains values, the side effect is executed whenever any of the values in the array change.
  */

  const [message, setMessage] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    setMessage("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected!", socket.id);
    });


    return () => {
      socket.disconnect();
    };
  }, []);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const console = window.console;
    if (console) {
      console.defaultLog = console.log.bind(console);
      console.defaultError = console.error.bind(console);
      console.log = console.error = (...args) => {
        setLogs((prevLogs) => [...prevLogs, ...args]);
        console.defaultLog(...args);
      };
    }
    return () => {
      if (console) {
        console.log = console.defaultLog;
        console.error = console.defaultError;
      }
    };
  }, []);

  const DisplayLog = () => (
    <Paper
      style={{
        padding: "1rem",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        height: "60vh",
        width: "50vw",
        overflow: "auto",
      }}
    >
      <Typography
        variant="h3"
        style={{
          marginBottom: "1rem",
          color: "#333",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        console.log()
      </Typography>
      <Paper
        component="pre"
        style={{
          backgroundColor: "#f5f5f5",
          padding: "1rem",
          overflowX: "auto",
          maxHeight: "40vh",
          width: "20vw",
          maxWidth: "30vw",
        }}
      >
        {logs.join("\n")}
      </Paper>
    </Paper>
  );

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
      }}
    >
      <Typography
        variant="h1"
        style={{
          fontWeight: "bold",
          marginBottom: "6rem",
          alignContent: "center",
        }}
      >
        Welcome to Socket.IO!
      </Typography>
      <DisplayLog />
      <Paper
        sx={{
          padding: "1rem",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          height: "25vh",
          width: "50vw",
        }}
      >
        <form onClick={submitHandler}>
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
        </form>
      </Paper>
    </Container>
  );
};

export default App;
