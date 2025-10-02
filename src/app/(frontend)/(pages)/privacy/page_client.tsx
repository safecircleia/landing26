'use client'

import { BlockWrapper } from '@components/BlockWrapper/index'
import { Gutter } from '@components/Gutter/index'
import { Cell, Grid } from '@faceless-ui/css-grid'
import React from 'react'

import classes from './page.module.scss'

export const PrivacyClientPage: React.FC = () => {
  return (
    <React.Fragment>
      <Gutter className={classes.privacyWrap}>
        <div className="grid">
          <div className="cols-12 cols-m-8">
            <h2>Privacy Policy</h2>
            <p>Effective as of August 12, 2025.</p>
            <p>
              This Privacy Policy describes how SafeCircle ("<b>SafeCircle</b>," "<b>we</b>", "
              <b>us</b>" or "<b>our</b>") processes personal information that we collect through our
              digital or online properties or services that link to this Privacy Policy (including
              as applicable, our website, mobile application, social media pages, marketing
              activities, live events and other activities described in this Privacy Policy
              (collectively, the "<b>Service</b>")).
            </p>
            <p>
              At SafeCircle, we prioritize user privacy and are committed to protecting your
              personal information. We only collect data that is necessary for our services to
              function properly and securely. All data sent to SafeCircle servers is encrypted in
              transit using end-to-end encryption (E2EE), ensuring that only you, the user, are
              capable of accessing and viewing your information in its unencrypted form.
            </p>
            <p>
              All of our public services are open source and available for review at{' '}
              <a href="https://github.com/safecircleia" rel="noreferrer noopener" target="_blank">
                https://github.com/safecircleia
              </a>
              . This commitment to transparency allows users and security researchers to verify our
              security practices and privacy protections.
            </p>
            <h3>Index</h3>
            <ul>
              <li>
                <a href="#personalInformation">Information We Collect</a>
              </li>
              <li>
                <a href="#usePersonal">How We Use Your Information</a>
              </li>
              <li>
                <a href="#dataEncryption">Data Security and End-to-End Encryption</a>
              </li>
              <li>
                <a href="#sharePersonal">Disclosure of Your Information</a>
              </li>
              <li>
                <a href="#dataRetention">Data Retention</a>
              </li>
              <li>
                <a href="#userRights">Your Rights</a>
              </li>
              <li>
                <a href="#cookies">Cookies and Tracking Technologies</a>
              </li>
              <li>
                <a href="#openSource">Open Source Commitment</a>
              </li>
              <li>
                <a href="#children">Children's Privacy</a>
              </li>
              <li>
                <a href="#changesToPrivacy">Changes to This Policy</a>
              </li>
              <li>
                <a href="#contactUs">Contact Us</a>
              </li>
              <li>
                <a href="#europeanUsers">Legal Basis for Processing (EEA, UK)</a>
              </li>
            </ul>

            <h3 id="personalInformation">Information We Collect</h3>
            <p>
              SafeCircle prioritizes user privacy and only collects information that is necessary
              for the proper functioning of our services, which may include:
            </p>
            <ul>
              <li>Account information (username, email address, password)</li>
              <li>Authentication data necessary to verify your identity</li>
              <li>Technical data (IP address, device information, browser type)</li>
              <li>Service usage information</li>
              <li>Communications with our support team</li>
            </ul>

            <h3 id="usePersonal">How We Use Your Information</h3>
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li>To provide, maintain, and improve our services</li>
              <li>To authenticate users and secure accounts</li>
              <li>To communicate with you about your account or our services</li>
              <li>To detect and prevent fraud, abuse, and security incidents</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h3 id="dataEncryption">Data Security and End-to-End Encryption</h3>
            <p>
              All data sent to SafeCircle servers is encrypted in transit using end-to-end
              encryption (E2EE). This means that only you, as the user, are capable of accessing and
              viewing your data in its unencrypted form. We implement appropriate technical and
              organizational measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction.
            </p>

            <h3 id="sharePersonal">Disclosure of Your Information</h3>
            <p>
              SafeCircle does not sell your personal information to third parties under any
              circumstances. We may disclose your information only in the following limited
              situations:
            </p>
            <ul>
              <li>With your explicit consent</li>
              <li>
                To service providers that assist us in operating our services, who are bound by
                contractual obligations to keep personal information confidential and use it only
                for the purposes for which we disclose it to them
              </li>
              <li>
                If required by law, such as to comply with a subpoena, legal proceedings, or similar
                legal process
              </li>
              <li>
                When we believe in good faith that disclosure is necessary to protect our rights,
                protect your safety or the safety of others, investigate fraud, or respond to a
                government request
              </li>
            </ul>

            <h3 id="dataRetention">Data Retention</h3>
            <p>
              We retain your personal information only for as long as necessary to fulfill the
              purposes outlined in this Policy, unless a longer retention period is required or
              permitted by law. When determining the appropriate retention period, we consider the
              amount, nature, and sensitivity of the personal information, the potential risk of
              harm from unauthorized use or disclosure, and applicable legal requirements.
            </p>
            <p>Specific retention periods:</p>
            <ul>
              <li>
                Account information: Retained for the duration of your account plus 30 days after
                account deletion
              </li>
              <li>Server logs: Retained for 90 days for security and troubleshooting purposes</li>
              <li>Backup data: Retained for a maximum of 30 days</li>
            </ul>
            <p>
              Upon expiration of the applicable retention period, we will securely delete or
              anonymize your data.
            </p>

            <h3 id="userRights">Your Rights</h3>
            <p>
              Depending on your jurisdiction, you may have certain rights regarding your personal
              information, which may include:
            </p>
            <ul>
              <li>Access to your personal information</li>
              <li>Correction of inaccurate or incomplete information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction or objection to certain processing activities</li>
              <li>Data portability</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the information provided in
              the "Contact Us" section below.
            </p>

            <h3 id="cookies">Cookies and Tracking Technologies</h3>
            <p>
              SafeCircle uses cookies and tracking technologies for limited purposes to ensure our
              services function properly:
            </p>
            <ul>
              <li>
                <strong>Essential Cookies:</strong> These cookies are necessary for our services to
                function properly. They enable core functionality such as security, network
                management, and account authentication. You cannot opt out of these cookies as they
                are essential for the operation of our services.
              </li>
              <li>
                <strong>Functional Cookies:</strong> These cookies enable us to provide enhanced
                functionality and personalization. They may be set by us or by third-party providers
                whose services we have added to our pages.
              </li>
              <li>
                <strong>Performance/Analytics Cookies:</strong> We use these cookies to count visits
                and traffic sources so we can measure and improve the performance of our services.
                They help us understand which pages are the most and least popular and see how
                visitors move around the site.
              </li>
            </ul>
            <p>
              Most web browsers allow you to control cookies through their settings preferences. To
              find out more about cookies, including how to see what cookies have been set and how
              to manage and delete them, visit{' '}
              <a href="https://www.allaboutcookies.org" rel="noreferrer noopener" target="_blank">
                www.allaboutcookies.org
              </a>
              .
            </p>

            <h3 id="openSource">Open Source Commitment</h3>
            <p>
              All of our public services are open source and available for review at{' '}
              <a href="https://github.com/safecircleia" rel="noreferrer noopener" target="_blank">
                https://github.com/safecircleia
              </a>
              . This commitment to transparency allows users and security researchers to verify our
              security practices and privacy protections.
            </p>

            <h3 id="children">Children's Privacy</h3>
            <p>
              Our services are not directed to children under the age of 13, and we do not knowingly
              collect personal information from children under 13. If you are a parent or guardian
              and believe that your child has provided us with personal information, please contact
              us.
            </p>

            <h3 id="changesToPrivacy">Changes to This Policy</h3>
            <p>
              We may update this Policy from time to time. If we make material changes, we will
              notify you by posting the revised Policy on our website or through other appropriate
              communication channels. We encourage you to review this Policy periodically to stay
              informed about our information practices.
            </p>

            <h3 id="contactUs">Contact Us</h3>
            <p>
              If you have any questions, concerns, or requests regarding this Policy or our privacy
              practices, please contact us at:
            </p>
            <ul>
              <li>
                <strong>Email:</strong> contact@safecircle.tech
              </li>
              <li>
                <strong>Website:</strong>{' '}
                <a href="https://safecircle.tech" rel="noreferrer noopener" target="_blank">
                  https://safecircle.tech
                </a>
              </li>
              <li>
                <strong>Address:</strong> Campus Espinardo N7, 30100 Murcia
              </li>
            </ul>

            <h3 id="europeanUsers">
              Legal Basis for Processing (For EEA, UK, and Similar Jurisdictions)
            </h3>
            <p>
              If you are located in the European Economic Area (EEA), United Kingdom, or similar
              jurisdictions, we process your personal information based on the following legal
              grounds:
            </p>
            <ul>
              <li>
                <strong>Performance of a Contract:</strong> Processing necessary for the performance
                of a contract with you.
              </li>
              <li>
                <strong>Legitimate Interests:</strong> Processing necessary for our legitimate
                interests, provided those interests are not overridden by your rights and freedoms.
              </li>
              <li>
                <strong>Legal Obligation:</strong> Processing necessary for compliance with our
                legal obligations.
              </li>
              <li>
                <strong>Consent:</strong> Processing based on your consent.
              </li>
            </ul>

            <h3>Data Breach Procedures</h3>
            <p>In the event of a data breach that compromises user information, SafeCircle will:</p>
            <ul>
              <li>Notify affected users within 72 hours of breach discovery</li>
              <li>Provide information about the nature of the breach and data affected</li>
              <li>Outline steps taken to mitigate the breach</li>
              <li>Provide recommendations for user actions to protect their information</li>
            </ul>

            <h3>Security Measures</h3>
            <p>
              We implement a variety of security measures to maintain the safety of your personal
              information, including:
            </p>
            <ul>
              <li>End-to-end encryption (E2EE) for all data transmission</li>
              <li>Data encryption at rest</li>
              <li>Regular security audits and penetration testing</li>
              <li>Strict access controls and authentication protocols</li>
              <li>Regular staff security training</li>
            </ul>

            <h3>Compliance</h3>
            <p>
              This Policy is designed to comply with applicable data protection regulations,
              including but not limited to the General Data Protection Regulation (GDPR) and the
              California Consumer Privacy Act (CCPA).
            </p>

            <p>
              By using SafeCircle's services, you acknowledge that you have read and understood this
              Policy and agree to its terms.
            </p>
          </div>
        </div>
      </Gutter>
    </React.Fragment>
  )
}
