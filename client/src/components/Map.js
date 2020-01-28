import React, { useState, useEffect, useContext } from "react";
import ReactMapGL, { NavigationControl, Marker } from "react-map-gl";
import { withStyles } from "@material-ui/core/styles";
import PinIcon from "./PinIcon";
import Blog from "./Blog";
import Context from "../context";
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const INITIAL_VIEWPORT = {
  latitude: 25.033408,
  longitude: 121.564099,
  zoom: 13
};

const Map = ({ classes }) => {
  const { state, dispatch } = useContext(Context);
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);

  // useEffect 會在組件 render 完後執行, 以及每次更新之後執行。
  useEffect(() => {
    getUserPosition();
  });

  const getUserPosition = () => {
    // 如果瀏覽器有支援 geolocation api, 就使用取得用戶當前座標
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };

  // 當用左鍵點擊 Map 時, 創建草稿 Marker, 並將座標儲存進去
  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({ type: "CREATE_DRAFT" });
    }
    const [longitude, latitude] = lngLat;
    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: { longitude, latitude }
    });
  };

  return (
    <div className={classes.root}>
      <ReactMapGL
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/hsimao/ck360c7fw13wa1cmbflkff42r"
        onViewportChange={newViewport => setViewport(newViewport)}
        onClick={handleMapClick}
        {...viewport}
        mapboxApiAccessToken="pk.eyJ1IjoiaHNpbWFvIiwiYSI6ImNrNXh0bm9pcjIyeWYzZW1sNmExczRyN2cifQ.risXt-oAZfeQp0Afix2U7A"
      >
        {/* Navigation Control */}
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={newViewport => setViewport(newViewport)}
          />
        </div>

        {/* Pin for User's Current Position */}
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size="40" color="#2196f3" />
          </Marker>
        )}

        {/* 草稿座標 Draft Pin */}
        {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size="40" color="#4dd0e1" />
          </Marker>
        )}
      </ReactMapGL>

      {/* Blog 區塊, 用來新增 Pin 內容 */}
      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
