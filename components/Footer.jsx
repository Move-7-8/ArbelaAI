import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faDiscord, faLinkedin } from '@fortawesome/free-brands-svg-icons'; // Importing the necessary icons

const Footer = () => {
  return (
      <div className="mt-6 flex justify-between items-center p-5 border-t border-gray-300">
          <div className="flex flex-wrap justify-start">
              <a href="https://twitter.com/arbela_io" target="_blank" rel="noopener noreferrer" aria-label="Follow on Twitter" className="mx-2">
                  <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="https://discord.gg/nmFUkqZxBA" target="_blank" rel="noopener noreferrer" aria-label="Join on Discord" className="mx-2">
                  <FontAwesomeIcon icon={faDiscord} size="lg" />
              </a>
              <a href="https://www.linkedin.com/company/arbeladao/" target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn" className="mx-2">
                  <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>
          </div>
          <div className="text-sm whitespace-nowrap">
              <a href="https://kalicapital.io" target="_blank" rel="noopener noreferrer">
                  Kali Capital Pty Ltd.
              </a>
          </div>
      </div>
  )
}

export default Footer;
