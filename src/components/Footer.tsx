import { Link } from 'react-router-dom'
import uchicagoLogo from '../assets/uchicago-logo.svg'
import pcdcLogo from '../assets/pcdc-logo.png'
import llsLogo from '../assets/lls-logo.svg'
import LinkExternal from './LinkExternal'

function Footer() {
  return (
    <footer className="p-4 border-t border-solid border-primary">
      <section className="flex flex-col md:flex-row items-center justify-between max-w-screen-lg mx-auto mb-12 md:mb-20">
        <a
          href="https://biologicalsciences.uchicago.edu/"
          className="m-2"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={uchicagoLogo}
            alt="University of Chicago"
            style={{ height: '60px', padding: '6px' }}
          />
        </a>
        <a
          href="https://commons.cri.uchicago.edu/"
          className="m-2"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={pcdcLogo}
            alt="Pediatric Center Data Commons"
            style={{ height: '60px' }}
          />
        </a>
        <a
          href="https://www.lls.org/"
          className="m-2"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={llsLogo}
            alt="Leukeima & Lymphoma Society"
            style={{ height: '60px', padding: '6px' }}
          />
        </a>
      </section>
      <section className="text-center text-sm">
        <div className="mb-4">
          <ul>
            <li className="mx-2 inline underline">
              <Link to="/about">About GEARBOx</Link>
            </li>
            •
            <li className="mx-2 inline underline">
              <Link to="/terms">Terms</Link>
            </li>
            •
            <li className="mx-2 inline underline">
              <LinkExternal to="https://commons.cri.uchicago.edu/wp-content/uploads/2021/04/PCDC-Privacy-Notice.pdf">
                Privacy Notice
              </LinkExternal>
            </li>
            •
            <li className="mx-2 inline underline">
              <LinkExternal to="https://commons.cri.uchicago.edu/contact/">
                Contact Us
              </LinkExternal>
            </li>
          </ul>
        </div>
        <div>© {new Date().getFullYear()} The University of Chicago</div>
      </section>
    </footer>
  )
}

export default Footer
