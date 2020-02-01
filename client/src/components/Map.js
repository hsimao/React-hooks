import React, { useState, useEffect, useContext } from "react";
import ReactMapGL, { NavigationControl, Marker, Popup } from "react-map-gl";
import { withStyles } from "@material-ui/core/styles";
import differenceInMinutes from "date-fns/difference_in_minutes";
import PinIcon from "./PinIcon";
import Blog from "./Blog";
import Context from "../context";
import { useClient } from "../client";
import { GET_PINS_QUERY } from "../graphql/queries";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const INITIAL_VIEWPORT = {
  latitude: 25.033408,
  longitude: 121.564099,
  zoom: 13
};

const Map = ({ classes }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);

  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);
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
  // useEffect 會在組件 render 完後執行, 以及每次更新之後執行。
  // 第二個參數 [], 表示只會執行一次, 避免因為使用 useState 中有依賴響應的資料改變而重新觸發
  useEffect(() => {
    getUserPosition();
  }, []);

  // 從資料庫取得 pins 資料後儲存到 redux
  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    console.log({ getPins });
    dispatch({ type: "GET_PINS", payload: getPins });
  };
  useEffect(() => {
    getPins();
  }, []);

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

  // 如果是在 30 分鐘前新增的就使用不同顏色 icon
  const highlightNewPin = pin => {
    const isNewPin =
      differenceInMinutes(Date.now(), new Date(pin.createdAt)) <= 30;
    return isNewPin ? "#00bcd4" : "#2196f3";
  };

  // 顯示當前點擊標籤
  const [popup, setPopup] = useState(null);
  const handleSelectPin = pin => {
    setPopup(pin);
    dispatch({ type: "SET_PIN" });
  };

  const isAuthUser = () => state.currentUser._id === popup.author._id;

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
            <PinIcon size="40" color="#8d6e63" />
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
            <PinIcon size="40" color="#90caf9" />
          </Marker>
        )}

        {/* 顯示所有標籤 */}
        {state.pins.map(pin => (
          <Marker
            key={pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon
              onClick={() => handleSelectPin(pin)}
              size="40"
              color={highlightNewPin(pin)}
            />
          </Marker>
        ))}

        {/* 標籤點擊顯示視窗 Popup */}
        {popup && (
          <Popup
            anchor="top"
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
          >
            <img
              className={classes.popupImage}
              src={popup.image}
              alt={popup.title}
            />
            <div className={classes.popupTab}>
              <Typography>
                {popup.latitude.toFixed(6)},{popup.longitude.toFixed(6)},
              </Typography>
              {isAuthUser() && (
                <Button>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              )}
            </div>
          </Popup>
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
    color: "#ef5350"
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
