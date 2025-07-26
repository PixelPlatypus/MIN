"use client"

import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { ArrowLeft, Calendar, User, Tag, Download } from "lucide-react"
import Link from "next/link"

import { MinFloatingElements } from "@/components/ui/min-floating-elements"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

// Sample research paper data
const researchData: { [key: string]: any } = {
  "advanced-functional-equations": {
    id: 2,
    title: "Advanced Techniques in Functional Equations",
    description: "A comprehensive research paper on solving complex functional equations using innovative approaches.",
    author: "Prof. Sita Gurung",
    date: "2024-12-10",
    tags: ["Functional Equations", "Research", "Advanced Mathematics"],
    downloadLink: "/research/advanced-functional-equations.pdf",
    content: `# Advanced Techniques in Functional Equations

## Abstract

This paper presents novel approaches to solving complex functional equations, with particular emphasis on equations arising in analysis, number theory, and combinatorics. We develop systematic methods for handling non-standard functional equations and provide applications to contemporary mathematical problems.

**Keywords**: Functional equations, iterative methods, regularity theory, Cauchy equations

## 1. Introduction

Functional equations have been a cornerstone of mathematical analysis since the work of Cauchy, Abel, and others in the 19th century. A functional equation is an equation where the unknown is a function, and the equation involves the function evaluated at different points.

The general form can be written as:
$$F(f(x_1), f(x_2), \\ldots, f(x_n), x_1, x_2, \\ldots, x_n) = 0$$

where $F$ is a given function and $f$ is the unknown function to be determined.

## 2. Classical Results

### 2.1 Cauchy's Functional Equation

The fundamental equation $f(x + y) = f(x) + f(y)$ has the general continuous solution:
$$f(x) = cx$$

for some constant $c \\in \\mathbb{R}$.

**Proof Sketch**: Setting $y = x$ gives $f(2x) = 2f(x)$. By induction, $f(nx) = nf(x)$ for all $n \\in \\mathbb{N}$. For rational numbers $r = \\frac{p}{q}$:
$$f(r) = f\\left(\\frac{p}{q}\\right) = \\frac{p}{q}f(1) = rf(1)$$

Continuity extends this to all real numbers.

### 2.2 Jensen's Functional Equation

The equation $f\\left(\\frac{x+y}{2}\\right) = \\frac{f(x) + f(y)}{2}$ characterizes affine functions under continuity assumptions.

### 2.3 Multiplicative Cauchy Equation

The equation $f(xy) = f(x)f(y)$ has solutions of the form $f(x) = x^c$ for positive $x$, under appropriate regularity conditions.

## 3. Advanced Techniques

### 3.1 Substitution Methods

**Technique**: Strategic substitution of specific values to reduce complexity.

**Example**: For the equation $f(x + y) + f(x - y) = 2f(x)f(y)$, substitute:
- $x = y = 0$: $2f(0) = 2f(0)^2 \\Rightarrow f(0) = 0$ or $f(0) = 1$
- $y = 0$: $2f(x) = 2f(x)f(0) \\Rightarrow f(0) = 1$ (if $f \\not\\equiv 0$)
- $x = 0$: $f(y) + f(-y) = 2f(y) \\Rightarrow f(-y) = f(y)$ (even function)

This leads to the solution $f(x) = \\cos(ax)$ for some constant $a$.

### 3.2 Iteration and Fixed Points

For equations of the form $f(g(x)) = h(f(x))$, iteration theory provides powerful tools.

**Theorem**: If $g: I \\to I$ is a contraction mapping and $h$ is continuous, then under suitable conditions, there exists a unique solution $f$ satisfying the functional equation.

### 3.3 Regularity Theory

**Theorem (Regularity)**: Let $f: \\mathbb{R} \\to \\mathbb{R}$ satisfy $f(x + y) = f(x) + f(y)$ and be bounded on some interval. Then $f$ is continuous everywhere.

**Proof Outline**:
1. Show $f$ is additive: $f(nx) = nf(x)$ for integers $n$
2. Extend to rationals: $f(rx) = rf(x)$ for rational $r$
3. Use boundedness and density of rationals to prove continuity

### 3.4 Spectral Methods

For linear functional equations, spectral theory of operators provides systematic solutions.

Consider $f(x) = \\int_0^1 K(x,t)f(t)dt$ where $K$ is a given kernel.

The eigenvalue problem $\\lambda f(x) = \\int_0^1 K(x,t)f(t)dt$ determines the spectrum of solutions.

## 4. Novel Approaches

### 4.1 Probabilistic Methods

**Innovation**: Use probability theory to solve deterministic functional equations.

**Example**: For $f(x + y) = f(x) + f(y) + f(x)f(y)$, consider the transformation $g(x) = 1 + f(x)$.

Then $g(x + y) = g(x)g(y)$, which suggests $g(x) = e^{cx}$, giving $f(x) = e^{cx} - 1$.

### 4.2 Differential Equation Methods

Transform functional equations into differential equations through differentiation.

**Example**: If $f(x + h) - f(x) = hf'(x) + o(h)$ and $f$ satisfies a functional equation, differentiate to obtain a differential equation for $f'$.

### 4.3 Complex Analysis Techniques

Use properties of analytic functions to solve functional equations in the complex plane.

**Theorem**: If $f: \\mathbb{C} \\to \\mathbb{C}$ is analytic and satisfies $f(z + 1) = f(z)$ (periodicity), then $f$ has a Fourier series representation:
$$f(z) = \\sum_{n=-\\infty}^{\\infty} a_n e^{2\\pi i nz}$$

## 5. Applications

### 5.1 Number Theory

**Dirichlet Characters**: Functions $\\chi: \\mathbb{Z} \\to \\mathbb{C}$ satisfying:
- $\\chi(mn) = \\chi(m)\\chi(n)$ (multiplicativity)
- $\\chi(n + k) = \\chi(n)$ for some period $k$

These arise naturally in the study of L-functions and prime distribution.

### 5.2 Combinatorics

**Generating Functions**: If $G(x) = \\sum_{n=0}^{\\infty} a_n x^n$ satisfies a functional equation, it often leads to explicit formulas for the coefficients $a_n$.

**Example**: The Fibonacci generating function satisfies:
$$G(x) = x + xG(x) + x^2G(x)$$

Solving: $G(x) = \\frac{x}{1 - x - x^2}$

### 5.3 Mathematical Physics

**Scaling Laws**: In statistical mechanics, correlation functions often satisfy functional equations reflecting scale invariance:
$$f(\\lambda x) = \\lambda^\\alpha f(x)$$

Solutions are power laws: $f(x) = cx^\\alpha$.

## 6. Computational Methods

### 6.1 Numerical Approximation

For equations without closed-form solutions, numerical methods provide approximations:

1. **Discretization**: Replace continuous domains with discrete grids
2. **Iteration**: Use fixed-point iteration schemes
3. **Optimization**: Minimize residuals using least squares

### 6.2 Symbolic Computation

Computer algebra systems can:
- Verify solutions symbolically
- Generate series expansions
- Solve systems of functional equations

### 6.3 Machine Learning Approaches

Recent developments use neural networks to approximate solutions to functional equations, particularly useful for high-dimensional problems.

## 7. Open Problems and Future Directions

### 7.1 Regularity Questions

**Problem**: Characterize the minimal regularity assumptions needed for uniqueness of solutions to specific functional equations.

### 7.2 Non-commutative Extensions

Extend classical results to functional equations on groups, rings, and other algebraic structures.

### 7.3 Stochastic Functional Equations

Develop theory for functional equations involving random functions or stochastic processes.

### 7.4 Computational Complexity

Determine the computational complexity of solving various classes of functional equations.

## 8. Conclusion

This paper has surveyed both classical and modern approaches to functional equations. The field continues to evolve, with connections to diverse areas of mathematics and applications in physics, computer science, and engineering.

Key contributions include:
1. Systematic classification of solution techniques
2. Novel probabilistic and complex-analytic methods
3. Applications to contemporary problems
4. Computational approaches for practical solutions

Future research directions include regularity theory, non-commutative extensions, and computational methods. The interplay between pure mathematical theory and practical applications ensures that functional equations will remain an active and fruitful area of research.

## References

1. Aczél, J. (1966). *Lectures on Functional Equations and Their Applications*. Academic Press.
2. Kuczma, M. (1985). *An Introduction to the Theory of Functional Equations and Inequalities*. Polish Scientific Publishers.
3. Sahoo, P. K., & Kannappan, P. (2011). *Introduction to Functional Equations*. CRC Press.
4. Baron, K., & Jarczyk, W. (2020). "Recent results in the theory of functional equations." *Aequationes Mathematicae*, 94(2), 199-245.

## Acknowledgments

The author thanks the Department of Mathematics at Tribhuvan University for support and the anonymous reviewers for their valuable comments and suggestions.

---

*Corresponding author*: Prof. Sita Gurung, Department of Mathematics, Tribhuvan University, Kathmandu, Nepal. Email: sita.gurung@tu.edu.np
    `
  },
  "topology-modern-applications": {
    id: 6,
    title: "Topology and Its Modern Applications",
    description: "Exploring how topological concepts are revolutionizing data science and machine learning.",
    author: "Dr. Priya Sharma",
    date: "2024-11-28",
    tags: ["Topology", "Data Science", "Machine Learning"],
    content: `
# Topology and Its Modern Applications

## Abstract

This research paper explores the revolutionary applications of topological concepts in modern data science and machine learning. We examine how abstract mathematical structures from algebraic topology provide powerful tools for understanding high-dimensional data, persistent homology, and topological data analysis (TDA). Our work demonstrates the practical utility of these theoretical concepts in real-world applications.

**Keywords**: Algebraic topology, persistent homology, topological data analysis, machine learning, data science

## 1. Introduction

Topology, the study of spatial properties preserved under continuous deformations, has emerged as a powerful framework for analyzing complex data structures. Unlike traditional statistical methods that rely on metric properties, topological approaches focus on qualitative features that remain invariant under continuous transformations.

The fundamental insight is that data often possesses intrinsic geometric and topological structure that traditional methods fail to capture. By applying topological tools, we can:

- Identify holes, voids, and connected components in data
- Analyze the shape of data across multiple scales
- Provide robust methods insensitive to noise
- Discover hidden patterns in high-dimensional spaces

## 2. Mathematical Foundations

### 2.1 Basic Topological Concepts

**Definition 2.1** (Topological Space): A topological space $(X, \\tau)$ consists of a set $X$ and a collection $\\tau$ of subsets of $X$ (called open sets) satisfying:
1. $\\emptyset, X \\in \\tau$
2. Arbitrary unions of sets in $\\tau$ are in $\\tau$
3. Finite intersections of sets in $\\tau$ are in $\\tau$

**Definition 2.2** (Continuous Map): A function $f: X \\to Y$ between topological spaces is continuous if $f^{-1}(U)$ is open in $X$ for every open set $U$ in $Y$.

**Definition 2.3** (Homeomorphism): A bijective continuous map $f: X \\to Y$ with continuous inverse is called a homeomorphism. Spaces related by homeomorphisms are topologically equivalent.

### 2.2 Simplicial Complexes

**Definition 2.4** (Simplex): An $n$-simplex is the convex hull of $n+1$ affinely independent points in $\\mathbb{R}^d$. Examples:
- 0-simplex: point
- 1-simplex: line segment  
- 2-simplex: triangle
- 3-simplex: tetrahedron

**Definition 2.5** (Simplicial Complex): A simplicial complex $K$ is a collection of simplices such that:
1. If $\\sigma \\in K$ and $\\tau$ is a face of $\\sigma$, then $\\tau \\in K$
2. The intersection of any two simplices in $K$ is either empty or a common face

### 2.3 Homology Theory

Homology provides algebraic invariants that capture topological features.

**Definition 2.6** (Chain Complex): A chain complex $(C_*, \\partial_*)$ consists of abelian groups $C_n$ and boundary maps $\\partial_n: C_n \\to C_{n-1}$ such that $\\partial_{n-1} \\circ \\partial_n = 0$.

**Definition 2.7** (Homology Groups): The $n$-th homology group is:
$$H_n(C) = \\frac{\\ker(\\partial_n)}{\\text{im}(\\partial_{n+1})} = \\frac{Z_n}{B_n}$$

where $Z_n$ are $n$-cycles and $B_n$ are $n$-boundaries.

**Interpretation**:
- $H_0$: Connected components
- $H_1$: 1-dimensional holes (loops)
- $H_2$: 2-dimensional voids (cavities)
- $H_n$: $n$-dimensional holes

## 3. Persistent Homology

### 3.1 Filtrations

**Definition 3.1** (Filtration): A filtration of a topological space $X$ is a nested sequence:
$$\\emptyset = X_0 \\subseteq X_1 \\subseteq X_2 \\subseteq \\cdots \\subseteq X_n = X$$

In data analysis, filtrations are typically constructed using:
- **Vietoris-Rips complex**: $VR_r(P) = \\{\\sigma \\subseteq P : \\text{diam}(\\sigma) \\leq r\\}$
- **Čech complex**: $\\check{C}_r(P) = \\{\\sigma \\subseteq P : \\bigcap_{p \\in \\sigma} B_r(p) \\neq \\emptyset\\}$

### 3.2 Persistence Diagrams

**Definition 3.2** (Persistence Diagram): For a filtration with homology groups $H_k(X_i)$, the persistence diagram $\\text{Dgm}_k$ consists of points $(b, d)$ where:
- $b$ (birth): filtration index where a homological feature appears
- $d$ (death): filtration index where the feature disappears

**Theorem 3.1** (Stability Theorem): Let $f, g: X \\to \\mathbb{R}$ be tame functions with $\\|f - g\\|_\\infty \\leq \\epsilon$. Then:
$$W_\\infty(\\text{Dgm}(f), \\text{Dgm}(g)) \\leq \\epsilon$$

where $W_\\infty$ is the bottleneck distance.

### 3.3 Computational Algorithms

**Algorithm 3.1** (Standard Algorithm):
1. Construct filtration $K_1 \\subseteq K_2 \\subseteq \\cdots \\subseteq K_n$
2. Compute boundary matrices $\\partial_i$ for each $K_i$
3. Perform matrix reduction to identify birth-death pairs
4. Output persistence diagram

**Complexity**: $O(n^3)$ where $n$ is the number of simplices.

**Algorithm 3.2** (Persistent Cohomology):
Uses cohomology instead of homology for improved efficiency in certain cases.

## 4. Topological Data Analysis (TDA)

### 4.1 Point Cloud Analysis

Given a finite point cloud $P \\subset \\mathbb{R}^d$, TDA reveals:

1. **Clustering structure**: Connected components in $H_0$
2. **Loop structures**: 1-dimensional holes in $H_1$  
3. **Void structures**: Higher-dimensional holes in $H_k$

**Example 4.1**: For points sampled from a circle:
- $H_0$: Single connected component (persistent)
- $H_1$: One 1-dimensional hole (persistent)
- Higher homology: Trivial

### 4.2 Mapper Algorithm

**Algorithm 4.1** (Mapper):
1. Choose filter function $f: X \\to \\mathbb{R}^k$
2. Cover range of $f$ with overlapping intervals
3. Cluster points in each preimage $f^{-1}(U_i)$
4. Connect clusters with non-empty intersection
5. Output simplicial complex

**Applications**:
- Dimensionality reduction visualization
- Feature extraction
- Anomaly detection

### 4.3 Persistent Landscapes

**Definition 4.1** (Persistence Landscape): For persistence diagram $D$, the $k$-th landscape function is:
$$\\lambda_k(t) = \\max\\{\\min\\{t - b_i, d_i - t\\} : (b_i, d_i) \\in D, \\text{rank} = k\\}$$

**Properties**:
- Linear structure: $\\lambda(D_1 + D_2) = \\lambda(D_1) + \\lambda(D_2)$
- Stability: $\\|\\lambda(D_1) - \\lambda(D_2)\\|_\\infty \\leq W_\\infty(D_1, D_2)$
- Statistical analysis: Enable hypothesis testing and confidence intervals

## 5. Machine Learning Applications

### 5.1 Feature Engineering

Topological features provide robust descriptors for machine learning:

**Persistence Images**: Convert persistence diagrams to fixed-size vectors:
$$\\rho(x, y) = \\sum_{(b,d) \\in D} w(b,d) \\cdot \\phi\\left(\\frac{x-b}{\\sigma}, \\frac{y-d}{\\sigma}\\right)$$

where $w(b,d) = (d-b)^p$ is a weighting function and $\\phi$ is a Gaussian kernel.

**Persistence Curves**: Integrate landscapes over parameter ranges:
$$PC_k(t) = \\int_0^t \\lambda_k(s) ds$$

### 5.2 Deep Learning Integration

**Topological Neural Networks**: Incorporate topological constraints into neural architectures:

$$L_{\\text{total}} = L_{\\text{task}} + \\alpha L_{\\text{topology}}$$

where $L_{\\text{topology}}$ penalizes deviations from desired topological properties.

**Differentiable Topology**: Recent advances enable backpropagation through topological computations:
- Differentiable persistent homology
- Topological regularization
- Geometric deep learning

### 5.3 Anomaly Detection

Topological methods excel at detecting anomalies:

**Local Outlier Factor (LOF) Enhancement**:
$$LOF_{\\text{topo}}(p) = \\frac{\\sum_{q \\in N(p)} \\text{pers}(q)}{|N(p)| \\cdot \\text{pers}(p)}$$

where $\\text{pers}(p)$ measures local topological complexity around point $p$.

## 6. Applications in Data Science

### 6.1 Biological Data Analysis

**Protein Structure Analysis**:
- Alpha shapes for molecular surfaces
- Persistent homology for binding sites
- Topological fingerprints for drug discovery

**Genomics**:
- Phylogenetic tree analysis
- Gene regulatory network topology
- Single-cell RNA sequencing

### 6.2 Image and Signal Processing

**Image Analysis**:
- Texture classification using persistent homology
- Shape recognition via topological descriptors
- Medical image segmentation

**Signal Processing**:
- Time series analysis with sliding window embeddings
- Audio classification using topological features
- Sensor network analysis

### 6.3 Social Network Analysis

**Network Topology**:
- Community detection via persistent homology
- Information flow analysis
- Robustness and vulnerability assessment

**Temporal Networks**:
- Dynamic community evolution
- Persistent structures in time-varying graphs
- Prediction of network changes

### 6.4 Financial Data Analysis

**Market Structure**:
- Correlation network topology
- Systemic risk assessment
- Portfolio optimization with topological constraints

**Algorithmic Trading**:
- Pattern recognition in price data
- Regime change detection
- Risk management using topological indicators

## 7. Computational Considerations

### 7.1 Scalability Challenges

**Memory Complexity**: Storing simplicial complexes requires $O(n^d)$ space for $n$ points in dimension $d$.

**Time Complexity**: Standard algorithms have cubic complexity in the number of simplices.

**Solutions**:
- Sparse representations
- Approximation algorithms
- Parallel and distributed computing

### 7.2 Software Tools

**GUDHI**: Comprehensive C++/Python library for TDA
**Ripser**: Fast persistent homology computation
**scikit-tda**: Python ecosystem for topological data analysis
**TDA-tools**: R packages for statistical analysis

### 7.3 Approximation Methods

**Landmark Selection**: Reduce computational burden by selecting representative points:
$$L \\subset P, |L| \\ll |P|$$

**Random Projections**: Preserve topological features in lower dimensions with high probability.

**Sparse Rips**: Use only edges shorter than threshold to reduce complex size.

## 8. Case Studies

### 8.1 Cancer Research

**Problem**: Classify breast cancer subtypes from gene expression data.

**Approach**:
1. Apply Mapper to visualize patient population
2. Identify topological features distinguishing subtypes
3. Use persistent homology for biomarker discovery

**Results**: Achieved 95% classification accuracy, identified novel therapeutic targets.

### 8.2 Climate Science

**Problem**: Analyze extreme weather patterns in climate data.

**Approach**:
1. Construct point clouds from meteorological measurements
2. Apply persistent homology to identify recurring patterns
3. Use topological features for prediction models

**Results**: Improved prediction accuracy by 15%, discovered new climate oscillation patterns.

### 8.3 Materials Science

**Problem**: Characterize porous materials for energy storage.

**Approach**:
1. Generate 3D point clouds from X-ray tomography
2. Compute persistent homology of pore structure
3. Correlate topological features with material properties

**Results**: Established structure-property relationships, optimized material design.

## 9. Future Directions

### 9.1 Theoretical Developments

**Multiparameter Persistence**: Extend to filtrations with multiple parameters:
$$K_{r,s} = \\{\\sigma : \\text{diam}(\\sigma) \\leq r, |\\sigma| \\leq s\\}$$

**Quantum Topology**: Applications to quantum computing and quantum machine learning.

**Categorical Approaches**: Use category theory for more general topological invariants.

### 9.2 Computational Advances

**GPU Acceleration**: Parallel algorithms for persistent homology computation.

**Streaming Algorithms**: Process large datasets that don't fit in memory.

**Approximate Methods**: Trade accuracy for computational efficiency.

### 9.3 Application Areas

**Artificial Intelligence**: Topological approaches to explainable AI and robustness.

**Robotics**: Path planning and sensor fusion using topological methods.

**Neuroscience**: Brain network analysis and cognitive modeling.

**Economics**: Market topology and systemic risk analysis.

## 10. Conclusion

This paper has demonstrated the transformative potential of topological methods in modern data science and machine learning. Key contributions include:

1. **Theoretical Framework**: Rigorous mathematical foundation for topological data analysis
2. **Computational Methods**: Efficient algorithms for practical applications
3. **Machine Learning Integration**: Novel approaches combining topology with deep learning
4. **Real-world Applications**: Successful case studies across diverse domains

The field of topological data analysis continues to evolve rapidly, with new theoretical insights and practical applications emerging regularly. The intersection of pure mathematics and applied data science exemplifies the power of abstract mathematical concepts to solve real-world problems.

As data becomes increasingly complex and high-dimensional, topological methods provide essential tools for understanding structure, extracting features, and making predictions. The future promises even more exciting developments as researchers continue to bridge the gap between abstract topology and practical data analysis.

## Acknowledgments

The author thanks the International Centre for Theoretical Physics (ICTP) for hosting the workshop on "Topology in Data Science" and the Nepal Mathematical Society for supporting this research. Special thanks to collaborators at various institutions who provided valuable insights and feedback.

## References

1. Carlsson, G. (2009). Topology and data. *Bulletin of the American Mathematical Society*, 46(2), 255-308.

2. Edelsbrunner, H., & Harer, J. (2010). *Computational topology: an introduction*. American Mathematical Society.

3. Ghrist, R. (2014). *Elementary applied topology*. Createspace Independent Publishing Platform.

4. Oudot, S. Y. (2015). *Persistence theory: from quiver representations to data analysis*. American Mathematical Society.

5. Chazal, F., & Michel, B. (2021). An introduction to topological data analysis: fundamental and practical aspects for data scientists. *Frontiers in Artificial Intelligence*, 4, 667963.

---

*Corresponding author*: Dr. Priya Sharma, Department of Mathematics and Computer Science, Kathmandu University, Nepal. Email: priya.sharma@ku.edu.np
    `,
  },
}

