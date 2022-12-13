import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableUser } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import { SearchBar, Loader, usePagination } from "../../../components";
import {
  Box,
  TextField,
  Typography,
  Divider,
  Pagination,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox,
  FormGroup,
  FormControlLabel
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const DaftarUser = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kodeCabang, setKodeCabang] = useState("");
  const [username, setUsername] = useState("");
  const [isMaster, setMaster] = useState(false);
  const [isPembelian, setPembelian] = useState(false);
  const [isPenjualan, setPenjualan] = useState(false);
  const [isLaporan, setLaporan] = useState(false);
  const [isUtility, setUtility] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUser] = useState([]);
  const navigate = useNavigate();
  let isUserExist = username.length !== 0;

  const changeMaster = async () => {
    setMaster(!isMaster);
    await axios.post(`${tempUrl}/users/${id}`, {
      master: !isMaster,
      id: user._id,
      token: user.token
    });
  };

  const changePembelian = async () => {
    setPembelian(!isPembelian);
    await axios.post(`${tempUrl}/users/${id}`, {
      pembelian: !isPembelian,
      id: user._id,
      token: user.token
    });
  };

  const changePenjualan = async () => {
    setPenjualan(!isPenjualan);
    await axios.post(`${tempUrl}/users/${id}`, {
      penjualan: !isPenjualan,
      id: user._id,
      token: user.token
    });
  };

  const changeLaporan = async () => {
    setLaporan(!isLaporan);
    await axios.post(`${tempUrl}/users/${id}`, {
      laporan: !isLaporan,
      id: user._id,
      token: user.token
    });
  };

  const changeUtility = async () => {
    setUtility(!isUtility);
    await axios.post(`${tempUrl}/users/${id}`, {
      utility: !isUtility,
      id: user._id,
      token: user.token
    });
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = users.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.username.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tipeUser.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(users, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getUsers();
    id && getUserById();
  }, [id]);

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/users`, {
        tipeAdmin: user.tipeUser,
        id: user._id,
        token: user.token
      });
      setUser(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getUserById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/findUser/${id}`, {
        tipeAdmin: user.tipeUser,
        id: user._id,
        token: user.token
      });
      setUsername(response.data.username);
      setMaster(response.data.akses.master);
      setPembelian(response.data.akses.pembelian);
      setPenjualan(response.data.akses.penjualan);
      setLaporan(response.data.akses.laporan);
      setUtility(response.data.akses.utility);
    }
  };

  const deleteUser = async (id) => {
    try {
      setLoading(true);
      await axios.post(`${tempUrl}/users/deleteUser/${id}`, {
        tipeAdmin: user.tipeUser,
        id: user._id,
        token: user.token
      });
      getUsers();
      setUsername("");
      setKodeCabang("");
      setLoading(false);
      navigate("/daftarUser");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">User</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Daftar User
      </Typography>
      <Box sx={buttonModifierContainer}>
        <Button
          variant="contained"
          color="success"
          sx={{ bgcolor: "success.light", textTransform: "none" }}
          startIcon={<AddCircleOutlineIcon />}
          size="small"
          onClick={() => {
            navigate(`/daftarUser/tambahUser`);
          }}
        >
          Tambah
        </Button>
        {id && (
          <>
            <ButtonGroup variant="contained">
              <Button
                color="primary"
                startIcon={<EditIcon />}
                sx={{ textTransform: "none" }}
                onClick={() => {
                  navigate(`/daftarUser/${id}/edit`);
                }}
              >
                Ubah
              </Button>
              <Button
                color="error"
                startIcon={<DeleteOutlineIcon />}
                sx={{ textTransform: "none" }}
                onClick={handleClickOpen}
              >
                Hapus
              </Button>
            </ButtonGroup>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{`Hapus Data`}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  {`Yakin ingin menghapus data ${username}?`}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => deleteUser(id)}>Ok</Button>
                <Button onClick={handleClose}>Cancel</Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Box>
      <Divider sx={dividerStyle} />
      {isUserExist && (
        <>
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>Username</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={username}
              />
            </Box>
            <Box sx={[textFieldWrapper, secondWrapper]}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={isMaster} />}
                  label="Master"
                  onChange={() => changeMaster()}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={isPembelian} />}
                  label="Pembelian"
                  onChange={() => changePembelian()}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={isPenjualan} />}
                  label="Penjualan"
                  onChange={() => changePenjualan()}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={isLaporan} />}
                  label="Laporan"
                  onChange={() => changeLaporan()}
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={isUtility} />}
                  label="Utility"
                  onChange={() => changeUtility()}
                />
              </FormGroup>
            </Box>
          </Box>
          <Divider sx={dividerStyle} />
        </>
      )}
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableUser currentPosts={currentPosts} searchTerm={searchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <Pagination
          count={count}
          page={page}
          onChange={handleChange}
          color="primary"
          size={screenSize <= 600 ? "small" : "large"}
        />
      </Box>
    </Box>
  );
};

export default DaftarUser;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const dividerStyle = {
  pt: 4
};

const showDataContainer = {
  mt: 4,
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row"
  }
};

const showDataWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw"
  }
};

const searchBarContainer = {
  pt: 6,
  display: "flex",
  justifyContent: "center"
};

const tableContainer = {
  pt: 4,
  display: "flex",
  justifyContent: "center"
};

const labelInput = {
  fontWeight: "600",
  marginLeft: 1
};

const spacingTop = {
  mt: 4
};

const secondWrapper = {
  marginLeft: {
    sm: 4
  },
  marginTop: {
    sm: 0,
    xs: 4
  }
};

const downloadButtons = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const textFieldContainer = {
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row"
  }
};

const textFieldWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw"
  }
};
