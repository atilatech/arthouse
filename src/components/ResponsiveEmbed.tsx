import React from 'react';

function ResponsiveEmbed({srcUrl='', title = ''}) {

    return (
        <div className="responsive-embed  responsive-embed-16by9 my-3">
            <iframe 
                    allowFullScreen
                    src={srcUrl}
                    title={title|| srcUrl}
                    className="responsive-embed-item">
            </iframe>
        </div>
    );
}

export default ResponsiveEmbed;