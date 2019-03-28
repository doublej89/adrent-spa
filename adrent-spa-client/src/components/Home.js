import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import WorldMap from "../word-map.svg";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import SearchItem from "./search/SearchItem";
import { connect } from "react-redux";
import {
  getAll,
  getProductsByCat,
  getProductByLocation
} from "../actions/productActions";
import TopCategory from "./TopCategory";
import Typography from "@material-ui/core/Typography";
import PaginationActions from "./PaginationActions";
import TablePagination from "@material-ui/core/TablePagination";
import Search from "./search/Search";

const categories = [
  "SelectMedia",
  "Market",
  "Grocery",
  "University",
  "Hospital",
  "Train Station",
  "Clothing store"
];

const styles = {
  container: {
    flexGrow: 1
  },
  textField: {
    width: 292,
    backgroundColor: "white"
  },
  menu: {
    width: 200
  },
  cssOutlinedInput: {
    "&$cssFocused $notchedOutline": {
      borderColor: "#8ee0ff"
    }
  },
  cssFocused: {},
  notchedOutline: {},
  button: {
    height: 56,
    width: 292,
    marginTop: 16,
    borderRadius: 30
  },
  card: {
    width: "100%",
    heigth: "100%"
  },
  filterSection: {
    width: "90%",
    padding: 20,
    alignSelf: "center"
  }
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.searchByCategory = this.searchByCategory.bind(this);
    this.searchByLocation = this.searchByLocation.bind(this);
    this.initMap = this.initMap.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.handlePageClick = this.handlePageClick.bind(this);

    this.state = {
      category: "",
      productName: "",
      distance: 0,
      topCategories: [],
      page: 0,
      rowsPerPage: 5
    };
  }

  componentDidMount() {
    if (this.props.match.params.catagoryId) {
      this.searchByCategory(this.props.match.params.catagoryId);
    } else if (this.props.match.params.coords) {
      this.searchByLocation(this.props.match.params.coords);
    } else {
      this.props.getAll();
    }
    this.renderMap();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.products.length !== this.props.products.length) {
      this.renderMap();
    }
    const { products } = this.props;
    const { topCategories } = this.state;
    if (products) {
      products.forEach(prod => {
        if (prod.categories.length > 0) {
          prod.categories.forEach(cat => {
            let alreadyIncluded = topCategories.some(
              topcat => topcat._id == cat._id
            );
            if (cat.products.length > 1 && !alreadyIncluded) {
              this.setState({ topCategories: [...topCategories, cat] });
            }
          });
        }
      });
    }
  }

  searchByCategory(categoryId) {
    this.props.getProductsByCat(categoryId);
    this.renderMap();
  }

  searchByLocation(coords) {
    this.props.getProductByLocation(coords);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.getAll(this.state.productName, this.state.category);
    this.setState({
      category: "",
      productName: "",
      distance: 0
    });
    this.renderMap();
  }

  initMap() {
    var uluru = { lat: 23.8157559, lng: 90.3891032 };

    var map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: uluru
    });

    this.props.products.map(prod => {
      var infowindow = new window.google.maps.InfoWindow({
        content: prod.name
      });

      var marker = new window.google.maps.Marker({
        position: { lat: +prod.location.lat, lng: +prod.location.lng },
        map: map,
        title: prod.location.name
      });
      infowindow.open(map, marker);
    });
  }

  renderMap = () => {
    loadScript(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyAYTVzREXPWPP8TMxzklQsel1l2TcJkINs&callback=initMap"
    );
    window.initMap = this.initMap;
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };

  render() {
    const { products, classes, noMatch } = this.props;
    const { topCategories, page, rowsPerPage } = this.state;

    return (
      <div>
        <div
          style={{
            backgroundImage: `url(${WorldMap})`,
            height: "60vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
          }}
        >
          <div className={classes.filterSection}>
            <h2
              style={{
                fontSize: "3em",
                fontWeight: "normal",
                textAlign: "center",
                marginBottom: 0
              }}
            >
              Business Marketing Made Easy
            </h2>
            <p
              style={{
                fontSize: "2.5em",
                textAlign: "center",
                marginTop: 0,
                marginBottom: 0,
                fontWeight: "lighter"
              }}
            >
              Explore cities and find places with verified suppliers packages
            </p>
          </div>
          <Search
            handleSubmit={this.handleSubmit}
            handleChange={this.handleChange}
            category={this.state.category}
            productName={this.state.productName}
            distance={this.state.distance}
            categories={categories}
          />
        </div>
        <div className={classes.container}>
          <Grid style={{ height: "100%" }} container justify="center">
            <Grid style={{ height: "100%" }} item xs={11}>
              <Paper style={{ height: "100%", padding: 20 }}>
                <Grid container style={{ height: "100%" }}>
                  {noMatch ? (
                    <Typography gutterBottom variant="h4" component="h2">
                      {noMatch}
                    </Typography>
                  ) : null}
                  <Grid
                    style={{
                      maxHeight: 540,
                      display: "flex",
                      flexDirection: "column",
                      overflowY: "scroll"
                    }}
                    item
                    xs={12}
                    md={6}
                  >
                    <div>
                      {products
                        ? products
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map(prod => (
                              <SearchItem
                                key={prod._id}
                                product={prod}
                                handleCategorySearch={this.searchByCategory}
                                handleLocationSearch={this.searchByLocation}
                              />
                            ))
                        : null}
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div id="map" style={{ width: "100%", height: "100%" }} />
                  </Grid>
                </Grid>
                <div>
                  <TablePagination
                    style={{ borderBottom: "none" }}
                    rowsPerPageOptions={[5, 6]}
                    colSpan={3}
                    count={products.length}
                    rowsPerPage={5}
                    page={page}
                    SelectProps={{
                      native: true
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    ActionsComponent={PaginationActions}
                  />
                </div>
              </Paper>
            </Grid>
          </Grid>
        </div>
        <div style={{ padding: "0 50px", textAlign: "center" }}>
          <Typography
            style={{ fontWeight: 300, marginTop: 60, marginBottom: 30 }}
            variant="h4"
            gutterBottom
          >
            Top Category
          </Typography>
          <TopCategory topCategories={topCategories} />
        </div>
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

const mapStateToProps = state => {
  return {
    products: state.productStore.products,
    noMatch: state.productStore.noMatch
  };
};

export default connect(
  mapStateToProps,
  { getAll, getProductsByCat, getProductByLocation }
)(withStyles(styles)(Home));
