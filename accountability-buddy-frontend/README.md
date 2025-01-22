# Accountability Buddy

Accountability Buddy is a goal-setting and tracking application that helps users stay accountable through gamification, analytics, and community features. Built with React, TypeScript, and Tailwind CSS, this project focuses on engagement, usability, and scalability.

## Tech Stack

- **React**: Frontend library
- **TypeScript**: Strongly-typed JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Cypress**: End-to-end testing
- **Jest**: Unit testing
- **Stripe**: Payment gateway integration
- **Next.js**: Server-side rendering and API routes

## Features

- Goal creation and progress tracking
- Gamification with badges and leaderboards
- Personalized recommendations based on user goals
- Military support section with resources and peer chats
- Subscription management with Stripe integration
- End-to-end testing with Cypress

## Getting Started

To run this project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/accountability-buddy.git
   cd accountability-buddy
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Add environment variables:
   Create a `.env` file in the root directory and add the required variables. See `.env.example` for reference.

4. Start the development server:
   ```bash
   npm start
   ```

The app will run at [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm start`: Runs the app in development mode.
- `npm test`: Launches the test runner.
- `npm run build`: Builds the app for production.
- `npm run analyze`: Analyzes the production bundle size.

## Testing

This project uses Cypress and Jest for testing.

- Run unit tests:

  ```bash
  npm test
  ```

- Run Cypress tests:
  ```bash
  npm run cypress:open
  ```

## Deployment

This project is optimized for AWS deployment. Follow these steps to deploy:

1. Build the project:

   ```bash
   npm run build
   ```

2. Deploy the `build/` folder to your AWS hosting service.

## Additional Resources

- [React Documentation](https://reactjs.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Cypress Documentation](https://docs.cypress.io/)
- [Jest Documentation](https://jestjs.io/docs)

---
