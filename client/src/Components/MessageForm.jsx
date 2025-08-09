import * as React from "react";
import { Container, Box, TextField, InputLabel, FormControl, OutlinedInput, Button, FormHelperText } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Loader from "./Loader.jsx";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function MessageForm() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isLoaderActive, setLoader] = useState(false);

  const { register: registerGenerateEmail, handleSubmit: handleSubmitGenerateEmail, reset: resetGenerateEmail } = useForm();

  const { register: registerSendEmailForm, handleSubmit: handleSubmitSendEmailForm, setValue: setSendEmailFormValue } = useForm();

  const [formKey, setFormKey] = useState(0);

  const onSubmitGenerateEmail = async (data) => {
    setLoader(true);
    handleClose();
    try {
      const response = await axios.post(`${window.SERVER_URL}/api/v1/generate-message`, { ...data });

      if (response.data.status) {
        const result = response.data.data;
        resetGenerateEmail();
        setFormKey((prev) => prev + 1);
        setSendEmailFormValue("subject", result.subject);
        setSendEmailFormValue("message", result.message);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      alert("Something went wrong");
      console.log(error.response.data.message);
    }
  };

  const onSubmitSendEmailForm = async (data) => {
    setLoader(true);
    data.emails = JSON.parse(localStorage.getItem("emails"));

    if (!data.emails.length) {
      alert("No Emails available");
      setLoader(false);
      return;
    }

    try {
      const response = await axios.post(`${window.SERVER_URL}/api/v1/send-emails`, { ...data });

      if (response.data.status) {
        setFormKey((prev) => prev + 1);
        setLoader(false);
        alert("Mail Sent Successfully...");
      }
    } catch (error) {
      setLoader(false);
      alert("Something went wrong");
      console.log(error.response.data.message);
    }
  };

  return (
    <>
      {isLoaderActive ? (
        <Loader />
      ) : (
        <Box>
          <form key={formKey} onSubmit={handleSubmitSendEmailForm(onSubmitSendEmailForm)}>
            <Container sx={{ p: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "start", gap: 2, m: 2 }}>
                <Button variant="contained" onClick={handleOpen}>
                  Generate Message
                </Button>
              </Box>
              <Box sx={{ "& .MuiTextField-root": { m: 1, width: "100%" } }}>
                <FormControl sx={{ m: 2 }} fullWidth>
                  <InputLabel htmlFor="component-outlined">Subject</InputLabel>
                  <OutlinedInput
                    id="component-outlined"
                    defaultValue=""
                    fullWidth
                    label="subject"
                    {...registerSendEmailForm("subject", {
                      required: { value: true, message: "Message Required" },
                    })}
                  />
                  {/* <FormHelperText>{errors.subject ? errors.subject.message : ""}</FormHelperText> */}
                </FormControl>
                <TextField
                  id="outlined-multiline-static"
                  label="Message"
                  multiline
                  rows={10}
                  defaultValue=""
                  {...registerSendEmailForm("message", {
                    required: { value: true, message: "Message is required" },
                  })}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                <Button variant="contained" color="secondary" type="submit">
                  Send Mails
                </Button>
              </Box>
            </Container>
          </form>
        </Box>
      )}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Generate Message
            </Typography>
            <form key={formKey} onSubmit={handleSubmitGenerateEmail(onSubmitGenerateEmail)}>
              <Container sx={{ p: 4 }}>
                <Box sx={{ "& .MuiTextField-root": { m: 1, width: "100%" } }}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Enter Prompt to Generate Email"
                    multiline
                    rows={6}
                    defaultValue=""
                    {...registerGenerateEmail("message", {
                      required: { value: true, message: "Message is required" },
                    })}
                  />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                  <Button variant="contained" color="primary" type="submit">
                    Submit
                  </Button>
                </Box>
              </Container>
            </form>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
