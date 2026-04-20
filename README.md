# MIN Project Contribution Guide

<div align="center">
  <h1>Mathematics Initiatives in Nepal (MIN)</h1>
  <p>Empowering Students Across Nepal Through Innovative Mathematics Education.</p>
  
  <p align="center">
    <a href="https://github.com/PixelPlatypus/MIN/graphs/contributors"><img src="https://img.shields.io/github/contributors/PixelPlatypus/MIN.svg?style=flat-square" alt="Contributors"></a>
    <a href="https://github.com/PixelPlatypus/MIN/network/members"><img src="https://img.shields.io/github/forks/PixelPlatypus/MIN.svg?style=flat-square" alt="Forks"></a>
    <a href="https://github.com/PixelPlatypus/MIN/stargazers"><img src="https://img.shields.io/github/stars/PixelPlatypus/MIN.svg?style=flat-square" alt="Stargazers"></a>
    <a href="https://github.com/PixelPlatypus/MIN/issues"><img src="https://img.shields.io/github/issues/PixelPlatypus/MIN.svg?style=flat-square" alt="Issues"></a>
  </p>
</div>

---

## 🚀 About The Project

**Mathematics Initiatives in Nepal (MIN)** is an open-source, Next.js engineered web platform designed to bridge the gap in mathematics education. It provides an advanced digital ecosystem for students to practice mock exams (DMO), read content, discover events, and for administrators to seamlessly manage volunteers and website configurations via an integrated headless CMS approach.

### 🛠 Built With

* **Framework:** [Next.js (App Router)](https://nextjs.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Modern Framer Motion Micro-animations
* **Database & Auth:** [Supabase](https://supabase.com/)
* **Media & Cloud:** Cloudinary, Resend, Upstash Redis

---

## 💻 Local Development Setup

Follow these step-by-step instructions to get the project running seamlessly on your local machine.

### 1. Install Dependencies
Make sure you have Node.js (v18+) installed, then run:
```bash
npm install
```

### 2. Environment Variables
You need to configure your local environment variables to connect to various required external services. We have provided a template for you:
1. Duplicate the `.env.example` file located in the root directory.
2. Rename the duplicated file to `.env.local`
3. Fill in the required keys. This architecture relies on several integrations:
   - **Supabase:** Core Database & Authentication *(Required)*
   - **Cloudinary:** Image hosting & Gallery administration *(Required)*
   - **Resend:** Email delivery and automated notifications *(Required)*
   - **Upstash Redis:** API Rate limiting *(Required)*

### 3. Database Setup (Crucial)
For detailed instructions on setting up your local Supabase PostgreSQL database (including creating tables, policies, and injecting complete dummy data), please closely follow our **[Supabase Database Setup Guide](./supabase/example_migration/README.md)**.

### 4. Run the Development Server
Once dependencies are installed and `.env.local` is fully configured alongside the Supabase backend, start the application:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🤝 Contribution Guide (Git Workflow)

We are thrilled to have you contribute! To maintain an organized project history, we follow a strict Github Flow.

### 1. Fork & Clone
1. **Fork** the repository using the "Fork" button in the top right corner of GitHub.
2. **Clone** your forked repository to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/MIN.git
   cd MIN
   ```
3. **Set Upstream:** Link the original repository so you can pull the latest updates later:
   ```bash
   git remote add upstream https://github.com/PixelPlatypus/MIN.git
   ```

### 2. Sync Your Fork (Pull Latest Changes)
Before starting any new work, make sure your local `dev` branch is perfectly synced with the original repository target:
```bash
git fetch upstream
git checkout dev
git merge upstream/dev
```

### 3. Branch Creation
Always create a new checkout branch for your work using your name and a brief description of the task. Do **not** work directly on the `dev` or `main` branch.

```bash
git checkout -b your-name/feature-or-fix-description
```
*Example: `ram/update-homepage-styles`*

---

## 📝 Commit Message Convention

We enforce a strict format for commit messages to maintain semantic, readable project histories.

`type:(description)`

### Common Types:
- **`fix:`** — For bug fixes. *(e.g., `fix: resolve image loading issue on mobile`)*
- **`update:`** — For new features. *(e.g., `update: add dark mode toggle button`)*
- **`docs:`** — Documentation changes. *(e.g., `docs: update API documentation`)*
- **`style:`** — Code style formatting. *(e.g., `style: format components with prettier`)*
- **`refactor:`** — Code logic overhaul without feature change. *(e.g., `refactor: simplify authentication logic`)*
- **`test:`** — Testing protocols. *(e.g., `test: add unit tests for utils`)*
- **`chore:`** — Build/maintenance tasks. *(e.g., `chore: update dependencies`)*

---

## 📬 Pull Requests

Once you have completed your work on your local branch, follow these steps to integrate it:

1. **Push your branch to your forked repository:**
   ```bash
   git push origin your-name/feature-or-fix-description
   ```
2. **Open a Pull Request:** Navigate to the original [PixelPlatypus/MIN](https://github.com/PixelPlatypus/MIN) repository on GitHub. You should see a prompt to "Compare & pull request" for your recently pushed branch.
3. **Compare Across Forks:** Ensure the base repository is the original project (`dev` branch) and the head repository is your fork containing your new branch.
4. **Describe Your Changes:** Include a detailed description of what you changed, why you changed it, and how to test it.
5. **Request Review:** Request a technical review from project team members.
