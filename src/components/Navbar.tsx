import React, { useState } from 'react';
import { Row, Col, Menu } from "antd";
import {Link} from "react-router-dom";
import './Navbar.scss';

function Navbar() {
    const [currentKey, setCurrentKey] = useState("");

    const menuItems = [
        {
            key: "create",
            label: "Create NFT",
        },
        {
            key: "my-nfts",
            label: "My NFTs",
        },
    ];

    return (
        <div className="m-3">
            <Row>
                <Col md={8}>
                <h2 id="logo"
                    className="text-center" onClick={(e) => setCurrentKey("")}>
                    <Link to="/">
                        <span>Atila</span>
                    </Link>
                </h2>
                </Col>
                <Col md={16}>
                    <Menu onClick={(e) => setCurrentKey(e.key)} selectedKeys={[currentKey]} mode="horizontal">
                        {menuItems.map(menuItem => (
                            <Menu.Item key={menuItem.key}>
                                <Link to={menuItem.key}>{menuItem.label}</Link>
                            </Menu.Item>
                        ))}
                        
                    </Menu>
                </Col>
            </Row>
            <hr style={{ margin: 0 }}/>
        </div>
    );
}

export default Navbar;