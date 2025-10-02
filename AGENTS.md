# Agent Guidelines and Project Rules

## Common Sense Project Rules

1. **Code Quality**: Always write clean, readable, and maintainable code. Follow language-specific best practices (TypeScript, JavaScript, etc.).

2. **Testing**: Write unit tests for all new features and bug fixes. Aim for good test coverage. Use appropriate testing frameworks (Jest for JS/TS).

3. **Linting**: Run linters (ESLint) before committing. Fix all linting errors and warnings.

4. **Gitflow**: Use Gitflow branching strategy. Create feature branches for new work, merge via pull requests.

5. **Conventional Commits**: Use conventional commit messages (e.g., "feat: add user authentication", "fix: resolve search bug").

6. **Pre-commit Hooks**: Ensure pre-commit hooks are set up with commitlint to enforce conventional commits.

7. **Documentation**: Document code changes, API endpoints, and significant decisions. Update README as needed.

8. **Security**: Avoid hardcoding secrets. Use environment variables. Validate inputs to prevent injection attacks.

9. **Performance**: Optimize queries, images, and bundles. Use lazy loading where appropriate.

10. **Accessibility**: Ensure UI components are accessible (ARIA labels, keyboard navigation).

11. **Error Handling**: Implement proper error handling in APIs and UI.

12. **Separation of Concerns**: Keep domain logic separate (frontend, backend, database).

13. **Integration**: Ensure components integrate well. Test end-to-end flows.

## Agent-Specific Rules

### @frontend
- Use Tailwind CSS for styling.
- Ensure responsive design.
- Optimize for performance (code splitting, lazy loading).
- Follow React best practices (hooks, functional components).

### @backend
- Use Drizzle ORM correctly.
- Validate API inputs.
- Handle errors gracefully.
- Secure endpoints if needed.

### @testing
- Write comprehensive tests.
- Include integration tests.
- Mock external dependencies.

### @database
- Design schemas properly.
- Optimize queries.
- Ensure data integrity.

### @research
- Use reliable sources.
- Document findings clearly.

### @code-review
- Check for bugs, security issues.
- Ensure code follows rules.
- Suggest improvements.