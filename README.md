# Clinical Screener (Frontend)

URL: https://clinical-screener-frontend.netlify.app

### Clinical Screener Frontend

A modern, responsive web application for serving diagnostic screeners to patients. Built with:

- React + TypeScript
- Vite
- Material UI
- Netlify for deployment

### Project Structure

```
.
├── README.md
├── index.html
├── netlify.toml
├── package-lock.json
├── package.json
├── public
│   └── env.js
├── src
│   ├── App.tsx
│   ├── components
│   │   └── Screener.tsx
│   ├── config
│   │   └── index.ts
│   ├── env.d.ts
│   ├── main.tsx
│   ├── types
│   │   └── screener.ts
│   └── utils
│       └── api.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Problem

Mental health providers need a user-friendly interface for patients to complete diagnostic screeners. The interface must:
- Present questions one at a time
- Show clear progress indication
- Handle answer submissions securely
- Maintain patient privacy
- Provide a smooth, intuitive experience

This frontend implementation delivers:
1. Single-question display format for focused patient attention
2. Progress bar showing completion status
3. Automatic advancement on answer selection
4. Secure communication with backend API
5. Error handling with user-friendly messages

## Technical Considerations

The frontend is built with React and TypeScript for robust type safety and component reusability. Key technical decisions include:

1. **Vite** for development and building:
   - Fast hot module replacement
   - Efficient production builds
   - Modern ESM-based development

2. **Accessibility** in mind--would have added more with more time.

3. **State Management**:
   - React hooks for local state

### Security & Privacy

#### Security Measures

1. Request Validation:
   - Input sanitization
   - Data format verification
   - Error handling for malformed responses

2. Privacy Protection:
   - No storage of PHI in browser
   - Session-based data handling
   - Secure communication with backend

3. Error Handling:
   - User-friendly error messages
   - Graceful fallbacks
   - Comprehensive error logging

### Running Locally

1. Clone the repository and navigate to the root

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

### Production Deployment

The application is deployed on Netlify with:
- Automatic deployments from main branch
- Environment variable management

#### Production Considerations

1. Performance:
   - Code splitting
   - Asset optimization
   - Caching strategies
   - Lazy loading of components

2. Monitoring:
   - More robust error tracking
   - Performance monitoring

3. Accessibility:
   - WCAG compliance
   - Keyboard navigation
   - Screen reader support
   - Color contrast requirements

### Future Enhancements

Given additional time, potential improvements include the above as well as:
1. Offline support with service workers
2. Enhanced animations for transitions
3. Automated accessibility testing
4. Performance optimization
5. Enhanced error recovery
6. Multi-language support