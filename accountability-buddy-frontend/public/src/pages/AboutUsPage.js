import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUsPage.css'; // Include CSS for styling

// Team member data
const teamMembers = [
  {
    name: 'Jane Doe',
    role: 'CEO & Founder',
    bio: 'Jane has over 10 years of experience in tech startups and leads our company with a vision for innovation.',
    image: '/images/jane-doe.jpg', // Ensure this path matches your asset structure
    social: {
      linkedin: 'https://www.linkedin.com/in/janedoe',
      twitter: 'https://twitter.com/janedoe',
    },
  },
  {
    name: 'John Smith',
    role: 'CTO',
    bio: 'John is a seasoned technologist, passionate about building scalable platforms and leading engineering teams.',
    image: '/images/john-smith.jpg',
    social: {
      linkedin: 'https://www.linkedin.com/in/johnsmith',
      twitter: 'https://twitter.com/johnsmith',
    },
  },
  // Add more team members as needed
];

const AboutUsPage = () => {
  return (
    <div className="about-us-page" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>About Us</h1>
      <p>
        Welcome to Accountability Buddy, where we help you stay on track with your personal and professional goals.
        Our team is dedicated to providing innovative solutions to empower individuals and groups in their journey toward success.
      </p>

      {/* Team Section */}
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-members" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member" style={{ flex: '1 1 200px', textAlign: 'center' }}>
              <img
                src={member.image}
                alt={`${member.name} - ${member.role}`}
                style={{ width: '150px', borderRadius: '50%' }}
              />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <p>{member.bio}</p>
              <div className="social-links" aria-label={`${member.name}'s social links`}>
                {member.social.linkedin && (
                  <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                )}
                {member.social.twitter && (
                  <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Company Mission Section */}
      <section className="mission-section" style={{ marginTop: '40px' }}>
        <h2>Our Mission</h2>
        <p>
          Our mission is to provide tools and support that enable you to achieve your goals, foster accountability, 
          and build lasting habits. We believe in empowering users through technology and community-driven solutions.
        </p>
      </section>

      {/* Call to Action */}
      <section className="call-to-action" style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2>Join Us</h2>
        <p>
          Ready to start your journey with Accountability Buddy? <Link to="/register">Sign up today!</Link>
        </p>
      </section>
    </div>
  );
};

export default AboutUsPage;
