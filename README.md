# MIN Project Contribution Guide

## Git Workflow

1. **Branch Creation**:
   - Always create a new branch for your work using your name:
     ```bash
     git checkout -b your-name/feature-or-fix-description
     ```
   - Example: `ram/update-homepage-styles`

2. **Pull Latest Changes**:
   - Before starting work, pull the latest changes from `dev` branch:
     ```bash
     git pull origin dev
     ```

## Commit Message Convention

Follow this format for commit messages:

```
type:(description)
```

### Common Types:

- `fix:` - For bug fixes
  Example: `fix: resolve image loading issue on mobile`

- `update:` - For new features or improvements
  Example: `update: add dark mode toggle button`

- `docs:` - Documentation changes
  Example: `docs: update API documentation`

- `style:` - Code style/formatting changes
  Example: `style: format components with prettier`

- `refactor:` - Code refactoring
  Example: `refactor: simplify authentication logic`

- `test:` - Test related changes
  Example: `test: add unit tests for utils`

- `chore:` - Build/maintenance tasks
  Example: `chore: update dependencies`

## Pull Requests

1. Push your branch:
   ```bash
   git push origin your-branch-name
   ```

2. Create a PR from your branch to `dev` branch
3. Include detailed description of changes
4. Request review from team members