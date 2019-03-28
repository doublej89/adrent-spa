import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

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

function Search(props) {
  const {
    handleSubmit,
    handleChange,
    category,
    productName,
    distance,
    categories,
    classes
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id="outlined-select-media-native"
        select
        className={classes.textField}
        SelectProps={{
          native: true,
          MenuProps: {
            className: classes.menu
          }
        }}
        InputProps={{
          classes: {
            root: classes.cssOutlinedInput,
            focused: classes.cssFocused,
            notchedOutline: classes.notchedOutline
          }
        }}
        helperText="Please select a media"
        margin="normal"
        variant="outlined"
        name="category"
        value={category}
        onChange={handleChange}
      >
        {categories.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </TextField>
      <TextField
        id="outlined-with-placeholder"
        InputProps={{
          classes: {
            root: classes.cssOutlinedInput,
            focused: classes.cssFocused,
            notchedOutline: classes.notchedOutline
          }
        }}
        placeholder="Ex. Dhaka or Mohakhali Bus stand"
        className={classes.textField}
        margin="normal"
        variant="outlined"
        name="productName"
        value={productName}
        onChange={handleChange}
      />

      <TextField
        type="number"
        className={classes.textField}
        margin="normal"
        placeholder="Location Range in KM"
        variant="outlined"
        InputProps={{
          classes: {
            root: classes.cssOutlinedInput,
            focused: classes.cssFocused,
            notchedOutline: classes.notchedOutline
          }
        }}
        name="distance"
        value={distance}
        onChange={handleChange}
      />
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        type="submit"
      >
        Search
      </Button>
    </form>
  );
}

export default withStyles(styles)(Search);
