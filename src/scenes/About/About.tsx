import React from 'react'
import NotionPage from '../../components/NotionPage'
import ResponsiveEmbed from '../../components/ResponsiveEmbed';
import SmarContractsInfo from './SmarContractsInfo';

function About() {
  return (
    <div className="container">
        <h1 className='text-center'>
            About Art House
        </h1>

        <div className="section card shadow m-5 p-5">
            <NotionPage pageId="37ec10d7c96b4bd1b77f3ac42115dbda" showTableOfContents={false} className="p-2" />
        </div>

        <div className="section card shadow m-5 p-5">
            <SmarContractsInfo />
        </div>

        <div className="section card shadow m-5 p-5">
            <h2 className='text-center'>
                Activate Build Presentation Slides
            </h2>
            <p className='text-center'>
                The prototype was built during the <a href="https://activate.build" target="_blank" rel="noreferrer" className="ml-1">
                        Activate Build
                    </a> hackathon in Miami.
            </p>
        </div>

        <div className="section card shadow m-5 p-5">
            <ResponsiveEmbed 
            srcUrl="https://docs.google.com/presentation/d/e/2PACX-1vS-k9mCJsoNLKiPlqSCz01SUxlCZvHZAWfn3ahgZGSXLMZB1bqIrj-NcB2pZ38-Ik4sdd73QNWoJJJ1/embed?start=false&loop=false&delayms=3000"
            title="Arthouse Presentation" />
        </div>
        
    </div>
  )
}

export default About