import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import ColorModeSelect from "../shared-theme/ColorModeSelect.jsx";
import { Link } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignIn() {
  const navigate = useNavigate();

  const [usernameError, setUsernameError] = React.useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");

  // ... existing code ...

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (usernameError || passwordError) {
      return;
    }
    const data = new FormData(event.currentTarget);
    try {
      const res = await api.post("/signin", {
        username: data.get("username"),
        password: data.get("password"),
      });
      if (res.status === 200 || res.status === 201) {
        // Store the token in localStorage
        localStorage.setItem("jwt_token", res.data.token);

        // You might want to set it in your API instance for subsequent requests
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;

        toast.success("Sign In successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to sign in. Please try again."
      );
    }
  };

  const validateInputs = () => {
    const username = document.getElementById("username");
    const password = document.getElementById("password");

    let isValid = true;

    if (!username.value) {
      setUsernameError(true);
      setUsernameErrorMessage("Please enter a valid username address.");
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <>
      <div className="flex flex-row bg-white justify-center items-center">
        <div>
          <img className="h-100 w-100" src="/park.jpg"></img>
        </div>

        <div className=" w-150">
          <CssBaseline enableColorScheme />
          <SignInContainer direction="column" justifyContent="space-between">
            <ColorModeSelect
              sx={{ position: "fixed", top: "1rem", right: "1rem" }}
            />
            <Card variant="outlined">
              <div className="flex  justify-between items-center ">
                <span className="text-2xl font-bold text-nowrap">Sign In</span>
                <img src="/image.png" className="h-5 w-20 rounded-sm"></img>
              </div>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: 2,
                }}
              >
                <FormControl>
                  <FormLabel htmlFor="username">User Name</FormLabel>
                  <TextField
                    error={usernameError}
                    helperText={usernameErrorMessage}
                    id="username"
                    type="username"
                    name="username"
                    placeholder="username"
                    autoComplete="username"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color={usernameError ? "error" : "primary"}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <TextField
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    name="password"
                    placeholder="••••••"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color={passwordError ? "error" : "primary"}
                  />
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={validateInputs}
                >
                  Sign in
                </Button>
                <Typography sx={{ textAlign: "center" }}>
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/sign-up"
                    variant="body2"
                    sx={{ alignSelf: "center" }}
                  >
                    <span className="font-semibold">Sign up</span>
                  </Link>
                </Typography>
              </Box>
            </Card>
          </SignInContainer>
        </div>
      </div>
    </>
  );
}
