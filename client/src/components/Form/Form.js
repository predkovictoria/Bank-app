import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';

import useStyles from './styles';
import { createPost, updatePost } from '../../actions/posts';

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({ clientName: '', city: '', balance: '', haveMortgage: '', numCreditCards : '', selectedFile: '' });
  const post = useSelector((state) => (currentId ? state.posts.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const clear = () => {
    setCurrentId(0);
    setPostData({ clientName: '', city: '', balance: '', haveMortgage: '', numCreditCards : '', selectedFile: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(createPost(postData));
      clear();
    } else {
      dispatch(updatePost(currentId, postData));
      clear();
    }
  };

  return (
    <Paper className={classes.paper}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{currentId ? `Editing "${post.clientName}"` : 'Creating a Client'}</Typography>
        <TextField name="clientName" variant="outlined" label="Client Name" fullWidth value={postData.clientName} onChange={(e) => setPostData({ ...postData, clientName: e.target.value })} />
        <TextField name="city" variant="outlined" label="City" fullWidth value={postData.city} onChange={(e) => setPostData({ ...postData, city: e.target.value })} />
        <TextField name="balance" variant="outlined" label="Balance" fullWidth multiline rows={1} value={postData.balance} onChange={(e) => setPostData({ ...postData, balance: e.target.value })} />
        <TextField name="haveMortgage" variant="outlined" label="Have Mortgage?" fullWidth value={postData.haveMortgage} onChange={(e) => setPostData({ ...postData, haveMortgage: e.target.value })} />
        <TextField name="numCreditCards" variant="outlined" label="#of Credit Cards" fullWidth value={postData.numCreditCards} onChange={(e) => setPostData({ ...postData, numCreditCards: e.target.value })} />
        <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /></div>
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
      </form>
    </Paper>
  );
};

export default Form;
