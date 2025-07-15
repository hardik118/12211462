# FrontendTestSubmission

This project is a frontend coding test submission. It is structured for clarity, modularity, and scalability, following modern frontend best practices.

---

## Project Structure

```
FrontendTestSubmission/
├── public/                  # Static assets (favicon, images, etc.)
├── src/                     # Main source code
│   ├── components/          # Reusable UI components
│   ├── pages/               # Route-level components or views
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions and helpers
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Entry point for the app
├── index.html               # HTML template
├── package.json             # Project metadata and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # Documentation (this file)
```

---

## File & Folder Explanations

- **public/**:  
  Contains static files; these are copied directly to the build output.

- **src/**:  
  Main application logic.
  - **components/**: Contains reusable UI elements (e.g., `Button.tsx`, `Navbar.tsx`).
  - **pages/**: Each file represents a page or route in the app (e.g., `Home.tsx`, `About.tsx`).
  - **hooks/**: Custom React hooks for code reuse (e.g., `useFetch.ts`).
  - **utils/**: Helper functions and utilities (e.g., `formatDate.ts`).
  - **App.tsx**: Root component that sets up routing and global providers.
  - **main.tsx**: Renders the App component into the DOM.

- **index.html**:  
  The HTML page template loaded by Vite.

- **package.json**:  
  Lists dependencies, scripts (`dev`, `build`, `lint`, etc.), and project metadata.

- **tsconfig.json**:  
  Configures TypeScript options for better type safety and tooling.

- **vite.config.ts**:  
  Configuration for the Vite build tool and development server.

---

## How the Functions Work

- **Component-based Structure:** Each UI element (button, input, layout) is a separate component in `src/components/`.
- **Routing:**  routes are defined in `App.tsx`, mapping URLs to files in `src/pages/`.
- **State Management:** Local state is handled in components using React `useState`, and global state  is set up in context providers
- **API Calls:** Any data fetching logic is abstracted into custom hooks (e.g., `useFetch`).
- **Reusability:** Shared logic is kept in `hooks/` and `utils/` to avoid duplication.

---

## Getting Started

1. **Install dependencies:**  
   ```bash
   npm install
   ```

2. **Start the development server:**  
   ```bash
   npm run dev
   ```

3. **Build for production:**  
   ```bash
   npm run build
   ```

4. **Lint your code:**  
   ```bash
   npm run lint
   ```

---

## Customization

- Add new components in `src/components/`.
- Define new pages in `src/pages/` and update routing in `App.tsx`.
- Utilities and helpers go in `src/utils/`.
- Add custom hooks in `src/hooks/` for reusable logic.

---

## Notes

- The structure supports scaling to large projects, with clear separation of concerns.
- TypeScript ensures type safety and better developer experience.
- Vite offers fast development and optimized production builds.

---

