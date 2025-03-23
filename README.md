# Creator Flock

A Next.js application for creators to connect and collaborate, built with TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- Modern UI with Tailwind CSS
- Type-safe development with TypeScript
- Component-based architecture
- Optimized for performance
- Creator tools and collaboration features

## Getting Started

```bash
# Install dependencies
npm install
# or
pnpm install

# Run the development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js app directory with pages and layouts
- `components/` - Reusable UI components
  - `filters/` - Components for filtering content
  - `leaderboard/` - Leaderboard display components
  - `navigation/` - Navigation bars and menus
  - `ui/` - Base UI components from shadcn/ui
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and shared code
- `public/` - Static assets
- `styles/` - Global styles

## Technologies

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

## Development Guidelines

This project follows specific development guidelines:

1. **Modularity**: Break the application into small, reusable components with single responsibilities
2. **Type Safety**: Use TypeScript for props, state, and API responses
3. **Consistent Styling**: Use Tailwind CSS utility classes
4. **Component Integration**: Customize shadcn/ui components thoughtfully
5. **Error Handling**: Implement robust error handling for all API calls
6. **Performance**: Use React.memo, useMemo, and useCallback appropriately
7. **Testing**: Write tests for critical components
8. **Accessibility**: Ensure the app is accessible to all users
9. **Code Organization**: Follow the project's directory structure

## License

MIT