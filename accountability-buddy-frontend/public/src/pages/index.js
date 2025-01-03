import Head from 'next/head';

const Home = () => {
  return (
    <>
      <Head>
        <title>Accountability Buddy - Home</title>
        <meta name="description" content="Welcome to Accountability Buddy, where your goals meet a supportive community to achieve your personal and professional goals." />
        <meta name="keywords" content="accountability, goals, community, productivity, success, motivation" />
        <meta property="og:title" content="Accountability Buddy - Home" />
        <meta property="og:description" content="Achieve your goals with the help of a supportive community at Accountability Buddy." />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content="https://www.accountabilitybuddy.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Accountability Buddy - Home" />
        <meta name="twitter:description" content="Join a supportive community focused on goal achievement and personal growth." />
        <meta name="twitter:image" content="/logo.png" />
      </Head>

      <main role="main">
        <section>
          <h1>Welcome to Accountability Buddy</h1>
          <p>Achieve your goals with the help of our community.</p>
        </section>

        <section aria-labelledby="cta-section">
          <h2 id="cta-section">Get Started</h2>
          <p>Join now to set your goals and connect with accountability partners.</p>
          <a href="/register" role="button" aria-label="Join Now - Set your goals and connect">
            Join Now
          </a>
        </section>
      </main>
    </>
  );
};

export default Home;
