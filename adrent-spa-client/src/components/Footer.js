import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

const styles = {
  btn: {
    fontSize: 18,
    borderRadius: 30,
    border: "1px solid #fff"
  },
  footer: {
    backgroundSize: "40%",
    textAlign: "center",
    padding: "30px 0"
  },
  links: {
    display: "inline-block",
    padding: 10
  }
};

function Footer(props) {
  const { classes } = props;
  return (
    <div style={{ backgroundColor: "#e1422c", padding: "0 50px", marginTop: 50 }}>
      <Grid container spacing={40}>
        <Grid item xs={12} sm={4}>
          <h4 style={{ color: "#fff", fontSize: 18 }}>
            Adrent is common playground for all user agency and supplier.
          </h4>
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          style={{ display: "flex", alignItems: "center" }}
        >
          <Grid container justify="flex-start">
            <Grid item sm={4}>
              <Button
                variant="contained"
                color="primary"
                className={classes.btn}
              >
                Become a Supplier
              </Button>
            </Grid>
            <Grid item sm={4}>
              <Button
                variant="contained"
                color="primary"
                className={classes.btn}
              >
                Become an Agency
              </Button>
            </Grid>
            <Grid item sm={4}>
              <Button
                variant="contained"
                color="primary"
                className={classes.btn}
              >
                Become a User
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <footer className={classes.footer}>
        <h1 style={{ color: "white", fontSize: 36 }}>Adrent</h1>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <Link style={{ color: "white" }} to="/">
              Home
            </Link>
          </li>
          <li>
            <a href="#">Privacy Policy</a>
          </li>
        </ul>
        <div>
          <p>
            <u>
              <Link style={{ color: "white" }} to="/">
                Adrent
              </Link>
            </u>{" "}
            Reach Everyone
          </p>
          <p>
            &copy; &nbsp;
            <Link style={{ color: "white" }} to="/">
              Adrent2019
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default withStyles(styles)(Footer);
