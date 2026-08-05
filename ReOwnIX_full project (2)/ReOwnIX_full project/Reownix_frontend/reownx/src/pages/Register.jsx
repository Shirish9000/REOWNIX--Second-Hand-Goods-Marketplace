import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useColorMode } from '../context/ThemeContext';

import {
  Globe,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';

import { motion } from 'framer-motion';

import AuthShowcase from '../components/auth/AuthShowcase';
import AuthFooter from '../components/auth/AuthFooter';


const schema = yup.object({
  firstName: yup
    .string()
    .required('First name is required'),

  lastName: yup
    .string()
    .required('Last name is required'),

  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),

  password: yup
    .string()
    .required('Password is required')
    .min(
      6,
      'Password must be at least 6 characters'
    ),

  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf(
      [yup.ref('password'), null],
      'Passwords must match'
    ),

  phone: yup.string().notRequired(),

  address: yup.string().notRequired(),
});


const Register = () => {

  const {
    register: registerUser
  } = useAuth();


  const {
    mode
  } = useColorMode();


  const navigate = useNavigate();


  const [
    showPassword,
    setShowPassword
  ] = useState(false);


  const [
    showConfirmPassword,
    setShowConfirmPassword
  ] = useState(false);



  const {
    register,
    handleSubmit,
    formState:{
      errors,
      isSubmitting
    }

  } = useForm({

    resolver:yupResolver(schema)

  });



  const onSubmit = async(data)=>{

    try{

      const {
        confirmPassword,
        ...payload
      } = data;


      await registerUser({

        ...payload,

        phone:
          payload.phone || '',

        address:
          payload.address || ''

      });


      navigate(
        '/login',
        {
          replace:true
        }
      );


    }catch(err){

      console.error(err);

    }

  };



return (

<Box
sx={{
minHeight:'calc(100vh - 64px)',
display:'flex',
flexDirection:'column',
bgcolor:
mode==='light'
?'#F8FAFC'
:'background.default'
}}
>


<Grid container sx={{flex:1}}>


<Grid item xs={12} md={6}>

<AuthShowcase/>

</Grid>



<Grid
item
xs={12}
md={6}
sx={{
display:'flex',
alignItems:'center',
justifyContent:'center',
p:{
xs:3,
md:6
},
bgcolor:
mode==='light'
?'#ffffff'
:'background.paper'
}}
>


<motion.div

initial={{
opacity:0,
y:20
}}

animate={{
opacity:1,
y:0
}}

transition={{
duration:0.5
}}

style={{
width:'100%',
maxWidth:440
}}

>


<Box>


<Typography
variant="h4"
fontWeight="900"
gutterBottom
>

Create an account

</Typography>



<Typography
color="text.secondary"
sx={{
mb:4
}}
>

Join ReOwnIX to buy and sell premium items.

</Typography>


<Box sx={{mb:3}}>


<Button

fullWidth

variant="outlined"

startIcon={
<Globe size={20}/>
}

>

Sign up with Google

</Button>


</Box>


<Box
sx={{
display:'flex',
alignItems:'center',
mb:3
}}
>

<Divider sx={{flexGrow:1}}/>

<Typography
sx={{mx:2}}
>

OR

</Typography>

<Divider sx={{flexGrow:1}}/>

</Box>
<Box
component="form"
onSubmit={handleSubmit(onSubmit)}
noValidate
>

<Grid container spacing={2}>


<Grid item xs={12} sm={6}>

<TextField

required

fullWidth

id="firstName"

placeholder="First Name"

autoComplete="given-name"

{...register('firstName')}

error={!!errors.firstName}

helperText={
errors.firstName?.message
}

/>

</Grid>



<Grid item xs={12} sm={6}>

<TextField

required

fullWidth

id="lastName"

placeholder="Last Name"

autoComplete="family-name"

{...register('lastName')}

error={!!errors.lastName}

helperText={
errors.lastName?.message
}

/>

</Grid>



<Grid item xs={12}>

<TextField

required

fullWidth

id="email"

placeholder="Email Address"

autoComplete="email"

{...register('email')}

error={!!errors.email}

helperText={
errors.email?.message
}

/>

</Grid>



<Grid item xs={12} sm={6}>


<TextField

required

fullWidth

id="password"

placeholder="Password"

type={
showPassword
? "text"
: "password"
}

{...register('password')}

error={
!!errors.password
}

helperText={
errors.password?.message
}



slotProps={{

input:{

endAdornment:(

<InputAdornment position="end">


<IconButton

data-testid="eye-icon"

aria-label="toggle password visibility"

onClick={() =>
setShowPassword(
prev => !prev
)
}

edge="end"

size="small"

>


{
showPassword
?
<EyeOff size={18}/>
:
<Eye size={18}/>
}


</IconButton>


</InputAdornment>

)

}

}}


/>


</Grid>





<Grid item xs={12} sm={6}>


<TextField

required

fullWidth

id="confirmPassword"

placeholder="Confirm Password"

type={
showConfirmPassword
?
"text"
:
"password"
}


{...register('confirmPassword')}


error={
!!errors.confirmPassword
}


helperText={
errors.confirmPassword?.message
}



slotProps={{

input:{

endAdornment:(

<InputAdornment position="end">


<IconButton


data-testid="eye-icon"


aria-label="toggle confirm password visibility"


onClick={() =>

setShowConfirmPassword(
prev => !prev
)

}


edge="end"


size="small"


>


{
showConfirmPassword

?

<EyeOff size={18}/>

:

<Eye size={18}/>

}


</IconButton>



</InputAdornment>

)

}

}}


/>


</Grid>


</Grid>



<motion.div

whileHover={{
scale:1.01
}}

whileTap={{
scale:0.99
}}

>


<Button

type="submit"

fullWidth

variant="contained"

disabled={isSubmitting}

sx={{

mt:2,

py:1.8,

borderRadius:3,

fontWeight:700,

textTransform:'none'

}}

>


{
isSubmitting

?

"Creating account..."

:

"Create Account"

}


</Button>


</motion.div>



<Box

sx={{

textAlign:'center',

mt:4

}}

>


<Typography variant="body2">


Already have an account?


{' '}


<Link

to="/login"

style={{

color:'#2563EB',

textDecoration:'none',

fontWeight:700

}}

>


Sign in instead


</Link>



</Typography>



</Box>


</Box>
<Box

sx={{

mt:5,

display:'flex',

alignItems:'center',

gap:2,

p:2,

bgcolor:
'rgba(37,99,235,0.05)',

borderRadius:3

}}

>


<ShieldCheck

size={24}

color="#2563EB"

/>


<Box>


<Typography

variant="body2"

fontWeight="700"

>


We keep your data safe and secure.


</Typography>



<Typography

variant="caption"

color="text.secondary"

>


Your privacy is our priority.


</Typography>



</Box>


</Box>


</Box>


</motion.div>



</Grid>


</Grid>



<AuthFooter />


</Box>


);


};


export default Register;