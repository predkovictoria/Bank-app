import React, { useEffect, useState } from "react";
import * as api from "../../../api/index.js";

import Box from "@material-ui/core/Box";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import {
  Card,
  CircularProgress,
  FormGroup,
  Slider,
  TextField,
  Typography,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import useStyles from "./styles";
import { getPosts } from "../../../actions/posts";
import { useDebounce } from "../../../hooks/useDebaunce.js";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function PostsFilter() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [cities, setCities] = useState([]);
  const [maxBalance, setMaxBalance] = useState(0);
  const [ready, setReady] = useState(false);

  const [city, setCity] = useState([]);
  const [haveMortgage, setHaveMortgage] = useState("");
  const [balanceRange, setBalanceRange] = useState([0, 0]);
  const [numCreditCards, setNumCreditCards] = useState(0);

  const debauncedNumCreditcards = useDebounce(numCreditCards, 500);
  const debauncedbalanceRange = useDebounce(balanceRange, 500);

  const handleCitiesChange = ({ target: { value } }) => {
    setCity(typeof value === "string" ? value.split(",") : value);
  };

  const getPostCities = async () => {
    setCities((await api.fetchPostCities()).data);
  };
  const getMaxBalanceValue = async () => {
    setMaxBalance((await api.fetchPostMaxBalance()).data);
  };

  const applyFilters = () => {
    if (ready) {
      dispatch(
        getPosts({
          city,
          haveMortgage,
          balanceFrom: balanceRange[0],
          balanceTo: balanceRange[1],
          numCreditCards,
        })
      );
    }
  };

  const fetchData = async () => {
    await getPostCities();
    await getMaxBalanceValue();
    setReady(true);
  };

  useEffect(() => {
    applyFilters();
  }, [debauncedNumCreditcards, debauncedbalanceRange, haveMortgage]);

  useEffect(() => {
    if (maxBalance !== 0) setBalanceRange([0, maxBalance]);
  }, [maxBalance]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card className={classes.card}>
      {ready ? (
        <FormGroup>
          <FormControl
            sx={{ m: 1, width: 300 }}
            className={classes.control}
          >
            <InputLabel id="city">City</InputLabel>
            <Select
              size="small"
              labelId="city"
              id="select-city"
              multiple
              value={city}
              onChange={handleCitiesChange}
              onClose={applyFilters}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            className={classes.control}
            sx={{ m: 1, minWidth: 120 }}
            size="small"
          >
            <TextField
              id="outlined-name"
              type="number"
              label="Credit Cards (more then)"
              value={numCreditCards}
              onChange={({ target: { value } }) => setNumCreditCards(value)}
            />
          </FormControl>
          <FormControl
            className={classes.control}
            sx={{ m: 1, minWidth: 120 }}
            size="small"
          >
            <InputLabel id="demo-select-small">Has Mortgage?</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={haveMortgage}
              label="Age"
              onChange={({ target: { value } }) => setHaveMortgage(value)}
            >
              <MenuItem value={""}>
                <em>None</em>
              </MenuItem>
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            className={classes.control}
            sx={{ m: 1, minWidth: 120 }}
          >
            <Typography id="input-slider" gutterBottom>
              Balance
            </Typography>
            <Slider
              value={balanceRange}
              onChange={(_, value) => setBalanceRange(value)}
              valueLabelDisplay="auto"
              max={maxBalance}
            />
          </FormControl>
        </FormGroup>
      ) : (
        <CircularProgress />
      )}
    </Card>
  );
}