export default function ResearchPage() {
  const params = useParams()
  const slug = params.slug as string
  const research = researchData[slug]

  // Add a dummy filePath for demonstration if not present
  if (research && !research.filePath && research.downloadLink) {
    research.filePath = research.downloadLink;
  }

  if (!research) {
    return (
      <div className="min-h-screen overflow-x-hidden">

        <MinFloatingElements />
        <Navigation />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Research Paper Not Found</h1>
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

      {/* Research Header */}
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
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">R</span>
                </div>
                <span className="text-min-accent text-sm font-medium">Research Paper</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 min-gradient-accent">
                {research.title}
              </h1>

              <p className="text-white/80 text-lg leading-relaxed mb-6">{research.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{research.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(research.date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {research.tags.map((tag: string, index: number) => (
                  <span key={index} className="glass px-3 py-1 rounded-full text-xs text-white/80 flex items-center">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Research Content */}
      <section className="pb-20 relative z-10">
        <div className="max-w-4xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8"
          >
            {research.filePath ? (
              <div className="glass-card p-6 rounded-lg">
                <p className="text-white/90 leading-relaxed">Content from file: {research.filePath}</p>
              </div>
            ) : (
              <p className="text-white/70">No content or file path available for this research paper.</p>
            )}
          </motion.div>
          {research.downloadLink && (
             <div className="mt-8 text-center">
               <Link
                 href={research.downloadLink}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="glass-button inline-flex items-center justify-center px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105"
               >
                 <Download className="w-5 h-5 mr-2" /> Download Research Paper
               </Link>
             </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
