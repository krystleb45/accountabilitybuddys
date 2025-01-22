import React from "react";
import ResourceLinks from "../Settings/ResourceLinks";
import Disclaimer from "../UtilityComponents/Disclaimer";
import ChatBox from "../chat/ChatBox";
import styles from "./MilitarySupport.module.css";

const MilitarySupport: React.FC = () => {
  return (
    <div className={styles.container} data-testid="military-support">
      <header className={styles.header}>
        <h1>Military Support Section</h1>
        <p>
          Welcome to the Military Support Section. Connect with peers, share
          messages, and find helpful resources.
        </p>
      </header>

      <section className={styles.disclaimer}>
        <Disclaimer />
      </section>

      <section className={styles.chatBox} aria-labelledby="chat-heading">
        <h2 id="chat-heading" className={styles.sectionTitle}>
          Peer Support Chat
        </h2>
        <ChatBox onSendMessage={function (message: string): void {
                  throw new Error("Function not implemented.");
              } } />
      </section>

      <section className={styles.resources} aria-labelledby="resources-heading">
        <h2 id="resources-heading" className={styles.sectionTitle}>
          Helpful Resources
        </h2>
        <ResourceLinks />
      </section>
    </div>
  );
};

export default MilitarySupport;
