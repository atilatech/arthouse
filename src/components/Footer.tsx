import React from 'react';
import {Link} from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faInstagram, faLinkedin, faTiktok, faTwitter } from '@fortawesome/free-brands-svg-icons';
import './Footer.scss';

function Footer() {
    return (<React.Fragment>
            <hr/>
            <div className="Footer container p-3">
                <div className="row">
                    <div className="col-lg-8 col-sm-12">
                        <p className="grey-text text-lighten-4">
                        <a href="https://atila.ca" target="_blank" rel="noreferrer" >Atila</a>{' '} 
                        is a plattform for starting and getting scholarships using fiat or cryptocurrencies.
                        </p>

                    </div>
                    <div className="col-lg-4 col-sm-12">
                        <ul className="connect-links list-style-type-none">
                            <span className="connect-links-icons">
                                
                                <li>
                                    <a  target="_blank" rel="noopener noreferrer" href="https://www.tiktok.com/@atila.tech">
                                    <FontAwesomeIcon icon={faTiktok} />
                                    </a>
                                </li>
                                <li>
                                    <a  target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/channel/UCG2iWiYgJYkjBl4EdYGI5mw/">
                                        <FontAwesomeIcon icon={faYoutube} />
                                    </a>
                                </li>
                                <li>
                                    <a  target="_blank" rel="noopener noreferrer" href="https://twitter.com/atilatech">
                                        <FontAwesomeIcon icon={faTwitter} />
                                    </a>
                                </li>
                                <li>
                                    <a  target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/atilatech/">
                                        <FontAwesomeIcon icon={faInstagram} />
                                    </a>
                                </li>
                                <li>
                                    <a  target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/company/atila-tech/">
                                        <FontAwesomeIcon icon={faLinkedin} />
                                    </a>
                                </li>
                            </span>
                            <br />
                            <div className="mt-3">
                                <li>Built with <span role="img" aria-label="heart emoji">
                                ❤️
                            </span> By {' '}
                                    <a href="https://atila.ca" target="_blank" style={{color: '#50eafd !important'}} rel="noreferrer" >Atila</a>
                                </li>
                            </div>
                        </ul>
                    </div>
                </div>

            </div>
        </React.Fragment>
    );
}

export default Footer;
