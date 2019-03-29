import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import ListSubheader from "@material-ui/core/ListSubheader";
import { connect } from "react-redux";
import { getProduct } from "../actions/productActions";
import isEmpty from "../utils/isEmpty";
import { Link } from "react-router-dom";

const styles = {
  map: {
    width: "100%",
    maxHeight: 300,
    minHeight: 210
  },
  placeIcon: {
    fontSize: 14,
    marginRight: 5
  },
  dimentions: {
    color: "#11ab1d"
  },
  buttons: {
    paddingTop: 16,
    paddingBottom: 16,
    marginRight: 8
  },
  nearby: {
    backgroundColor: "#D2B486",
    height: "100%",
    padding: 30,
    color: "white",
    textAlign: "center"
  },
  gridList: {
    width: "100%",
    height: 460
  },
  gridListRoot: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around"
  },
  category: {
    color: "#e1422c",
    "&:hover": {
      borderBottom: "1px solid #e1422c"
    }
  }
};

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.initMap = this.initMap.bind(this);
  }

  componentDidMount() {
    let id = this.props.match.params.id;
    this.props.getProduct(id);
    this.renderMap();
  }

  componentDidUpdate() {
    this.renderMap();
  }

  initMap() {
    const { product } = this.props;
    if (product && product.location) {
      var canter = {
        lat: +product.location.lat,
        lng: +product.location.lng
      };

      var map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: canter
      });

      var infowindow = new window.google.maps.InfoWindow({
        content: product.name
      });

      var marker = new window.google.maps.Marker({
        position: {
          lat: +product.location.lat,
          lng: +product.location.lng
        },
        map: map,
        title: product.location.name
      });
      infowindow.open(map, marker);
    }
  }

  renderMap = () => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${
        process.env.REACT_APP_GOOGLE_API_KEY
      }&callback=initMap`
    );
    window.initMap = this.initMap;
  };

  render() {
    const { classes } = this.props;
    const { product } = this.props;

    return (
      <div>
        <section className={classes.map} id="map" />
        <Grid container justify="center">
          <Grid item xs={10}>
            <Paper style={{ padding: 32 }}>
              <Grid container>
                <Grid item xs={12} md={6} style={{ padding: 28 }}>
                  <div className={classes.gridListRoot}>
                    <GridList
                      cellHeight={200}
                      className={classes.gridList}
                      cols={3}
                    >
                      <GridListTile
                        key="Subheader"
                        cols={3}
                        style={{ height: "auto" }}
                      >
                        <ListSubheader component="div">
                          Nearby Landmarks
                        </ListSubheader>
                      </GridListTile>
                      {!isEmpty(product)
                        ? product.nearby_landmarks.map((landmark, indx) => (
                            <GridListTile key={indx} col={1}>
                              <Grid
                                container
                                justify="center"
                                alignItems="center"
                                className={classes.nearby}
                                direction="column"
                              >
                                {/* <div>{landmark.icon_hint}</div> */}
                                <Icon
                                  className={`fas fa-${landmark.icon_hint}`}
                                />
                                <div>{landmark.dist} km</div>
                                <div>{landmark.name}</div>
                              </Grid>
                            </GridListTile>
                          ))
                        : null}
                    </GridList>
                  </div>
                </Grid>
                {!isEmpty(product) ? (
                  <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <Icon className={classes.placeIcon}>place</Icon>
                      {product.location.locationName}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {product.description}
                    </Typography>
                    <Grid container justify="flex-start" spacing={24}>
                      <Grid item xs={4}>
                        <Typography variant="h6" gutterBottom>
                          Status
                        </Typography>
                        <Typography
                          className={classes.dimentions}
                          variant="h5"
                          gutterBottom
                        >
                          {product.status}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="h6" gutterBottom>
                          Size
                        </Typography>
                        <Typography
                          className={classes.dimentions}
                          variant="h5"
                          gutterBottom
                        >
                          {product.size}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="h6" gutterBottom>
                          Sides
                        </Typography>
                        <Typography
                          className={classes.dimentions}
                          variant="h5"
                          gutterBottom
                        >
                          {product.sides}
                        </Typography>
                      </Grid>
                    </Grid>
                    {product.current_price.length > 0 ? (
                      <div>
                        <Typography variant="h6" gutterBottom>
                          Current prices
                        </Typography>
                        <Table className={classes.table}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Amount</TableCell>
                              <TableCell align="left">Duration</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {product.current_price.map(price => (
                              <TableRow key={price._id}>
                                <TableCell component="th" scope="row">
                                  {price.amount}
                                </TableCell>
                                <TableCell align="left">
                                  {price.duration}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : null}
                    <Grid
                      style={{ marginTop: 24, marginBottom: 32 }}
                      container
                      direction="row"
                    >
                      <Button
                        className={classes.buttons}
                        variant="contained"
                        color="primary"
                      >
                        Booking
                      </Button>
                      <Button
                        className={classes.buttons}
                        variant="contained"
                        color="primary"
                      >
                        <Icon className={classes.placeIcon}>favorite</Icon>
                      </Button>
                    </Grid>
                    <Typography variant="h5" gutterBottom>
                      Viewers Statistics
                    </Typography>
                    <Table className={classes.table}>
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row">
                            Area Type
                          </TableCell>
                          <TableCell align="left">
                            {product.viewers_statistics.area_type}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">
                            Area Size
                          </TableCell>
                          <TableCell align="left">
                            {product.viewers_statistics.area_size}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">
                            Total Population
                          </TableCell>
                          <TableCell align="left">
                            {product.viewers_statistics.total_population}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">
                            Male
                          </TableCell>
                          <TableCell align="left">
                            {product.viewers_statistics.male}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">
                            Female
                          </TableCell>
                          <TableCell align="left">
                            {product.viewers_statistics.female}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">
                            Annual Household Income
                          </TableCell>
                          <TableCell align="left">
                            {product.viewers_statistics.ann_household_income}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>
                ) : null}
              </Grid>
              <Typography
                variant="h4"
                style={{ fontWeight: 300, marginBottom: 28 }}
              >
                Categories
              </Typography>
              {product.categories ? (
                <Grid container direction="row">
                  {product.categories.map(cat => (
                    <Link
                      key={cat._id}
                      style={{ marginRight: 24, textDecoration: "none" }}
                      to={`/search/${cat._id}`}
                    >
                      <Typography className={classes.category} variant="h5">
                        {cat.name}
                      </Typography>
                    </Link>
                  ))}
                </Grid>
              ) : null}
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

function loadScript(url) {
  var index = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

const mapStateToProps = state => ({
  product: state.productStore.product
});

export default connect(
  mapStateToProps,
  { getProduct }
)(withStyles(styles)(ProductDetails));
