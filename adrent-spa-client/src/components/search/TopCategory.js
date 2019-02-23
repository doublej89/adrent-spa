import React from "react";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import categoryImage from "../../images/category-bg-2.jpg";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  gridList: {
    width: "100%",
    height: 460
  },
  gridListRoot: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    overflow: "hidden"
  }
});

function TopCategory({ topCategories, classes }) {
  return (
    <div className={classes.gridListRoot}>
      <GridList
        cellHeight={320}
        className={classes.gridList}
        cols={8}
        spacing={20}
      >
        {topCategories.map(category => (
          <GridListTile key={category._id} cols={2}>
            <Link
              to={`/category/${category._id}`}
              style={{ textDecoration: "none" }}
            >
              <Grid
                container
                justify="center"
                alignItems="center"
                direction="column"
                style={{
                  backgroundImage: `url(${categoryImage})`,
                  backgroundSize: "cover",
                  padding: 30,
                  color: "white",
                  textAlign: "center",
                  height: "100%"
                }}
              >
                <Typography
                  style={{ color: "white" }}
                  variant="h4"
                  gutterBottom
                >
                  {category.name}
                </Typography>
                <p style={{ margin: 0 }}>{category.products.length} Products</p>
              </Grid>
            </Link>
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

export default withStyles(styles)(TopCategory);
