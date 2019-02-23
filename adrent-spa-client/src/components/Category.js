import React, { Component } from "react";
import { getProductsByCat } from "../actions/productActions";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  heroUnit: {
    backgroundColor: theme.palette.background.paper
  },
  heroContent: {
    maxWidth: 600,
    margin: "0 auto",
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardContent: {
    flexGrow: 1
  },
  categories: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    cursor: "pointer"
  },
  categoryItem: {
    padding: ".2em .6em .3em",
    fontSize: "75%",
    fontWeight: 700,
    lineHeight: 1,
    color: "#fff",
    textAlign: "center",
    whiteSpace: "nowrap",
    verticalAlign: "baseline",
    borderRadius: ".25em",
    backgroundColor: "#e1422c",
    marginRight: 4,
    marginBottom: 4
  },
  placeIcon: {
    fontSize: 14,
    marginRight: 5
  }
});

class Category extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      this.props.getProductsByCat(id);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.getProductsByCat(this.props.match.params.id);
    }
  }

  render() {
    const { products, categoryName, classes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <main>
          <div className={classes.heroUnit}>
            <div className={classes.heroContent}>
              <Typography
                component="h2"
                variant="h3"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                {categoryName}
              </Typography>
              <Typography
                variant="h6"
                align="center"
                color="textSecondary"
                paragraph
              >
                {products.length} Products
              </Typography>
            </div>
          </div>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <Grid container spacing={40}>
              {products.map(prod => (
                <Grid item key={prod._id} sm={6} md={4} lg={3}>
                  <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <Link
                        style={{ textDecoration: "none" }}
                        to={`/product/${prod._id}`}
                      >
                        <Typography gutterBottom variant="h5" component="h2">
                          {prod.name}
                        </Typography>
                      </Link>
                      <section className={classes.categories}>
                        {prod.categories.map((cat, indx) => (
                          <span className={classes.categoryItem} key={indx}>
                            <Link
                              style={{ textDecoration: "none", color: "white" }}
                              to={`/category/${cat._id}`}
                            >
                              {cat.name}
                            </Link>
                          </span>
                        ))}
                      </section>
                      <Typography variant="caption">
                        <Icon className={classes.placeIcon}>place</Icon>
                        {prod.location.locationName}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  products: state.productStore.products,
  categoryName: state.productStore.categoryName
});

export default connect(
  mapStateToProps,
  { getProductsByCat }
)(withStyles(styles)(Category));
