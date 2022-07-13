import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import Gallery from './scenes/NFT/Gallery';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CreateNFT from './scenes/NFT/CreateNFT';
import MyNFTs from './scenes/NFT/MyNFTs';
import LandingPage from './scenes/LandingPage/LandingPage';
import About from './scenes/About/About';

import {
  REACT_APP_MORALIS_APP_ID,
  REACT_APP_MORALIS_SERVER_URL} from './config';

import Moralis from 'moralis';
import Settings from './scenes/Settings/Settings';

// TODO move this too App.tsx so it doesn't have to call oral
Moralis.start({ serverUrl: REACT_APP_MORALIS_SERVER_URL, appId: REACT_APP_MORALIS_APP_ID });

function App() {
  return (
      <Router>
        <div className="App">
            <Navbar />
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/gallery" component={Gallery} />
            <Route exact path="/create" component={CreateNFT} />
            <Route exact path="/about" component={About} />
            <Route exact path="/my-nfts" component={MyNFTs} />
            <Route exact path="/settings" component={Settings} />
            <Footer />
        </div>
      </Router>
  );
}

export default App;
