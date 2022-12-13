import React, { useContext } from "react";
// ...
import { Link } from "react-router-dom";
import { Box, Button, Typography, Stack, Avatar, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import LogoutIcon from "@mui/icons-material/Logout";
import { useStateContext } from "../contexts/ContextProvider";

const Header = () => {
  const { screenSize } = useStateContext();
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutButtonHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const loginButtonHandler = () => {
    navigate("/login");
  };

  const container = {
    height: screenSize >= 650 ? "65px" : "120px",
    backgroundColor: "black"
  };

  const contained = {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: screenSize >= 650 ? "row" : "column",
    paddingLeft: "50px",
    paddingRight: "50px",
    paddingTop: "10px"
  };

  return (
    <Box style={container}>
      <Box style={contained}>
        <Box sx={wrapper}>
          <Link to="/" className="logo" style={titleStyle}>
            User Akses Model 1
          </Link>
        </Box>
        {user ? (
          <Stack direction="row" spacing={1} sx={containerAvatar}>
            <Avatar alt="Ivan Kristiawan" sx={avatarIcon}>
              {user.username.substring(0, 1)}
            </Avatar>
            <Stack direction="row">
              <Typography noWrap component="p" sx={greetingText}>
                Hai,
              </Typography>
              <Typography noWrap component="p" sx={usernameText}>
                {user.username}
              </Typography>
              <Tooltip title="Logout">
                <LogoutIcon sx={logoutStyle} onClick={logoutButtonHandler} />
              </Tooltip>
            </Stack>
          </Stack>
        ) : (
          <Box direction="row" spacing={1} sx={containerButtonGroup}>
            <Button sx={buttonUser} onClick={loginButtonHandler}>
              <Typography sx={{ color: "white", fontSize: "15px" }}>
                Login
              </Typography>
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Header;

const titleStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "20px",
  paddingTop: "8px"
};

const wrapper = {
  display: "flex"
};

const containerButtonGroup = {
  ml: "auto",
  p: 1,
  cursor: "pointer",
  borderRadius: "5px",
  backgroundColor: "#757ce8"
};

const buttonUser = {
  transition: "0.3s",
  padding: 0,
  "&:hover": { backgroundColor: "#90caf9", color: "black" }
};

const containerAvatar = {
  ml: {
    md: "auto",
    sm: null
  },
  mt: {
    md: "0",
    xs: "10px"
  },
  p: 1,
  borderRadius: "16px",
  backgroundColor: "primary.light",
  display: {
    md: null,
    sm: "flex"
  },
  justifyContent: "center"
};

const avatarIcon = {
  width: 30,
  height: 30,
  fontSize: "14px",
  bgcolor: "purple"
};

const greetingText = {
  color: "#eeeeee",
  my: "auto"
};

const usernameText = {
  color: "#eeeeee",
  fontWeight: "bold",
  mx: 1,
  my: "auto"
};

const logoutStyle = {
  color: "white",
  my: "auto",
  padding: "3px",
  cursor: "pointer",
  transition: "0.3s",
  "&:hover": { borderRadius: 2, backgroundColor: "#90caf9", color: "black" }
};
