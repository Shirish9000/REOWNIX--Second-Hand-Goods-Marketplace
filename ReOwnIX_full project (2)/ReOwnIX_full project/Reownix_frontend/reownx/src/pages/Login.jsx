import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useColorMode } from "../context/ThemeContext";

import {
  Globe,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

import { motion } from "framer-motion";

import AuthShowcase from "../components/auth/AuthShowcase";
import AuthFooter from "../components/auth/AuthFooter";


const schema = yup.object().shape({

  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),

  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),

});


const Login = () => {

  const { login } = useAuth();

  const { mode } = useColorMode();

  const navigate = useNavigate();

  const location = useLocation();

  const { from } =
    location.state || {
      from: {
        pathname: "/",
      },
    };


  const [showPassword, setShowPassword] =
    useState(false);



  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({

    resolver: yupResolver(schema),

  });



  const onSubmit = async (data) => {

    try {

      await login(data);

      navigate(
        from.pathname,
        {
          replace:true,
        }
      );


    } catch(err){

      console.error(err);

    }

  };



  return (

    <Box
      sx={{
        minHeight:"calc(100vh - 64px)",
        display:"flex",
        flexDirection:"column",
        bgcolor:
          mode==="light"
            ? "#F8FAFC"
            :"background.default",
      }}
    >

      <Grid
        container
        sx={{
          flex:1,
        }}
      >

        <Grid
          item
          xs={12}
          md={6}
        >

          <AuthShowcase />

        </Grid>



        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            p:{
              xs:3,
              md:8,
            },
            bgcolor:
              mode==="light"
                ? "#ffffff"
                :"background.paper",
          }}
        >


          <motion.div

            initial={{
              opacity:0,
              y:20,
            }}

            animate={{
              opacity:1,
              y:0,
            }}

            transition={{
              duration:0.5,
            }}

            style={{
              width:"100%",
              maxWidth:440,
            }}

          >


            <Box>


              <Typography
                variant="h4"
                fontWeight="900"
                gutterBottom
              >

                Welcome back!

              </Typography>


              <Typography
                color="text.secondary"
                sx={{
                  mb:4,
                }}
              >

                Login to continue to ReOwnIX

              </Typography>


              <Button
                fullWidth
                variant="outlined"
                startIcon={
                  <Globe
                    size={20}
                    color="#2563EB"
                  />
                }
              >

                Continue with Google

              </Button>


              <Box
                sx={{
                  display:"flex",
                  alignItems:"center",
                  my:3,
                }}
              >

                <Divider sx={{flexGrow:1}}/>

                <Typography
                  sx={{
                    mx:2,
                  }}
                >
                  OR
                </Typography>

                <Divider sx={{flexGrow:1}}/>

              </Box>
                            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
              >

                <TextField

                  fullWidth

                  placeholder="Email address"

                  id="email"

                  autoComplete="email"

                  {...register("email")}

                  error={!!errors.email}

                  helperText={
                    errors.email?.message
                  }

                  sx={{
                    mb:3,
                  }}

                />



               <TextField
  fullWidth
  placeholder="Password"
  id="password"
  type={showPassword ? "text" : "password"}
  autoComplete="current-password"
  {...register("password")}
  error={!!errors.password}
  helperText={errors.password?.message}
  slotProps={{
    input: {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            data-testid="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            edge="end"
            size="small"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </IconButton>
        </InputAdornment>
      ),
    },
  }}
  sx={{
    mb: 2,
  }}
/>




                <Box

                  sx={{

                    display:"flex",

                    justifyContent:"space-between",

                    mb:4,

                  }}

                >

                  <Typography>

                    Remember me

                  </Typography>


                  <Typography

                    color="primary"

                  >

                    Forgot password?

                  </Typography>


                </Box>




                <Button

                  fullWidth

                  type="submit"

                  variant="contained"

                  disabled={isSubmitting}

                >

                  {
                    isSubmitting
                      ?
                      "Logging in..."
                      :
                      "Login"
                  }


                </Button>




                <Box

                  sx={{

                    textAlign:"center",

                    mt:4,

                  }}

                >

                  <Typography>

                    Don't have an account?{" "}


                    <Link to="/register">

                      Sign up

                    </Link>


                  </Typography>


                </Box>



              </Box>




              <Box

                sx={{

                  mt:5,

                  display:"flex",

                  gap:2,

                  alignItems:"center",

                }}

              >

                <ShieldCheck

                  size={24}

                  color="#2563EB"

                />


                <Typography>

                  We keep your data safe and secure.

                </Typography>


              </Box>



            </Box>


          </motion.div>


        </Grid>


      </Grid>



      <AuthFooter />


    </Box>


  );

};


export default Login;