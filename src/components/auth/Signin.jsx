import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { CardActions } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core/styles";
import auth from "./auth-helper";
import { Redirect } from "react-router-dom";
import ApiAuth from "../utils/ApiAuth";
import useReactRouter from "use-react-router";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { Link } from "react-router-dom";
import Box from "@material-ui/core/Box";
import PersonAddRoundedIcon from "@material-ui/icons/PersonAddTwoTone";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "0 auto",
  },
  button: {
    margin: theme.spacing(1),
    "&:hover": {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      backgroundColor: "#FFF00",
      color: "white",
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  passwordLink: {
    "&:hover": {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(15),
    paddingBottom: theme.spacing(2),
  },
  error: {
    verticalAlign: "middle",
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
  },
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: 300,
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
  forgottenPassword: {
    paddingLeft: theme.spacing(2),
  },
}));

export default function Signin() {
  const { location } = useReactRouter();
  const initialState = {
    email: "",
    password: "",
    error: "",
    redirectToReferrer: false,
    showPassword: false,
  };

  const [values, setValues] = useState(initialState);

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const clickSubmit = () => {
    console.log("SIGNING IN")
    const user = {
      email: values.email || undefined,
      password: values.password || undefined,
    };

    ApiAuth.SignIn(user).then((data) => {
      if (data.error) {
        setValues({
          error: data.error,
          email: user.email,
          password: user.password,
        });
      } else {
        auth.authenticate(data, () => {
          setValues({ redirectToReferrer: true });
        });
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({
      ...values,
      [name]: event.target.value,
    });
  };

  const classes = useStyles();

  const { from } = location.state || {
    from: {
      pathname: "/",
    },
  };
  if (values.redirectToReferrer) {
    return <Redirect to={from} />;
  }

  return (
    <form className={classes.root} noValidate>
      <Card className={classes.card}>
        <CardContent>
          <Typography
            type="headline"
            variant="h3"
            gutterBottom
            className={classes.title}
          >
            Logg inn
          </Typography>
          <TextField
            id="email"
            type="email"
            label="E-Post"
            className={classes.textField}
            value={values.email}
            onChange={handleChange("email")}
            margin="normal"
            autoComplete="email"
            variant="outlined"
          />
          <br />
          <TextField
            id="password"
            type={values.showPassword ? "text" : "password"}
            label="Passord"
            className={classes.textField}
            onChange={handleChange("password")}
            margin="normal"
            variant="outlined"
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <IconButton
                  variant="outlined"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              ),
              classes: {
                adornedEnd: classes.adornedEnd,
              },
            }}
          />
          <br />{" "}
          {values.error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>
                error
              </Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Box justifyContent="center">
            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={() => clickSubmit()}
              className={classes.button}
            >
              <VpnKeyIcon className={classes.extendedIcon} />
              Logg inn
            </Button>
            <Button
              color="default"
              variant="contained"
              aria-label="Registrer bruker"
              size="large"
              className={classes.button}
              href="/signup"
            >
              <PersonAddRoundedIcon className={classes.extendedIcon} />
              Ny bruker
            </Button>
            <p>
              <Link className={classes.passwordLink} to={"/resett-passord/"}>
                Glemt passord?
              </Link>
            </p>
          </Box>
        </CardActions>
      </Card>
    </form>
  );
}

// export default withStyles(styles)(Signin);
