import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import FaceIcon from "@material-ui/icons/Face";
import Context from "../../context";
import format from "date-fns/format";
import CreateComment from "../Comment/CreateComment";
import Comments from "../Comment/Comments";

const PinContent = ({ classes }) => {
  const { state } = useContext(Context);
  const { title, content, author, createdAt, comments } = state.currentPin;
  return (
    <div className={classes.root}>
      <Typography component="h2" variant="h4" color="primary" gutterBottom>
        {title}
      </Typography>
      <Typography
        className={classes.text}
        component="h3"
        variant="h6"
        color="inherit"
        gutterBottom
      >
        <FaceIcon className={classes.icon} />
        {author.name}
      </Typography>
      <Typography
        className={classes.text}
        variant="subtitle2"
        color="inherit"
        gutterBottom
      >
        <AccessTimeIcon className={classes.icon} />
        {format(createdAt, "YYYY/MM/DD")}
      </Typography>
      <Typography variant="subtitle1" gutterBottom className={classes.content}>
        {content}
      </Typography>

      {/* 留言區塊 */}
      <CreateComment />
      <Comments comments={comments} />
    </div>
  );
};

const styles = theme => ({
  root: {
    padding: "1em 1.5em",
    textAlign: "center",
    width: "100%"
  },
  icon: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  text: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    textAlign: "left",
    borderTop: "solid 1px gray",
    margin: "16px auto 0 auto",
    padding: "16px 0"
  }
});

export default withStyles(styles)(PinContent);
