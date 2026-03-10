import { MovieAPI } from "../../MovieAPI";
import { Card, List } from "antd";
import { useState, useEffect } from "react";

function getColumnCount(sidebarCollapsed) {
  const w = window.innerWidth;
  // When sidebar is collapsed, we have more space - be more aggressive with columns
  if (sidebarCollapsed) {
    if (w >= 1800) return 5;
    if (w >= 1400) return 4;
    if (w >= 1000) return 3;
    if (w >= 768) return 2;
    return 1;
  }
  // Normal sidebar visible
  if (w >= 2000) return 5;
  if (w >= 1600) return 4;
  if (w >= 1200) return 3;
  if (w >= 768) return 2;
  return 1;
}

const listStyle = {
  width: "100%",
  height: "100%",
  padding: "10px",
};

const cardPosterStyle = {
  height: "100%",
  width: "100%",
  objectFit: "contain",
};

const cardTitleStyle = {
  fontWeight: "bold",
  fontFamily: "Arial Black",
  color: "#5E5E5E",
  width: "100%",
  textAlign: "left",
  float: "left",
  paddingLeft: "5px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  lineHeight: "1.3",
};

const cardRatingStyle = {
  float: "left",
  paddingLeft: "10px",
  fontFamily: "Georgia",
  fontWeight: "bold",
};

const cardTimeStyle = {
  float: "left",
  paddingLeft: "5px",
};

const cardPlotStyle = {
  textAlign: "left",
  display: "block",
  clear: "left",
  paddingLeft: "5px",
};

const actorLinkStyle = {
  color: "black",
  textDecoration: "underline",
  fontStyle: "italic",
  fontSize: ".9em",
  fontFamily: "verdana",
};

const cardActorSpacer = {
  width: "100%",
  textAlign: "left",
  paddingLeft: "5px",
  clear: "left",
};

const baseCardBodyStyle = {
  height: "200px",
  padding: "0px",
  display: "flex",
  userSelect: "none",
  overflow: "hidden",
};

const baseCardContentWrapper = {
  height: "100%",
  width: "100%",
  display: "flex",
};

const posterContainer = { height: "100%", width: "130px", float: "left", flexShrink: 0, overflow: "hidden" };

const cardRightColumStyle = {
  flexGrow: "1",
  overflowY: "auto",
  minHeight: 0,
  textAlign: "left",
  paddingLeft: "3px",
  paddingRight: "13px",
};

const filmIcon = {
  fontSize: "24px",
  width: "24px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "8px",
};

const heartIcon = {
  fontSize: "24px",
  width: "24px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "8px",
};

const buttonLabelStyle = {
  fontWeight: "bold",
  verticalAlign: "middle",
};

const hasWatchedDataContainer = {
  width: "100px",
  height: "44px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "auto",
  marginLeft: "-20px",
  float: "left",
  color: "#a9a9a9",
};

const toWatchDataContainer = {
  width: "100px",
  height: "44px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "auto",
  marginLeft: "10px",
  paddingRight: "20px",
  float: "left",
  color: "#a9a9a9",
};

function UserMovieOptions({ userData, id, setUserData, onToggleViewing }) {
  const [hoveredSeenButton, setHoveredSeenButton] = useState(false);
  const [hoveredWantButton, setHoveredWantButton] = useState(false);

  if (userData) {
    const isWatched = userData.moviesSeen.includes(id);
    let watchedDataContainer;

    if (isWatched) {
      watchedDataContainer = {
        ...hasWatchedDataContainer,
        color: "#22c55e",
      };
    } else {
      watchedDataContainer = {
        ...hasWatchedDataContainer,
        color: hoveredSeenButton ? "#1890ff" : "#a9a9a9", // Change color on hover of seen button
      };
    }

    const isWanted = userData.moviesToWatch.includes(id);
    let wantedDataContainer;
    if (isWanted) {
      wantedDataContainer = {
        ...toWatchDataContainer,
        color: "#dc143c",
      };
    } else {
      wantedDataContainer = {
        ...toWatchDataContainer,
        color: hoveredWantButton ? "#1890ff" : "#a9a9a9", // Change color on hover of want button
      };
    }
    return (
      <>
        <br style={{ clear: "both" }} />
        <div style={{ margin: "auto" }}>
          <div
            onClick={() => {
              const newIsWatched = !isWatched;
              if (!isWatched) {
                let newUserData = {
                  ...userData,
                  moviesSeen: [...userData.moviesSeen, id],
                };
                setUserData(newUserData);
              } else {
                let newUserData = {
                  ...userData,
                  moviesSeen: userData.moviesSeen.filter((x) => x !== id),
                };
                setUserData(newUserData);
              }

              if (typeof onToggleViewing === "function") onToggleViewing(id, "SetWatched", newIsWatched);

              MovieAPI.setWatchedState(userData.username, id, newIsWatched)
                .then((response) => response.json())
                .then((response) => {
                  if (!response.success) {
                    alert(response.message);
                  }
                });
            }}
            onMouseEnter={() => setHoveredSeenButton(true)}
            onMouseLeave={() => setHoveredSeenButton(false)}
            className="zoom-on-hover"
            style={watchedDataContainer}
          >
            <span style={buttonLabelStyle}>SEEN</span>
          </div>
          <div
            onClick={() => {
              const newIsWanted = !isWanted;
              if (!isWanted) {
                let newUserData = {
                  ...userData,
                  moviesToWatch: [...userData.moviesToWatch, id],
                };
                setUserData(newUserData);
              } else {
                let newUserData = {
                  ...userData,
                  moviesToWatch: userData.moviesToWatch.filter((x) => x !== id),
                };
                setUserData(newUserData);
              }

              if (typeof onToggleViewing === "function") onToggleViewing(id, "SetWantToWatch", newIsWanted);

              MovieAPI.setWantToWatchState(userData.username, id, newIsWanted)
                .then((response) => response.json())
                .then((response) => {
                  if (!response.success) {
                    alert(response.message);
                  }
                });
            }}
            onMouseEnter={() => setHoveredWantButton(true)} // changes color on hover of seen and want buttons
            onMouseLeave={() => setHoveredWantButton(false)}
            className="zoom-on-hover"
            style={wantedDataContainer}
          >
            <span style={buttonLabelStyle}>WANT</span>
          </div>
        </div>
      </>
    );
  }
  return <></>;
}

