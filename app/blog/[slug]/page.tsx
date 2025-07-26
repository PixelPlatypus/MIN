"use client"

import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { ArrowLeft, Calendar, User, Tag, Download } from "lucide-react"
import Link from "next/link"

import { MinFloatingElements } from "@/components/ui/min-floating-elements"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

// Sample blog data - in real app, this would come from API/database
const blogData: { [key: string]: any } = {
  "mathematics-quantum-computing": {
    id: 4,
    title: "Mathematics in Quantum Computing",
    description: "Understanding the mathematical foundations that power quantum computing and its future implications.",
    author: "Maya Shrestha",
    date: "2024-12-05",
    tags: ["Quantum Computing", "Linear Algebra", "Future Tech"],
    downloadLink: "/blogs/mathematics-quantum-computing.pdf",
    filePath: "/blogs/mathematics-quantum-computing.pdf",
    content: `
# Mathematics in Quantum Computing

Quantum computing represents one of the most exciting frontiers in modern technology, and at its heart lies sophisticated mathematics. This blog post explores the mathematical foundations that make quantum computing possible.

## Linear Algebra: The Foundation

The mathematical foundation of quantum computing is built upon linear algebra. A quantum state can be represented as a vector in a complex vector space. For a single qubit, this is a 2-dimensional complex vector space.

A qubit state $|\\psi\\rangle$ can be written as:
$$|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$$

where $\\alpha$ and $\\beta$ are complex numbers satisfying $|\\alpha|^2 + |\\beta|^2 = 1$.

## Quantum Gates and Unitary Matrices

Quantum operations are represented by unitary matrices. The most fundamental single-qubit gates include:

**Pauli-X Gate (NOT gate):**
$$X = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$$

**Pauli-Y Gate:**
$$Y = \\begin{pmatrix} 0 & -i \\\\ i & 0 \\end{pmatrix}$$

**Pauli-Z Gate:**
$$Z = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$$

## Quantum Entanglement

One of the most fascinating aspects of quantum computing is entanglement. Consider the Bell state:
$$|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)$$

This state cannot be written as a product of individual qubit states, demonstrating the non-classical nature of quantum systems.

## Applications in Cryptography

Quantum computing has profound implications for cryptography. Shor's algorithm can factor large integers exponentially faster than classical algorithms, threatening current RSA encryption.

The algorithm relies on the quantum Fourier transform and period finding, showcasing how quantum mechanics can solve classically intractable problems.

## Future Implications

As quantum computers become more powerful, they will revolutionize:
- Drug discovery through molecular simulation
- Financial modeling and optimization
- Machine learning and AI
- Weather prediction and climate modeling

The mathematics of quantum computing continues to evolve, promising exciting developments in both theoretical and applied mathematics.
    `,
  },
  "art-of-proof-writing": {
    id: 8,
    title: "The Art of Mathematical Proof Writing",
    description: "Essential techniques and strategies for writing clear, elegant, and convincing mathematical proofs.",
    author: "Anita Poudel",
    date: "2024-11-20",
    tags: ["Proof Writing", "Mathematical Communication", "Education"],
    downloadLink: "/blogs/art-of-proof-writing.pdf",
    filePath: "/blogs/art-of-proof-writing.pdf",
    content: `
# The Art of Mathematical Proof Writing

Mathematical proof writing is both a science and an art. It requires logical rigor, clear communication, and elegant presentation. This guide explores the essential techniques for crafting compelling mathematical proofs.

## What Makes a Good Proof?

A good mathematical proof should be:
- **Correct**: Logically sound with no gaps
- **Clear**: Easy to follow and understand
- **Complete**: Addresses all necessary cases
- **Concise**: No unnecessary steps or words
- **Elegant**: Beautiful in its simplicity

## Fundamental Proof Techniques

### Direct Proof
The most straightforward approach: assume the hypothesis and derive the conclusion through logical steps.

**Example**: Prove that if $n$ is even, then $n^2$ is even.

*Proof*: Assume $n$ is even. Then $n = 2k$ for some integer $k$. Therefore:
$$n^2 = (2k)^2 = 4k^2 = 2(2k^2)$$

Since $2k^2$ is an integer, $n^2$ is even. ∎

### Proof by Contradiction
Assume the negation of what you want to prove and derive a contradiction.

**Example**: Prove that $\\sqrt{2}$ is irrational.

*Proof*: Assume $\\sqrt{2}$ is rational. Then $\\sqrt{2} = \\frac{p}{q}$ where $p, q$ are integers with $\\gcd(p,q) = 1$.

Squaring both sides: $2 = \\frac{p^2}{q^2}$, so $2q^2 = p^2$.

This means $p^2$ is even, so $p$ is even. Let $p = 2r$.
Then $2q^2 = 4r^2$, so $q^2 = 2r^2$.

This means $q^2$ is even, so $q$ is even.
But this contradicts $\\gcd(p,q) = 1$. Therefore, $\\sqrt{2}$ is irrational. ∎

### Mathematical Induction
Prove a base case, then show that if the statement holds for $k$, it holds for $k+1$.

**Example**: Prove that $1 + 2 + ... + n = \\frac{n(n+1)}{2}$ for all positive integers $n$.

*Base case*: For $n = 1$: $1 = \\frac{1(2)}{2} = 1$ ✓

*Inductive step*: Assume the formula holds for $n = k$:
$$1 + 2 + ... + k = \\frac{k(k+1)}{2}$$

For $n = k+1$:
$$1 + 2 + ... + k + (k+1) = \\frac{k(k+1)}{2} + (k+1)$$
$$= \\frac{k(k+1) + 2(k+1)}{2} = \\frac{(k+1)(k+2)}{2}$$

This completes the induction. ∎

## Writing Style Guidelines

### Structure Your Proof
1. **State what you're proving** clearly
2. **Outline your strategy** if the proof is long
3. **Present the argument** step by step
4. **Conclude definitively** with ∎ or QED

### Use Clear Language
- Write in complete sentences
- Define all variables and notation
- Use "Let," "Assume," "Therefore," "Hence" appropriately
- Avoid ambiguous pronouns

### Mathematical Notation
- Use standard notation consistently
- Display important equations
- Number equations if referenced later
- Use proper spacing and formatting

## Common Pitfalls to Avoid

1. **Circular reasoning**: Don't assume what you're trying to prove
2. **Proof by example**: One example doesn't prove a general statement
3. **Missing cases**: Consider all possibilities
4. **Unclear quantifiers**: Be precise about "for all" vs "there exists"
5. **Computational errors**: Double-check your algebra

## The Beauty of Elegant Proofs

The most memorable proofs combine logical rigor with aesthetic beauty. Consider Euclid's proof of the infinitude of primes:

*Proof*: Suppose there are only finitely many primes $p_1, p_2, ..., p_n$.
Consider $N = p_1 \\cdot p_2 \\cdot ... \\cdot p_n + 1$.

$N$ is not divisible by any $p_i$ (remainder 1), so either $N$ is prime or has a prime factor not in our list. This contradicts our assumption. ∎

This proof is elegant because it's:
- Constructive (builds the contradiction explicitly)
- Surprising (the +1 is unexpected)
- Generalizable (works for any finite set)

## Conclusion

Mathematical proof writing is a skill that improves with practice. Focus on clarity, rigor, and elegance. Remember that a proof is a form of communication – your goal is to convince and enlighten your reader.

As the mathematician Paul Halmos said: "The best notation is no notation; whenever it is possible to avoid the use of a complicated alphabetic apparatus, avoid it."

Happy proving!
    `,
  },
}

