# Contributing to Creator Flock

Thank you for your interest in contributing to Creator Flock! This guide outlines the contribution workflow and development standards.

## Development Guidelines

1. **Embrace Modularity**
   - Break the application into small, reusable components
   - Each component should have a single responsibility
   - Store components in their own files

2. **Leverage TypeScript for Type Safety**
   - Define interfaces for props, state, and API responses
   - Use explicit typing to catch errors during development

3. **Maintain Consistent Styling with Tailwind CSS**
   - Use Tailwind's utility classes
   - Follow our custom theme configuration in `tailwind.config.ts`

4. **Integrate shadcn/ui Components Thoughtfully**
   - Customize shadcn/ui components using their props rather than CSS overrides
   - Maintain design system consistency

5. **Handle Networking with Care**
   - Centralize API requests in a dedicated service
   - Implement proper error handling

6. **Implement Robust Error Handling**
   - Always catch and handle errors in API calls
   - Provide user-friendly feedback

7. **Optimize for Performance**
   - Use React's optimization hooks (`useMemo`, `useCallback`, etc.)
   - Leverage Next.js's static generation where appropriate

8. **Write Tests for Critical Components**
   - Use Jest and React Testing Library
   - Focus on testing key components and functionality

9. **Ensure Accessibility**
   - Use semantic HTML
   - Provide alt text for images
   - Ensure keyboard navigation

10. **Organize Code Logically**
    - Follow the established project structure

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes following our guidelines
4. Write or update tests as needed
5. Submit a pull request with a clear description of the changes

## Code Review Process

All submissions require review. We use GitHub pull requests for this purpose.

## Code of Conduct

Please be respectful and constructive in all interactions.