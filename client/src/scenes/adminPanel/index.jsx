import React, { useState, useEffect } from "react";
import Navbaradmin from "scenes/adminNavbar";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Form from "./Form";
import RegisterModal from "./Form";
import FlexBetween from "components/FlexBetween";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  Button,
  IconButton,
  InputBase
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useDispatch , useSelector } from "react-redux";
import { setadminLogout } from "state";
import { useNavigate } from "react-router-dom";

// import { Try } from "@mui/icons-material";

const AdminPanel = ({ onDelete, onBlockUnblock }) => {
  const [data, setData] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showForm] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false); // State variable to control RegisterModal visibility
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const token = useSelector((state)=> state.admintoken)
  const navigate = useNavigate();
  const dispatch = useDispatch()



  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async () => {
    try {
      console.log("Search term:", searchTerm);
      let searchterm = searchTerm;
      const response = await fetch("http://localhost:3001/admin/searchuser", {
        method: "POST",
        body: JSON.stringify({ searchterm }),
        headers: {
          Authorization: `Bearer ${token}`,"Content-Type": "application/json"
        }
      });
      const jsonData = await response.json();
      console.log(jsonData);
      if (jsonData.error){
        dispatch(setadminLogout())
        navigate('/admin')
      }
      else{
        setData(jsonData);
      }
      
    } catch (error) {}
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3001/admin/userlist",{
        headers: {
          Authorization: `Bearer ${token}`, "Content-Type": "application/json"
        }
        });
        const jsonData = await response.json();
        if (jsonData.error){
          dispatch(setadminLogout())
          navigate('/admin')
        }
        else{
          setData(jsonData);
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };
  const handleToggleRegisterModal = () => {
    setShowRegisterModal(!showRegisterModal);
  };
  onDelete = async (userid) => {
    try {
      const response = await fetch("http://localhost:3001/admin/deleteuser", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,"Content-Type": "application/json"
        },
        body: JSON.stringify({ userid })
      });
      const jsonData = await response.json();
      if (jsonData.error){
        dispatch(setadminLogout())
        navigate('/admin')
      }
      else{
        setData(jsonData);
      }

      if (response.ok) {
        console.log("User deleted successfully");
        setSnackbarMessage("User deleted successfully");
        setShowSnackbar(true);
      } else {
        console.error("Error deleting user:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  onBlockUnblock = async (userid) => {
    try {
      const response = await fetch("http://localhost:3001/admin/blockuser", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,"Content-Type": "application/json"
        },
    
        body: JSON.stringify({ userid })
      });
      const jsonData = await response.json();
      if (jsonData.error){
        dispatch(setadminLogout())
        navigate('/admin')
      }
      else{
        setData(jsonData);
      }
      // if (response.ok) {
      //   console.log("Userblocked successfully");
      // }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box>
      <Navbaradmin />
      <Box display="flex" alignItems="center" gap="20px">
        <Button
          variant="contained"
          onClick={() => handleToggleRegisterModal()}
          sx={{
            marginLeft: "50px",
            marginTop: "10px",
            fontWeight: "bold",
            borderRadius: "5px",
            padding: "15px 25px",
            color: "white",
            backgroundColor: "gray",
            "&:hover": {
              backgroundColor: "white",
              color: "black"
            }
          }}
        >
          Create
        </Button>
        {showForm && <Form />}
        <FlexBetween
          backgroundColor={neutralLight}
          borderRadius="5px"
          gap="0.5rem"
          padding="0.1rem 1rem"
          alignItems="center"
          sx={{ height: "100%", width: "200px" }} // Adjust the width of the search input
        >
          <InputBase
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1 }}
          />

          <IconButton>
            <Search onClick={handleSearch} />
          </IconButton>
        </FlexBetween>
      </Box>

      <hr></hr>
      <TableContainer
        component={Box}
        sx={{
          maxWidth: "774px", // Adjust the maximum width as per your requirement
          maxHeight: "750px", // Adjust the maximum height as per your requirement
          overflow: "auto", // Enable scroll for smaller table
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          margin: "auto",
          marginTop: "40px"
        }}
      >
        <Table>
          <TableHead sx={{ background: "black" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                <strong>First Name</strong>
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                <strong>Location</strong>
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                <strong>Email</strong>
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                <strong>Block/Unblock</strong>
              </TableCell>{" "}
              {/* Optional */}
              <TableCell
                align="center"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                <strong>Delete</strong>
              </TableCell>{" "}
             
              {/* Optional */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.location}</TableCell>
                <TableCell>{user.email}</TableCell>

                {/* Uncomment the following code if you want to include the Block/Unblock and Delete buttons */}
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    onClick={() => onBlockUnblock(user._id)}
                    sx={{
                      color: "white", // Text color of the button
                      backgroundColor: user.block ? "green" : "orange", // Background color of the button
                      "&:hover": {
                        backgroundColor: user.block ? "darkgreen" : "darkred" // Hover background color
                      }
                    }}
                  >
                    {user.block ? "Unblock" : "Block"}
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    onClick={() => onDelete(user._id)}
                    sx={{
                      color: "white", // Text color of the button
                      backgroundColor: "red", // Background color of the button
                      "&:hover": {
                        backgroundColor: "darkred" // Hover background color
                      }
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
            
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <RegisterModal
        setData={setData}
        open={showRegisterModal}
        onClose={handleToggleRegisterModal}
      />

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "top", // Position the Snackbar at the top
          horizontal: "right" // Center the Snackbar horizontally
        }}
      >
        <SnackbarContent
          sx={{
            background: "#4caf50", // Custom background color for the Snackbar
            color: "#fffff", // Custom text color for the Snackbar
            fontWeight: "bold" // Custom font weight for the text
          }}
          message={snackbarMessage}
        />
      </Snackbar>
    </Box>
  );
};

export default AdminPanel;
