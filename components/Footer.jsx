import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faDiscord, faLinkedin } from '@fortawesome/free-brands-svg-icons'; // Importing the necessary icons

const Footer = () => {
    return (
      <div className="mt-24 flex justify-between items-center p-5 border-t border-gray-300"> 
        <div>
          <a href="https://twitter.com/arbela_io" target="_blank" rel="noopener noreferrer" aria-label="Follow on Twitter" className="mx-4">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="hthttps://discord.gg/nmFUkqZxBA" target="_blank" rel="noopener noreferrer" aria-label="Join on Discord" className="mx-4">
            <FontAwesomeIcon icon={faDiscord} />
          </a>
          <a href="https://www.linkedin.com/company/arbeladao/" target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn" className="mx-4">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>
        <div>
          <a href="https://kalicapital.io" target="_blank" rel="noopener noreferrer" className="text-sm"> {/* Smaller text size */}
            Kali Capital Pty Ltd. 
          </a>
        </div>
      </div>
    )
  }
  
export default Footer;
