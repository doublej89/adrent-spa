import React, { Component } from "react";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const styles = {
  categories: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    cursor: "pointer"
  },
  category: {
    marginRight: 16
  },
  placeIcon: {
    fontSize: 14,
    marginRight: 5
  },
  location: {
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline"
    }
  },
  productName: {
    textDecoration: "none"
  },
  nameText: {
    "&:hover": {
      color: "#919191"
    }
  }
};

function SearchItem(props) {
  const {
    classes,
    product,
    handleCategorySearch,
    handleLocationSearch
  } = props;
  const coords = `${product && product.location ? product.location.lat : 0},${
    product && product.location ? product.location.lng : 0
  }`;

  return (
    <Card style={{ border: "1px solid #e8e8e8", marginBottom: 10 }}>
      <CardContent>
        <Link to={`/product/${product._id}`} className={classes.productName}>
          <Typography
            className={classes.nameText}
            gutterBottom
            variant="h5"
            component="h2"
          >
            {product.name}
          </Typography>
        </Link>
        <section className={classes.categories}>
          {product.categories.map((cat, indx) => (
            <Typography
              variant="caption"
              gutterBottom
              color="primary"
              className={classes.category}
              key={indx}
              onClick={() => handleCategorySearch(cat._id)}
            >
              {cat.name}
            </Typography>
          ))}
        </section>
        <Typography
          onClick={() => handleLocationSearch(coords)}
          className={classes.location}
          variant="caption"
          gutterBottom
        >
          <Icon className={classes.placeIcon}>place</Icon>
          {product.location.locationName}
        </Typography>
        {product.current_price.length > 0
          ? product.current_price.map((price, indx) => (
              <Typography key={indx} variant="subtitle1" gutterBottom>
                {`${price.amount} ${price.duration}`}
              </Typography>
            ))
          : null}

        <Typography variant="body1" gutterBottom>
          {product.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default withStyles(styles)(SearchItem);
