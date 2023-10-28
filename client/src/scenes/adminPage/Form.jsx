import { useState } from "react";
import { Box, Button, TextField, useMediaQuery, Typography, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setadminLogin } from "state";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/adminlogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
   
    console.log(loggedInResponse);
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn.login === true) {
      dispatch(
        setadminLogin({
          
          admintoken: loggedIn.token,
        })
      );
      console.log("kkk");
      navigate("/adminPanel");
    } else {
      setSnackbarMessage(loggedIn.msg);
      setShowSnackbar(true);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
  };
  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };


  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesLogin}
      validationSchema={loginSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
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
                backgroundColor: palette.neutral.dark,
                color: palette.background.alt,
                "&:hover": { color: palette.neutral.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.neutral.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.neutral.light,
                },
              }}
            >
              {/* {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."} */}
            </Typography>
          </Box>
          <Snackbar
            open={showSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <SnackbarContent
              sx={{
                background: "#f44336", // Custom background color for the Snackbar
                color: "#ffffff", // Custom text color for the Snackbar
                fontWeight: "bold", // Custom font weight for the text
              }}
              message={snackbarMessage}
            />
          </Snackbar>
        </form>
      )}
    </Formik>
  );
};

export default Form;
