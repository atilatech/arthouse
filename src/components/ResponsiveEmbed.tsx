import React from 'react';

function ResponsiveEmbed({srcUrl=''}) {

    return (
        <div className="embed-responsive  embed-responsive-16by9 my-3">
            <iframe 
                    allowFullScreen
                    src={srcUrl}
                    className="embed-responsive-item">
            </iframe>
        </div>
    );
}

export default ResponsiveEmbed;