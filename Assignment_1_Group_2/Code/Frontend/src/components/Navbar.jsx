import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Link, useNavigate, useLocation } from "react-router-dom";
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

export default function AppAppBar() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem("jwt_token");
    navigate("/sign-in");
  };
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters sx={{ boxShadow: 3 }}>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <Link to="/dashboard">
              <img src="/image.png" className="h-10 rounded-2xl mr-5"></img>
            </Link>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Link to="/book">
                <Button
                  variant="text"
                  color="black"
                  size="small"
                  style={{
                    color: location.pathname === "/book" ? "white" : "black",
                    transition: "color 0.3s ease", // Smooth transition
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "white")}
                >
                  Book-a-Slot
                </Button>
              </Link>
              <Link to={"/bookings"}>
                <Button
                  variant="text"
                  color="black"
                  size="small"
                  style={{
                    color:
                      location.pathname === "/bookings" ? "white" : "black",
                    transition: "color 0.3s ease", // Smooth transition
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "white")}
                >
                  Your-Bookings
                </Button>
              </Link>
              <Link to="/profile">
                <Button
                  variant="text"
                  color="black"
                  size="small"
                  style={{
                    color: location.pathname === "/profile" ? "white" : "black",
                    transition: "color 0.3s ease", // Smooth transition
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "white")}
                >
                  Profile
                </Button>
              </Link>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)",
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <Link to={"/book"}>
                  <MenuItem>Book-a-Slot</MenuItem>
                </Link>
                <Link to={"/bookings"}>
                  <MenuItem>Your-Bookings</MenuItem>
                </Link>
                <Link to={"/profile"}>
                  <MenuItem>Profile</MenuItem>
                </Link>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button
                    color="primary"
                    variant="outlined"
                    fullWidth
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
