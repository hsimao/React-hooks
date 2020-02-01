import React from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

const Comments = ({ comments, classes }) => (
  <List className={classes.root}>
    {comments.map((comment, i) => (
      <ListItem key={i} alignItems="flex-start" className={classes.item}>
        <ListItemAvatar>
          <Avatar src={comment.author.picture} alt={comment.author.name} />
        </ListItemAvatar>
        <ListItemText
          primary={comment.text}
          secondary={comment.author.name}
        ></ListItemText>
      </ListItem>
    ))}
  </List>
);

const styles = theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  item: {
    paddingLeft: "0",
    paddingRight: "0"
  },
  inline: {
    display: "inline"
  }
});

export default withStyles(styles)(Comments);
