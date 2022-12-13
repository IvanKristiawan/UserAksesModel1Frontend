import "./styles.css";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { Header } from "./components";
import {
  Sidebar,
  Menu,
  SubMenu,
  MenuItem,
  useProSidebar
} from "react-pro-sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import { ErrorBoundary } from "react-error-boundary";
import { Fallback } from "./components/Fallback";
import { Divider, Box, Typography, CssBaseline, Tooltip } from "@mui/material";
import { Colors } from "./constants/styles";
import { AuthContext } from "./contexts/AuthContext";
import { useStateContext } from "./contexts/ContextProvider";
import { Login, DaftarUser } from "./pages/index";

const App = () => {
  const { screenSize, setScreenSize } = useStateContext();
  const { collapseSidebar } = useProSidebar();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(true);

  const USERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const openMenuFunction = () => {
    setOpen(!open);
    collapseSidebar();
  };

  const contentWrapper = {
    minHeight: "100vh",
    width: open && screenSize >= 650 ? "80vw" : "100vw"
  };

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box>
      <BrowserRouter>
        <CssBaseline />
        <Header />
        <div style={container}>
          {user && (
            <Sidebar
              backgroundColor={Colors.blue50}
              defaultCollapsed={screenSize >= 650 ? false : true}
              collapsedWidth="0px"
            >
              <Menu>
                <SubMenu label="Menu">
                  <Divider />
                  {user.akses.master === true && (
                    <Link to="/master">
                      <MenuItem>
                        <Typography
                          variant="body2"
                          sx={{ paddingLeft: "70px" }}
                        >
                          Master
                        </Typography>
                      </MenuItem>
                    </Link>
                  )}
                  {user.akses.pembelian === true && (
                    <Link to="/pembelian">
                      <MenuItem>
                        <Typography
                          variant="body2"
                          sx={{ paddingLeft: "70px" }}
                        >
                          Pembelian
                        </Typography>
                      </MenuItem>
                    </Link>
                  )}
                  {user.akses.penjualan === true && (
                    <Link to="/penjualan">
                      <MenuItem>
                        <Typography
                          variant="body2"
                          sx={{ paddingLeft: "70px" }}
                        >
                          Penjualan
                        </Typography>
                      </MenuItem>
                    </Link>
                  )}
                  {user.akses.laporan === true && (
                    <Link to="/laporan">
                      <MenuItem>
                        <Typography
                          variant="body2"
                          sx={{ paddingLeft: "70px" }}
                        >
                          Laporan
                        </Typography>
                      </MenuItem>
                    </Link>
                  )}
                  {user.akses.utility === true && (
                    <Link to="/daftarUser">
                      <MenuItem>
                        <Typography
                          variant="body2"
                          sx={{ paddingLeft: "70px" }}
                        >
                          Utility
                        </Typography>
                      </MenuItem>
                    </Link>
                  )}
                </SubMenu>
              </Menu>
            </Sidebar>
          )}
          <main>
            {user && (
              <Tooltip title="Menu">
                <MenuIcon
                  onClick={() => openMenuFunction()}
                  sx={sidebarIcon}
                  fontSize="large"
                />
              </Tooltip>
            )}
            <Box sx={contentWrapper}>
              <ErrorBoundary FallbackComponent={Fallback}>
                <Routes>
                  <Route path="/" />
                  <Route path="/login" element={<Login />} />
                  <Route path="/unauthorized" element={<Login />} />
                  {/* Daftar User */}
                  <Route
                    path="/daftarUser"
                    element={
                      <USERRoute>
                        <DaftarUser />
                      </USERRoute>
                    }
                  />
                  <Route
                    path="/daftarUser/:id"
                    element={
                      <USERRoute>
                        <DaftarUser />
                      </USERRoute>
                    }
                  />
                  {/* <Route
                    path="/daftarUser/:id/edit"
                    element={
                      <USERRoute>
                        <UbahUser />
                      </USERRoute>
                    }
                  /> */}
                  {/* <Route
                    path="/daftarUser/tambahUser"
                    element={
                      <USERRoute>
                        <TambahUser />
                      </USERRoute>
                    }
                  /> */}
                </Routes>
              </ErrorBoundary>
            </Box>
          </main>
        </div>
      </BrowserRouter>
    </Box>
  );
};

export default App;

const container = {
  display: "flex",
  height: "100%",
  minHeight: "100vh"
};

const sidebarIcon = {
  backgroundColor: Colors.grey300,
  borderRadius: "20px",
  padding: 1,
  marginLeft: 1,
  marginTop: 1,
  cursor: "pointer"
};
