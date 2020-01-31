import React, { useState, useContext } from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import Context from "../../context";
import { useClient } from "../../client";
import { CREATE_PIN_MUTATION } from "../../graphql/mutations";

const CreatePin = ({ classes }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "geopins");
    data.append("cloud_name", "marsimage");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/marsimage/image/upload",
      data
    );
    return res.data.url;
  };

  const handleSubmit = async event => {
    try {
      event.preventDefault();
      setSubmitting(true);

      const url = await handleImageUpload();
      const { latitude, longitude } = state.draft;
      const pinData = { title, content, image: url, latitude, longitude };
      const { createPin } = await client.request(CREATE_PIN_MUTATION, pinData);
      console.log("Pin created", { createPin });
      dispatch({ type: "CREATE_PIN", payload: createPin });
      handleDeleteDraft();
    } catch (err) {
      setSubmitting(false);
      console.error("Error creating pin", err);
    }
  };

  const handleDeleteDraft = () => {
    setTitle("");
    setImage("");
    setContent("");
    dispatch({ type: "DELETE_DRAFT" });
  };

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component="h2"
        variant="h4"
        color="primary"
      >
        <LandscapeIcon className={classes.iconLarge} />
        標記地點
      </Typography>
      {/* 標題、上傳照片 */}
      <div className={classes.contentField}>
        <TextField
          name="title"
          label="標題"
          value={title}
          placeholder="輸入標題"
          onChange={e => setTitle(e.target.value)}
        />
        <input
          accept="image/*"
          id="image"
          type="file"
          className={classes.input}
          onChange={e => setImage(e.target.files[0])}
        />
        <label htmlFor="image">
          <Button
            color={image ? "primary" : "default"}
            component="span"
            size="small"
            className={classes.button}
          >
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
          value={content}
          onChange={e => setContent(e.target.value)}
        ></TextField>
      </div>
      {/* 送出、取消按鈕 */}
      <div className={classes.contentField}>
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="primary"
          disabled={!title.trim() || !content.trim() || !image || submitting}
          onClick={handleSubmit}
        >
          <SaveIcon className={classes.buttonIcon} />
          保存
        </Button>
        <Button
          className={classes.button}
          style={{ marginLeft: "20px" }}
          variant="outlined"
          onClick={handleDeleteDraft}
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
