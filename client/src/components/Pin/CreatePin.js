import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";

const CreatePin = ({ classes }) => {
  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component="h2"
        variant="h4"
        color="secondary"
      >
        <LandscapeIcon className={classes.iconLarge} />
        標記地點
      </Typography>
      {/* 標題、上傳照片 */}
      <div className={classes.contentField}>
        <TextField name="title" label="標題" placeholder="輸入標題" />
        <input
          accept="image/*"
          id="image"
          type="file"
          className={classes.input}
        />
        <label htmlFor="image">
          <Button component="span" size="small" className={classes.button}>
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      {/* 內容 */}
      <div className={classes.contentField}>
        <TextField
          name="content"
          label="內容"
          multiline
          rows="6"
          margin="normal"
          fullWidth
          variant="outlined"
        ></TextField>
      </div>
      {/* 送出、取消按鈕 */}
      <div className={classes.contentField}>
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="primary"
        >
          <SaveIcon className={classes.buttonIcon} />
          保存
        </Button>
        <Button
          className={classes.button}
          style={{ marginLeft: "20px" }}
          variant="outlined"
        >
          <ClearIcon className={classes.buttonIcon} />
          取消
        </Button>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    display: "flex",
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 60,
    marginRight: theme.spacing.unit
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  button: {
    width: "100%",
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(CreatePin);