function CardList({ movieDataArray, userData, setUserData, actorSearch, onMovieClick, onToggleViewing, sidebarCollapsed }) {
const cardBodyStyle = userData
  ? { ...baseCardBodyStyle, height: "260px", flexWrap: "wrap" }
  : baseCardBodyStyle;
const cardContentWrapper = userData
  ? { ...baseCardContentWrapper, height: "85%" }
  : baseCardContentWrapper;

const [columns, setColumns] = useState(() => getColumnCount(sidebarCollapsed));
const [hoveredMovieId, setHoveredMovieId] = useState(null);
const [hoveredActor, setHoveredActor] = useState(null);

useEffect(() => {
  function handleResize() {
    setColumns(getColumnCount(sidebarCollapsed));
  }
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, [sidebarCollapsed]);

// Update columns when sidebar collapses/expands
useEffect(() => {
  setColumns(getColumnCount(sidebarCollapsed));
}, [sidebarCollapsed]);

  return (
    <>
      {
        <List
          style={listStyle}
          grid={{ 
            gutter: 8, 
            column: columns,
            xs: columns,
            sm: columns,
            md: columns,
            lg: columns,
            xl: columns,
            xxl: columns
          }}
          dataSource={movieDataArray}
          renderItem={(item, i) => {
            const thumbUrl = MovieAPI.getPosterThumbnail(item.id);

            const actorList = item.actors.split(",").map((actor, i) => (
              <div key={i}>
                <button
                  type="button"
                  style={{
                    ...actorLinkStyle,
                    color: hoveredActor === actor ? "#1890ff" : "black", // Change color on hover of actor name
                    background: "none",
                    border: "none",
                    padding: "0",
                    cursor: "pointer",
                  }}
                  onClick={() => actorSearch(actor)}
                  onMouseEnter={() => setHoveredActor(actor)}
                  onMouseLeave={() => setHoveredActor(null)}
                >
                  {actor}
                </button>
                <br />
              </div>
            ));

            return (
              <List.Item>
                <Card hoverable bodyStyle={cardBodyStyle} style={{ overflow: "hidden" }}>
                  <div style={cardContentWrapper}>
                    <div style={posterContainer}>
                      <img className="moviePosterImage" style={cardPosterStyle} alt="" src={thumbUrl} loading="lazy" />
                    </div>
                    <div className="RightCol" style={cardRightColumStyle}>
                        <div
                          onClick={() => onMovieClick(item.id)}
                          onMouseEnter={() => setHoveredMovieId(item.id)}
                          onMouseLeave={() => setHoveredMovieId(null)}
                          style={{
                            ...cardTitleStyle,
                            cursor: "pointer",
                            color: hoveredMovieId === item.id ? "#1890ff" : "#5E5E5E", // Change color on hover of movie title
                          }}
                          className="movieTitle"
                        >
                          {item.title + " (" + new Date(item.releaseDate).getFullYear() + ")"}
                        </div>
                        <br />
                        <span className="movieTime" style={cardTimeStyle}>
                          {item.runtime}
                        </span>
                        <span className="movieRating" style={cardRatingStyle}>
                          {item.rating}
                        </span>
                        <br />
                        <div style={cardActorSpacer}>{actorList}</div>
                        <span className="moviePlot" style={cardPlotStyle}>
                          {item.plot}
                        </span>
                    </div>
                  </div>
                  <UserMovieOptions userData={userData} id={item.id} setUserData={setUserData} onToggleViewing={onToggleViewing} />
                </Card>
              </List.Item>
            );
          }}
        />
      }
    </>
  );
}

export default CardList;
