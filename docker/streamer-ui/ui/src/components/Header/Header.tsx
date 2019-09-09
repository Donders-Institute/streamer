import * as React from "react";
import { Link } from "react-router-dom";
import { Layout, Row, Col, Icon, Menu, Button } from "antd";
import "../../App.less";

import logoDCCN from "../../assets/dccn-logo.png";

class Header extends React.Component {
  render() {
    return (
      <Layout>
        <Layout>
          <Layout.Header
            style={{
              backgroundColor: "#fff",
              padding: "10px 20px 10px 20px",
              height: "94px"
            }}
          >
            <Row type="flex" justify="space-between">
              <Col>
                <img alt="Donders Institute" src={logoDCCN} height={64} />
              </Col>
              <Col></Col>
            </Row>
          </Layout.Header>
        </Layout>
        <Layout>
          <Layout.Header
            className="App-header-top"
            style={{ padding: "0 0px", height: "12px" }}
          ></Layout.Header>
        </Layout>
        <Layout>
          <Layout.Header
            className="App-header"
            style={{ padding: "0px 20px 0px 0px" }}
          >
            <Row type="flex" justify="space-between">
              <Col>
                <Menu
                  className="App-header-menu"
                  theme="dark"
                  mode="horizontal"
                  selectedKeys={["home"]}
                >
                  <Menu.Item key="home" style={{ float: "left" }}>
                    <Link to="/">
                      <Icon type="home" />
                      Lab Streamer UI
                    </Link>
                  </Menu.Item>
                </Menu>
              </Col>
              <Col>
                <Link to="/logout">
                  <Button size="small" ghost>
                    Log out
                  </Button>
                </Link>
              </Col>
            </Row>
          </Layout.Header>
        </Layout>
      </Layout>
    );
  }
}

export default Header;