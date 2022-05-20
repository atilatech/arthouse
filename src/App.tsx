import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import Gallery from './scenes/NFT/Gallery';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CreateNFT from './scenes/NFT/CreateNFT';
import MyNFTs from './scenes/NFT/MyNFTs';


function App() {
  return (
      <Router>
        <div className="App">
            <Navbar />
            <Route exact path="/" component={Gallery} />
            <Route exact path="/create" component={CreateNFT} />
            <Route exact path="/my-nfts" component={MyNFTs} />
            <Footer />
        </div>
      </Router>
  );
}

export default App;
