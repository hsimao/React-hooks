import React from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import zhTwLocale from "date-fns/locale/zh_tw";

const Comments = ({ comments, classes }) => (
  <List className={classes.root}>
    {comments.map((comment, i) => (
      <ListItem key={i} alignItems="flex-start" className={classes.item}>
        <ListItemAvatar>
          <Avatar src={comment.author.picture} alt={comment.author.name} />
        </ListItemAvatar>
        <ListItemText
          primary={<Typography component="span">{comment.text}</Typography>}
          secondary={
            <span className={classes.subItem}>
              <Typography className={classes.subItemText} component="span">
                {comment.author.name}
              </Typography>
              <Typography className={classes.subItemTextTime} component="span">
                {distanceInWordsToNow(Number(comment.createdAt), {
                  locale: zhTwLocale
                })}
                之前
              </Typography>
            </span>
          }
        />
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
  subItem: {
    display: "flex"
  },
  subItemText: {
    display: "inline",
    color: "gray",
    fontSize: "14px"
  },
  subItemTextTime: {
    display: "inline",
    color: "gray",
    fontSize: "14px",
    marginLeft: "auto"
  }
});

export default withStyles(styles)(Comments);
