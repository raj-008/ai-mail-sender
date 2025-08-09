import React, { useState, useEffect } from "react";
import { Box, TextField, Button, List, ListItem, ListItemText, IconButton } from "@mui/material";

export default function CreateEmails() {
  const [emails, setEmails] = useState(JSON.parse(localStorage.getItem("emails")) || []);
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    localStorage.setItem("emails", JSON.stringify(emails));
  }, [emails]);

  const handleAddEmail = () => {
    if (!newEmail.trim()) return;
    setEmails((prev) => [...prev, newEmail.trim()]);
    setNewEmail("");
  };

  const handleDeleteEmail = (index) => {
    setEmails((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 3 }}>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddEmail}>
          Add
        </Button>
      </Box>

      <List>
        {emails.map((email, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" color="error" onClick={() => handleDeleteEmail(index)}>
                Delete
              </IconButton>
            }
          >
            <ListItemText primary={email} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
