import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Modal
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required")
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: ""
};

const register = async (values, onSubmitProps, setData, onClose) => {
  const formData = new FormData();
  for (let value in values) {
    formData.append(value, values[value]);
  }
  formData.append("picturePath", values.picture.name);
  const savedUserResponse = await fetch("http://localhost:3001/auth/register", {
    method: "POST",
    body: formData,
   

  });
  const savedUser = await savedUserResponse.json();
  console.log(savedUser);
  let users = savedUser.users;
  console.log("users", users);
  onSubmitProps.resetForm();
  onClose(false);
  setData(users);
};

const RegisterModal = ({ setData, open, onClose }) => {
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage] = useState("");

  const handleFormSubmit = async (values, onSubmitProps) => {
    await register(values, onSubmitProps, setData, onClose);
  };

  const handleCloseSnackbar = () => {
    console.log("close");
    setShowSnackbar(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValuesRegister}
        validationSchema={registerSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm
        }) => (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isNonMobile ? "400px" : "90%",
              backgroundColor: "#ffffff",
              padding: "2rem",
              borderRadius: "5px"
            }}
          >
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }
                }}
              >
                <>
                  <TextField
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={
                      Boolean(touched.firstName) && Boolean(errors.firstName)
                    }
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    error={
                      Boolean(touched.lastName) && Boolean(errors.lastName)
                    }
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Location"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.location}
                    name="location"
                    error={
                      Boolean(touched.location) && Boolean(errors.location)
                    }
                    helperText={touched.location && errors.location}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    label="Occupation"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.occupation}
                    name="occupation"
                    error={
                      Boolean(touched.occupation) && Boolean(errors.occupation)
                    }
                    helperText={touched.occupation && errors.occupation}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <Box
                    gridColumn="span 4"
                    border={`1px solid ${palette.neutral.medium}`}
                    borderRadius="5px"
                    p="1rem"
                  >
                    <Dropzone
                      acceptedFiles=".jpg,.jpeg,.png"
                      multiple={false}
                      onDrop={(acceptedFiles) =>
                        setFieldValue("picture", acceptedFiles[0])
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <Box
                          {...getRootProps()}
                          border={`2px dashed ${palette.neutral.main}`}
                          p="1rem"
                          sx={{ "&:hover": { cursor: "pointer" } }}
                        >
                          <input {...getInputProps()} />
                          {!values.picture ? (
                            <p>Add Picture Here</p>
                          ) : (
                            <FlexBetween>
                              <Typography>{values.picture.name}</Typography>
                              <EditOutlinedIcon />
                            </FlexBetween>
                          )}
                        </Box>
                      )}
                    </Dropzone>
                  </Box>
                </>
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
              </Box>

              {/* BUTTONS */}
              <Box>
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    m: "2rem 0",
                    p: "1rem",
                    backgroundColor: palette.neutral.main,
                    color: palette.background.alt,
                    "&:hover": { color: palette.neutral.main }
                  }}
                >
                  {"REGISTER"}
                </Button>
                <Typography
                  onClick={onClose}
                  sx={{
                    textDecoration: "underline",
                    color: palette.neutral.main,
                    "&:hover": {
                      cursor: "pointer",
                      color: palette.neutral.light
                    }
                  }}
                >
                  {"Cancel"}
                </Typography>
              </Box>
              <Snackbar
                open={showSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
              >
                <SnackbarContent
                  sx={{
                    background: "#f44336", // Custom background color for the Snackbar
                    color: "#ffffff", // Custom text color for the Snackbar
                    fontWeight: "bold" // Custom font weight for the text
                  }}
                  message={snackbarMessage}
                />
              </Snackbar>
            </form>
          </Box>
        )}
      </Formik>
    </Modal>
  );
};

export default RegisterModal;
