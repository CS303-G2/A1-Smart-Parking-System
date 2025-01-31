import Navbar from "./Navbar";
import Background from "./Background";
import { useEffect, useState } from "react";
import { getUserInfo } from "../store";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Container,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

function Profile() {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const updateUser = async (token) => {
    const res = await getUserInfo(token);
    setUser(res);
  };
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate("/sign-in");
    } else {
      updateUser(token);
    }
  }, []);
  return (
    <div className="h-screen pt-24 mx-12">
      <Navbar />
      <Background brightness={0.9} opacity={0.6} />
      {user && (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Card
            elevation={3}
            sx={{
              maxWidth: 500,
              margin: "auto",
              textAlign: "center",
              borderRadius: 2,
              p: 3,
            }}
          >
            <CardContent>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: "auto",
                  mb: 2,
                  bgcolor: "primary.main",
                }}
              >
                <PersonIcon sx={{ fontSize: 60 }} />
              </Avatar>

              <Typography variant="h4" gutterBottom>
                {user.user.username}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Email:</strong> {user.user.email}
                </Typography>

                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Phone:</strong> {user.user.phone}
                </Typography>

                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>User ID:</strong> {user.user.user_id}
                </Typography>

                <Typography variant="body1" color="text.secondary">
                  <strong>Current Bill:</strong> ₹{user.user.bill}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      )}
    </div>
  );
}

export default Profile;