export default function BlogPost() {
  const params = useParams()
  const slug = params.slug as string
  const post = blogData[slug]

  if (!post) {
    return (
      <div className="min-h-screen overflow-x-hidden">

        <MinFloatingElements />
        <Navigation />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Blog Post Not Found</h1>
          <Link href="/content" className="btn-min-accent text-min-primary px-6 py-3 rounded-full">
            Back to Content
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden">

      <MinFloatingElements />

      {/* Navigation */}
      <Navigation />

      {/* Article Header */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto container-padding relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/content"
              className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors mb-8 group"
              data-hover="true"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Content</span>
            </Link>

            <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">B</span>
                </div>
                <span className="text-min-accent text-sm font-medium">Blog Post</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 min-gradient-accent">
                {post.title}
              </h1>

              <p className="text-white/80 text-lg leading-relaxed mb-6">{post.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((tag: string, index: number) => (
                  <span key={index} className="glass px-3 py-1 rounded-full text-xs text-white/80 flex items-center">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            </motion.div>
            {post.downloadLink && (
              <div className="mt-8 text-center">
                <Link
                  href={post.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white glass-button focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Blog Post
                </Link>
              </div>
            )}

        </div>
      </section>

      {/* Article Content */}
      <section className="pb-20 relative z-10">
        <div className="max-w-4xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          >
            {post.content ? (
              <p className="text-white/70">{post.content}</p>
            ) : post.filePath ? (
              <p className="text-white/70">Content from file: {post.filePath}</p>
            ) : (
              <p className="text-white/70">No content or file path available for this blog post.</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
