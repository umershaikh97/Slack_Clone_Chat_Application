import React, { useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import "./App.css";
import ColorPanel from "./components/ColorPanel/ColorPanel";
import Messages from "./components/Messages/Messages";
import MetaPanel from "./components/MetaPanel/MetaPanel";
import SidePanel from "./components/SidePanel/SidePanel";
import { connect } from "react-redux";

const App = ({ currentUser }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [])

  return (<Grid columns="equal" className="app" style={{ background: "#eee" }}>
    <ColorPanel />
    <SidePanel currentUser={user} />

    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages />
    </Grid.Column>

    <Grid.Column width={4}>
      <MetaPanel />
    </Grid.Column>
  </Grid>)
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.userReducer.currentUser,
  }
}

export default connect(mapStateToProps, null)(App);
