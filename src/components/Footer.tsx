import { Link } from 'react-router-dom'
import uchicagoLogo from '../assets/uchicago-logo.svg'
import d4cgLogo from '../assets/d4cg-logo.png'
import llsLogo from '../assets/lls-logo.svg'
import nihLogo from '../assets/nih-logo.png'
import iciLogo from '../assets/ici-logo.png'
import LinkExternal from './LinkExternal'

function Footer({ isLLS }: { isLLS: boolean }) {
  return (
    <footer className="p-4 border-t border-solid border-primary">
      <section className="flex flex-col md:flex-row items-center justify-between max-w-screen-lg mx-auto mb-12 md:mb-20 gap-2">
        <a
          href="https://biologicalsciences.uchicago.edu/"
          className="m-2"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={uchicagoLogo}
            alt="University of Chicago"
            style={{ height: '60px', maxHeight: '60px' }}
          />
        </a>
        <a
          href="https://commons.cri.uchicago.edu/"
          className="m-2"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={d4cgLogo}
            alt="Data For The Common Good"
            style={{ height: '60px', maxHeight: '60px' }}
          />
        </a>
        {!isLLS && (
          <>
            <a
              href="https://www.cancer.gov/"
              className="m-2"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={nihLogo}
                alt="National Cancer Institute"
                style={{ height: '60px', maxHeight: '60px' }}
              />
            </a>
            <a
              href="https://www.the-ici-fund.org/"
              className="m-2"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={iciLogo}
                alt="Innovation In Cancer Informatics"
                style={{ height: '60px', maxHeight: '60px', width: '80px' }}
              />
            </a>
          </>
        )}
        <a
          href="https://www.lls.org/lls-childrens-initiative-pedal"
          className="m-2"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={llsLogo}
            alt="LLS PedAL"
            style={{ height: '60px', maxHeight: '60px' }}
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
              <LinkExternal to="https://docs.pedscommons.org/GEARBOxTermsandConditions/">
                Terms
              </LinkExternal>
            </li>
            •
            <li className="mx-2 inline underline">
              <LinkExternal to="https://docs.pedscommons.org/PcdcPrivacyNotice/">
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
