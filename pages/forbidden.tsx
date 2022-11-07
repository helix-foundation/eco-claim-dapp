import type { NextPage } from "next";
import Layout from "components/layout";
import styles from "css/modules/home.module.scss";
import VStack from "components/vstack";
import { StackGapSize } from "components/hstack";
import Copy from "components/copy";
import Callout from "components/callout";

const Forbidden: NextPage = () => {
  return (
    <Layout hideHeader>
      <div className={styles.homeWrapper}>
        <div className={styles.homeContent}>
          <VStack gapSize={StackGapSize.Large}>

            <div>
              <p className="sectionSubtitle">Welcome Researcher...</p>
            </div>
            <Copy>
              If you&apos;re seeing this message, it might be for a few reasons:
              <ul>
                <li>The application interface is currently down</li>
                <li>The claim has closed</li>
                <li>You are accessing the application from a restricted IP address or country</li>
              </ul>
            </Copy>
            <div style={{ maxWidth: 400 }}>
              <Callout>
                <p><strong>Note:</strong> If you believe you may be blocked in error or otherwise need help, drop into the <a href="https://discord.eco.org">Eco Discord</a> to post your question in the <strong>#eco-support</strong> channel!</p>
              </Callout>
            </div>
          </VStack>
        </div>
      </div>
    </Layout>
  )
}

export default Forbidden