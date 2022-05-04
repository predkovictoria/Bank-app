import React, { useState, useEffect } from "react";
import {
  Container,
  AppBar,
  Typography,
  Grow,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { useDispatch } from "react-redux";

import Posts from "./components/Posts/Posts";
import Form from "./components/Form/Form";
import { getPosts } from "./actions/posts";
import useStyles from "./styles";
import PostsFilter from "./components/Posts/PostsFilter/PostsFilter";

const App = () => {
  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [anebleFilter, setAnebleFilter] = useState(false);

  useEffect(() => {
    dispatch(getPosts());
  }, [currentId, dispatch]);

  return (
    <Container maxWidth="lg">
      <AppBar className={classes.appBar} position="static" color="inherit">
        <Typography className={classes.heading} variant="h2" align="center">
          Bank Clients
        </Typography>
        <img className={classes.image} src="/bank.png" alt="icon" height="60" />
      </AppBar>
      <Grow in>
        <Container>
          <Grid
            container
            justify="space-between"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item xs={12} sm={7}>
              <Grid item xs={12} sm={7}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={anebleFilter}
                      onChange={({ target: { checked } }) =>
                        setAnebleFilter(checked)
                      }
                    />
                  }
                  label="Enable Filter"
                />
                {anebleFilter ? <PostsFilter /> : ""}
              </Grid>
              <Posts setCurrentId={setCurrentId} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Form currentId={currentId} setCurrentId={setCurrentId} />
            </Grid>
          </Grid>
        </Container>
      </Grow>
    </Container>
  );
};

export default App;
