import { Link } from 'react-router-dom'
import LinkExternal from '../components/LinkExternal'

function Terms() {
  return (
    <div className="my-8 text-lg">
      <h1 className="font-bold text-primary text-3xl mb-8">
        Terms and Conditions
      </h1>
      <p className="mb-4">
        The following Terms and Conditions apply for use of GEARBOx. Your use of
        GEARBOx and the matching results indicates your acceptance of the
        following Terms and Conditions. These Terms and Conditions apply to all
        data obtained from GEARBOx, independent of format and method of
        acquisition.
      </p>
      <p className="mb-4">
        The website{' '}
        <Link className="text-primary underline" to="/">
          gearbox.pedscommons.org
        </Link>{' '}
        is maintained and operated by the Pediatric Cancer Data Commons (PCDC)
        at the University of Chicago, Chicago, Illinois and is brought to you by
        the Leukemia & Lymphoma Society (LLS) as part of the LLS Children’s
        Initiative - LLS PedAL: Precision Medicine for Pediatric Acute Leukemia.
        For more information on PedAL please visit{' '}
        <LinkExternal
          className="text-primary underline"
          to="https://www.lls.org/childrens-initiative/pedal"
        >
          www.lls.org/childrens-initiative/pedal
        </LinkExternal>
        .
      </p>
      <p className="mb-4">
        GEARBOx is a decision support tool that aims to help clinicians and
        clinical staff identify clinical trials to which to connect their
        patients. The tool is designed to present users with matched clinical
        trials based on answers to questions regarding clinical,
        immunophenotype, and genomic profiles of the patient.
      </p>
      <p className="mb-4">Use of GEARBOx. Important things to understand:</p>
      <ul className="list-disc ml-8 mb-4">
        <li>
          Neither the Leukemia & Lymphoma Society, the Pediatric Cancer Data
          Commons nor the University of Chicago make any warranties, expressed
          or implied, representations with respect to the accuracy or
          completeness of the match results, and, furthermore, assume no
          liability for any party{"'"}s use, or the results of such use, of any
          part of the tool.
        </li>
        <li>
          Your use of this tool is your responsibility and your use of the
          results is completely within your judgment and expertise.
        </li>
        <li>
          The search is performed by a software tool, without any human
          intervention or review. Software may contain errors; this tool is
          provided as is.
        </li>
        <li>
          The Pediatric Cancer Data Commons is not providing you with any advice
          or guidance. The information contained within can never be a
          substitute for clinical judgement.
        </li>
        <li>
          Clinical trials data from GEARBOx are available to all requesters,
          both within and outside the United States, at no charge.
        </li>
        <li>
          To access the tool, you must register for an account with the
          University of Chicago. All activities that occur under your account
          will be attributable to you. Do not share your account credentials
          with others.
        </li>
      </ul>
      <p className="mb-4">
        The name Pediatric Cancer Data Commons and the names and marks of each
        member group are owned thereby and you receive no rights to them.
      </p>
      <p className="mb-4">
        This tool was created by, is operated by, the University of Chicago,
        Chicago, Illinois, United States.
      </p>
      <p className="mb-4">
        These Terms and Conditions are in effect as long as the user retains any
        of the matches provided by GEARBOx.
      </p>
    </div>
  )
}

export default Terms
