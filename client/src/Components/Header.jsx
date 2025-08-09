import * as React from 'react';
import Box from '@mui/material/Box';
import { Outlet, Link } from 'react-router-dom';

export default function Links() {
  return (
    <>
    <Box
      sx={{
        typography: 'body1',
        '& > :not(style) ~ :not(style)': {
          ml: 2,
          textDecoration : 'none',
        },
      }}
    >
      <Link to="/">Message</Link>
      <Link to="/emails">Emails</Link>
    </Box>
    <Outlet />
    </>
  );
}
