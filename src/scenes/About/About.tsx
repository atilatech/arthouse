import React from 'react'
import NotionPage from '../../components/NotionPage'
import ResponsiveEmbed from '../../components/ResponsiveEmbed'

function About() {
  return (
    <div>
        <h1>
            About Art House
        </h1>

        <div className="section card shadow m-5 p-5">
            <NotionPage pageId="37ec10d7c96b4bd1b77f3ac42115dbda" showTableOfContents={false} className="p-2" />
        </div>


        <div className="section card shadow m-5 p-5 responsive-google-slides">
            <iframe 
                title="Arthouse Presentation"
                src="https://docs.google.com/presentation/d/e/2PACX-1vS-k9mCJsoNLKiPlqSCz01SUxlCZvHZAWfn3ahgZGSXLMZB1bqIrj-NcB2pZ38-Ik4sdd73QNWoJJJ1/embed?start=false&loop=false&delayms=3000" frameBorder="0" width="960" height="569" allowFullScreen={true} ></iframe>
        </div>

        <div className="section card shadow m-5 p-5">
            <ResponsiveEmbed srcUrl="https://www.loom.com/embed/c4205883b8fd4e499eadf1e349c8ace6?from_link_expand=true&?session_id=c4205883b8fd4e499eadf1e349c8ace6&hide_owner=undefined&hide_speed=undefined&hide_share=undefined&hide_title=undefined&from_url=https%3A%2F%2Fgithub.com%2Fatilatech%2Fart-house" />
        </div>

        
    </div>
  )
}

export default About