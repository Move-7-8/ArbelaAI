import '@styles/globals.css';
import Nav from '@components/Nav';
import Provider from 'components/Provider'
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
    title: "Arbela", 
    description: "Use AI to discover and analyse US companies"
}

const RootLayout = ({children}) => {
  
 
  return (
    <html lang="en">
        <body>
            <Provider>                
                <div className="main">
                    <div className="gradient"/>
                </div>
                <main className="app">
                    <Nav/>
                    {children}
                    <Analytics />

                </main>
            </Provider>
        </body>
    </html>
  )
}

export default RootLayout;