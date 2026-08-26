/**
 * Post-process markdown HTML to inject inline styles on every element.
 * Uses official MIN Deep Teal design system (#16556D, #0D3D52, #1A6B87) for WCAG AAA accessibility.
 */
export function inlineEmailStyles(html) {
  if (!html) return ''
  return html
    .replace(/<h1(?![^>]*style)/gi, '<h1 style="color: #0D3D52; font-size: 24px; font-weight: 800; letter-spacing: -0.03em; margin: 0 0 18px 0; line-height: 1.25;"')
    .replace(/<h2(?![^>]*style)/gi, '<h2 style="color: #16556D; font-size: 20px; font-weight: 800; letter-spacing: -0.025em; margin: 0 0 16px 0; line-height: 1.35;"')
    .replace(/<h3(?![^>]*style)/gi, '<h3 style="color: #1A6B87; font-size: 16px; font-weight: 700; letter-spacing: -0.01em; margin: 24px 0 10px 0; line-height: 1.4;"')
    .replace(/<h4(?![^>]*style)/gi, '<h4 style="color: #16556D; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 20px 0 8px 0;"')
    .replace(/<p(?![^>]*style)/gi, '<p style="color: #222225; font-size: 15px; line-height: 1.75; margin: 0 0 16px 0;"')
    .replace(/<a(?![^>]*style)/gi, '<a style="color: #16556D; text-decoration: none; font-weight: 700; border-bottom: 1.5px solid rgba(22, 85, 109, 0.4);"')
    .replace(/<strong(?![^>]*style)/gi, '<strong style="color: #0D3D52; font-weight: 750;"')
    .replace(/<em(?![^>]*style)/gi, '<em style="color: #444448; font-style: italic;"')
    .replace(/<ul(?![^>]*style)/gi, '<ul style="color: #222225; font-size: 15px; line-height: 1.8; padding-left: 24px; margin: 0 0 18px 0;"')
    .replace(/<ol(?![^>]*style)/gi, '<ol style="color: #222225; font-size: 15px; line-height: 1.8; padding-left: 24px; margin: 0 0 18px 0;"')
    .replace(/<li(?![^>]*style)/gi, '<li style="color: #222225; margin-bottom: 8px;"')
    .replace(/<blockquote(?![^>]*style)/gi, '<blockquote style="border-left: 4px solid #16556D; margin: 20px 0; padding: 14px 20px; background-color: #F2F8FA; border-radius: 0 12px 12px 0; color: #16556D; font-style: italic; line-height: 1.7; border-top: 1px solid #E3F1F5; border-right: 1px solid #E3F1F5; border-bottom: 1px solid #E3F1F5;"')
    .replace(/<code(?![^>]*style)/gi, '<code style="background-color: #E8F4F8; padding: 2px 7px; border-radius: 6px; font-size: 13px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; color: #0D3D52; border: 1px solid #D4EBF2;"')
    .replace(/<pre(?![^>]*style)/gi, '<pre style="background-color: #0D3D52; color: #F6F094; padding: 18px; border-radius: 14px; overflow-x: auto; font-size: 13px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; line-height: 1.6; margin: 18px 0; border: 1px solid #16556D;"')
    .replace(/<hr(?![^>]*style)/gi, '<hr style="border: none; border-top: 1px solid #E5E5EA; margin: 26px 0;"')
    .replace(/<table(?![^>]*style)/gi, '<table style="border-collapse: collapse; width: 100%; margin: 18px 0; border: 1px solid #D4EBF2; border-radius: 10px; overflow: hidden;"')
    .replace(/<th(?![^>]*style)/gi, '<th style="background-color: #E8F4F8; border: 1px solid #D4EBF2; padding: 10px 14px; text-align: left; font-size: 13px; font-weight: 700; color: #0D3D52;"')
    .replace(/<td(?![^>]*style)/gi, '<td style="border: 1px solid #E5E5EA; padding: 10px 14px; text-align: left; font-size: 14px; color: #222225;"')
}

export const SYSTEM_EMAIL_TEMPLATES = [
  // ─── APPLICATION PIPELINE (6 STAGES) ───────────────────────────
  {
    id: 'application_received',
    name: 'Stage 1: Application Received & Process Roadmap',
    category: 'Applications',
    description: 'Sent immediately upon submission. Expresses heartfelt gratitude and provides a complete transparent roadmap of review stages.',
    action: 'Triggered on new join application submission',
    from_name: 'Mathematics Initiatives in Nepal',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['applicant_name', 'form_name', 'batch_name', 'deadline_date'],
    sample_variables: {
      applicant_name: 'Aayush Sharma',
      form_name: 'Content & Editorial Contributor',
      batch_name: 'Spring 2026 Cohort',
      deadline_date: 'September 15, 2026'
    },
    subject: '✨ We received your application for {{form_name}} — MIN Nepal',
    body_markdown: `## Dear {{applicant_name}},

First and foremost, **thank you** for taking the time, energy, and thoughtfulness to apply for the **{{form_name}}** role ({{batch_name}}) with **Mathematics Initiatives in Nepal (MIN)**.

Every application we receive represents a shared dream: to make mathematics engaging, accessible, and deeply empowering for students, educators, and curious minds across all 7 provinces of Nepal. Knowing that you want to dedicate your skills to this mission means the world to our team.

---

### What Happens Next? Our 5-Stage Journey

We believe in a transparent, human-centered recruitment process where every candidate is evaluated with holistic care:

1. **Phase 1: Holistic Review (Ongoing until {{deadline_date}})**  
   Our selection committee reads through every submission carefully. We look beyond conventional credentials to understand your genuine enthusiasm, unique perspective, and creative drive.

2. **Phase 2: Status & Outcome Update**  
   Shortly after the application deadline closes, you will receive an official email update regarding your status. No one is left wondering.

3. **Phase 3: Interactive Task Pool (For Shortlisted Candidates)**  
   Rather than theoretical tests, shortlisted applicants gain access to our open **Task Bank**. You will have the freedom to select a practical project that best showcases your natural strengths and interests.

4. **Phase 4: Exploratory Dialogue & Interview**  
   A relaxed, two-way conversation with our team leads. We want to know your aspirations, the ideas you want to bring to life, and how we can support your personal and academic growth.

5. **Phase 5: Orientation & Buddy Welcome**  
   Selected members are warmly onboarded into our active workspace with a dedicated peer mentor (Buddy) to help you thrive from day one.

---

> *"Mathematics is not about numbers, equations, computations, or algorithms: it is about understanding."* — William Paul Thurston

There is nothing you need to do at this moment. Please sit tight while our team completes the review cycle. If you have any urgent questions or updates in the meantime, feel free to reply directly to this email.

With warmest regards and gratitude,  
**The Recruitment & People Team**  
*Mathematics Initiatives in Nepal (MIN)*`
  },
  {
    id: 'application_accepted',
    name: 'Stage 2a: Shortlisted — Task Pool Selection',
    category: 'Applications',
    description: 'Sent when an applicant passes initial review. Welcomes them into the Application Pool and invites them to choose a practical task.',
    action: 'Triggered when application is shortlisted/accepted for task round',
    from_name: 'Mathematics Initiatives in Nepal',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['applicant_name', 'form_name', 'task_bank_url', 'task_deadline'],
    sample_variables: {
      applicant_name: 'Priya Adhikari',
      form_name: 'Executive Committee Member',
      task_bank_url: 'https://www.mathsinitiatives.org.np/tasks',
      task_deadline: 'October 1, 2026'
    },
    subject: '✨ You’ve Been Selected to Advance — Welcome to the Next Chapter of MIN Nepal',
    body_markdown: `## Dear {{applicant_name}},

On behalf of the entire Selection Committee at **Mathematics Initiatives in Nepal (MIN)**, it is our distinct honor and genuine delight to share that your application for **{{form_name}}** has been **selected to advance to the next stage**.

Every year, we have the immense privilege of reading applications from some of the most gifted students, curious thinkers, and dedicated educators across Nepal and beyond. Among an exceptionally talented pool of applicants, your submission stood out with remarkable clarity. What resonated deeply with our committee was not merely your credentials, but your authentic spark, your intellectual courage, and your clear passion for democratizing mathematical excellence.

---

### Welcome to the MIN Maker & Problem-Solving Round

At MIN, we draw inspiration from communities where great things are built through craft, deep work, and boundless curiosity. We believe that real talent and leadership cannot be measured on a rigid questionnaire or a standardized score. 

Instead, we want to see **how you think**, **how you build**, and **how you bring ideas to life**. 

We have prepared our **Collaborative Task Bank** — a curated spectrum of real-world challenges spanning mathematical exposition, problem design, creative storytelling, technical tools, and community architecture:

1. **Explore the Spectrum:** Visit the [MIN Task Bank Portal]({{task_bank_url}}) to review the active project briefs.
2. **Choose What Inspires You:** Pick **one project** that genuinely excites you and aligns with your natural strengths, curiosity, and creative style.
3. **Craft Your Submission:** Complete your project and submit your materials by **{{task_deadline}}**.

---

### What We Value Most in Your Work

> *"Here’s to the crazy ones, the misfits, the rebels... the ones who see things differently. Because the people who are crazy enough to think they can change the world are the ones who do."*

When our reviewers review your work, we are not looking for sterile perfection. We look for:
- **Depth of Insight:** A thoughtful, rigorous approach that digs beneath the surface.
- **Clarity of Communication:** The ability to take a complex idea and make it intuitive, beautiful, and accessible.
- **Originality & Craft:** Your unique voice, care for detail, and authentic dedication.

---

### How to Submit Your Completed Task

You can submit your completed project materials (Google Docs link, GitHub repository, Figma link, or PDF document) in either of two convenient ways:

1. 📧 **Direct Email Reply:** Simply reply to this email (\`website@mathsinitiatives.org.np\`) with your project links, attachments, and any notes for the reviewers.
2. 💬 **MIN Communication Channel:** If you have been invited to our official **Discord, Slack, or Telegram workspace**, you can submit your materials directly in the \`#task-submissions\` channel.

---

### Academic Flexibility & Support

We know you are balancing academic coursework, exams, and personal commitments. If you have an upcoming exam, need a reasonable deadline extension, or want clarification on any project brief, please reach out by replying directly to this email. We are here to support you every step of the way.

Take your time, trust your intuition, and build something you are genuinely proud of. We cannot wait to experience what you create.

With our warmest congratulations and highest regards,

**The Admissions & Selection Committee**  
*Mathematics Initiatives in Nepal (MIN)*  
[mathsinitiatives.org.np](https://www.mathsinitiatives.org.np)`
  },
  {
    id: 'application_rejected',
    name: 'Stage 2b: Respectful & Encouraging Disposition',
    category: 'Applications',
    description: 'Warm, thoughtful, empathetic update sent when an application cannot be accepted for the current cohort.',
    action: 'Triggered when application cannot be accommodated in current cycle',
    from_name: 'Mathematics Initiatives in Nepal',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['applicant_name', 'form_name'],
    sample_variables: {
      applicant_name: 'Sujan Thapa',
      form_name: 'Content & Editorial Contributor'
    },
    subject: 'A Thoughtful Note Regarding Your Application to MIN Nepal — {{applicant_name}}',
    body_markdown: `## Dear {{applicant_name}},

First and foremost, we want to thank you from the bottom of our hearts for the vulnerability, energy, and thoughtfulness you poured into your application for **{{form_name}}** with **Mathematics Initiatives in Nepal (MIN)**.

Putting yourself forward, articulating your ideas, and sharing your journey with a new community takes real courage. Our Selection Committee spent extensive time reading through your responses, and we came away deeply inspired by your curiosity, your commitment to learning, and your desire to contribute to Nepal's mathematical ecosystem.

---

### A Sincere & Transparent Decision

This recruitment cycle brought an unprecedented number of exceptional candidates from across all 7 provinces and the global diaspora. Because our current operational programs and cohort mentorship capacity are intentionally small to ensure close, individualized collaboration, we face the heartbreaking reality of having far fewer positions than extraordinary applicants.

After a thorough and holistic review of all submissions, **we are unable to offer you a position in this specific intake cohort.**

We want to share this truth with complete conviction: **this decision is strictly a mathematical reality of finite capacity and immediate project scope. It is in no way a reflection of your intellect, your creative ceiling, or your immense worth as a mathematician and leader.**

Admissions and selection processes are snapshots of a single moment in time under specific constraints. Some of the most visionary mathematicians, scientists, and inventors throughout history were defined not by a single acceptance letter, but by their relentless curiosity, resilience, and love for the craft.

---

### Our Doors Remain Wide Open to You

Our mission at MIN is to empower every curious mind across Nepal, and that journey extends far beyond any single team intake. We genuinely hope this is the beginning of a lasting relationship:

- **Open Academic Exposition:** Our open library and blog are always open. If you have an Olympiad problem solution, an essay on pure mathematics, or an educational perspective to share, we would be honored to publish and celebrate your work.
- **Workshops & Math Circles:** You have an open invitation to participate in all our public webinars, proof-writing workshops, and Olympiad preparation seminars.
- **Future Cohorts:** We have kept your profile in our candidate registry. When our next intake opens or new specialized initiatives launch, you will receive priority notice, and we strongly encourage you to re-apply.

---

> *"The pursuit of mathematics is a journey of asking questions that no one has answered yet, and having the courage to explore uncharted terrain. Never lose that spark."*

Thank you once again for sharing your time and vision with us. We wish you boundless success, clarity, and joy in all your academic and personal endeavors.

With our deepest gratitude, respect, and warmest regards,

**The Leadership & Selection Committee**  
*Mathematics Initiatives in Nepal (MIN)*  
[mathsinitiatives.org.np](https://www.mathsinitiatives.org.np)`
  },
  {
    id: 'application_task_assigned',
    name: 'Stage 3: Task Round Instructions & Support',
    category: 'Applications',
    description: 'Provides direct links, guidelines, and encouraging tips for completing the practical task round.',
    action: 'Triggered when applicant enters TASK_ASSIGNED stage',
    from_name: 'Mathematics Initiatives in Nepal',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['applicant_name', 'task_bank_url', 'task_deadline'],
    sample_variables: {
      applicant_name: 'Priya Adhikari',
      task_bank_url: 'https://www.mathsinitiatives.org.np/tasks',
      task_deadline: 'October 1, 2026'
    },
    subject: '📋 Your Task Round Guide & Next Steps — MIN Nepal',
    body_markdown: `## Hello {{applicant_name}},

We hope you are having an inspiring week!

This is a quick guide to help you smoothly navigate your **MIN Practical Task Round**.

---

### 📌 Key Information:
- **Task Bank Portal:** [Browse Available Tasks]({{task_bank_url}})
- **Submission Deadline:** **{{task_deadline}}**

### 💡 Guidance for Your Submission:
- **Focus on Depth & Clarity:** Whether drafting a mathematical explanation, designing a visual layout, or proposing an outreach strategy, clarity and attention to detail are what make submissions shine.
- **Originality Counts:** We love creative perspectives, authentic examples, and fresh ways of making challenging mathematical ideas intuitive.
- **Formatting:** Ensure any shared links (Google Docs, Figma, GitHub, or PDF files) have proper viewing permissions enabled so our reviewers can access them without delays.

---

### 🚀 How to Submit Your Materials:

You can submit your completed materials through either channel:
1. 📧 **Direct Email Reply:** Simply reply to this email thread (\`website@mathsinitiatives.org.np\`) with your project links or attachments.
2. 💬 **MIN Communication Channel:** If you are already added to our team **Discord, Slack, or Telegram workspace**, post your submission link in the designated \`#task-submissions\` channel.

If anything is unclear or if you require an extension due to unforeseen academic commitments (exams, coursework), simply reach out to us early by replying to this thread.

We look forward to reviewing your wonderful work!

Warm regards,  
**MIN Recruitment & Mentorship Team**`
  },
  {
    id: 'application_interview',
    name: 'Stage 4: Warm Interview & Dialogue Invitation',
    category: 'Applications',
    description: 'Sent after a successful task evaluation. Invites the candidate to schedule a friendly, two-way exploratory dialogue.',
    action: 'Triggered when applicant is invited to INTERVIEW stage',
    from_name: 'Mathematics Initiatives in Nepal',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['applicant_name', 'form_name', 'scheduling_url'],
    sample_variables: {
      applicant_name: 'Priya Adhikari',
      form_name: 'Executive Committee Member',
      scheduling_url: 'https://cal.com/min-nepal/interview'
    },
    subject: '🌟 We loved your work! Let\'s connect: Interview Invitation — MIN Nepal',
    body_markdown: `## Fantastic work, {{applicant_name}}!

Our evaluation committee has thoroughly reviewed your practical task submission for **{{form_name}}**, and we were deeply impressed by your creativity, execution, and thoughtfulness.

We would love to invite you to the next stage: **an exploratory conversation with our core team**.

---

### What to Expect

Please don't worry — this is not an interrogation or a high-pressure exam! It is a friendly, relaxed 20-30 minute conversation where we want to:

- Learn more about your story, background, and what drives your curiosity in mathematics.
- Discuss how you envision contributing to MIN and the specific initiatives you would like to champion.
- Answer all your questions about our team culture, upcoming milestones, and day-to-day collaboration.

---

### 📅 Choose Your Preferred Time Slot

Please use our calendar link below to choose a time that fits your schedule best:

👉 **[Book Your Interview Time Slot]({{scheduling_url}})**

Once booked, you will automatically receive a calendar invite containing the Google Meet / Zoom link. If none of the available slots work for your timezone or schedule, reply to this email with your availability and we will gladly arrange an alternative.

We are truly looking forward to meeting you!

With excitement,  
**The MIN Interview & Leadership Panel**`
  },
  {
    id: 'application_onboarded',
    name: 'Stage 5: Official Welcome & Onboarding Package',
    category: 'Applications',
    description: 'Sent upon successful completion of all stages. Introduces their dedicated Buddy, workspace access, and orientation timeline.',
    action: 'Triggered when candidate is ONBOARDED into the MIN team',
    from_name: 'Mathematics Initiatives in Nepal',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['applicant_name', 'form_name', 'buddy_name', 'buddy_email', 'team_name'],
    sample_variables: {
      applicant_name: 'Priya Adhikari',
      form_name: 'Executive Committee Member',
      buddy_name: 'Rajan Shrestha',
      buddy_email: 'rajan@mathsinitiatives.org.np',
      team_name: 'Academic Content & Research Wing'
    },
    subject: '🎉 Welcome to the Family, {{applicant_name}}! You are officially part of MIN Nepal',
    body_markdown: `## Welcome home, {{applicant_name}}! 🎊

On behalf of the entire community at **Mathematics Initiatives in Nepal (MIN)**, it is our absolute joy and privilege to officially welcome you as a member of our team in the **{{team_name}}**!

You navigated every stage of our selection process with excellence, passion, and integrity. We could not be more excited about the energy, perspective, and ideas you bring to our shared mission.

---

### 🤝 Meet Your Onboarding Buddy

To make sure you feel completely supported and at home from day one, we have paired you with a dedicated peer mentor:

- **Buddy Name:** **{{buddy_name}}**
- **Buddy Email:** [{{buddy_email}}](mailto:{{buddy_email}})
- **Their Role:** Your go-to guide for answering questions, showing you around our workflows, introducing you to teammates, and ensuring a seamless transition.

{{buddy_name}} will reach out to you within the next 48 hours to say hello and arrange an informal 1-on-1 welcome chat.

---

### 🚀 What to Expect in Your First Week

1. **Workspace Invitations:** You will receive invitations to our official communication channels (Discord / Slack / WhatsApp workspace) and shared knowledge repositories.
2. **Orientation Session:** An interactive team orientation where we will walk through our current semester roadmap, ongoing publications, and collaborative projects.
3. **Your First Initiative:** Working alongside your team lead and buddy, you will identify your first impact project.

---

> *"Alone we can do so little; together we can do so much."* — Helen Keller

Thank you for choosing to dedicate your time and passion to mathematics in Nepal. Together, we are going to create meaningful change that touches thousands of students across the nation.

Welcome aboard! We are honored to build the future with you.

With the warmest celebration and respect,  
**Executive Committee & All of Us at MIN Nepal**  
*Mathematics Initiatives in Nepal*`
  },
  {
    id: 'submission_received',
    name: 'Content Submission Received & Review Notice',
    category: 'Content',
    description: 'Sent to contributors when they submit an article, Olympiad problem solution, or pedagogical resource.',
    action: 'Triggered upon public content submission',
    from_name: 'Mathematics Initiatives in Nepal',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['applicant_name', 'content_title'],
    sample_variables: {
      applicant_name: 'Bibek Pokharel',
      content_title: 'Olympiad Number Theory: Modular Arithmetic Essentials & Problem Sets'
    },
    subject: '📚 We received your submission: "{{content_title}}" — MIN Nepal',
    body_markdown: `## Dear {{applicant_name}},

Thank you so much for contributing your work, **"{{content_title}}"**, to the academic knowledge repository of **Mathematics Initiatives in Nepal (MIN)**.

Creating quality mathematical literature, well-crafted problem solutions, and rigorous expository articles requires deep thought, patience, and effort. We appreciate your generosity in sharing your knowledge with students and educators across Nepal.

---

### Editorial Review Process
Our Editorial & Review Board is currently reviewing your submission for:
- Mathematical accuracy and logical rigor
- Notation consistency (LaTeX formatting standards)
- Pedagogical clarity and accessibility for young learners

You will receive an email update as soon as the review is complete. If our editors have minor suggestions or formatting enhancements, they will coordinate with you directly.

Thank you for championing mathematical excellence!

Warm regards,  
**MIN Editorial & Publications Board**`
  },
  {
    id: 'content_approved',
    name: 'Content Approved & Live Publication Celebration',
    category: 'Content',
    description: 'Sent to an author when their submitted mathematics material is approved and published on the live platform.',
    action: 'Triggered when admin publishes a submission',
    from_name: 'Mathematics Initiatives in Nepal',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['applicant_name', 'content_title'],
    sample_variables: {
      applicant_name: 'Bibek Pokharel',
      content_title: 'Olympiad Number Theory: Modular Arithmetic Essentials & Problem Sets'
    },
    subject: '🎉 Your article "{{content_title}}" is officially published live! — MIN Nepal',
    body_markdown: `## Congratulations, {{applicant_name}}!

We are delighted to inform you that your submission, **"{{content_title}}"**, has successfully passed our peer review process and is **now live** on the official MIN Nepal platform!

Your contribution is now accessible to thousands of high school and university students, Olympiad aspirants, and mathematics enthusiasts across the nation.

---

### Share Your Work
We encourage you to share your published piece with your peers, students, and academic circles. Your name has been credited as the primary author on the official page.

Thank you once again for your dedication to advancing mathematical literacy and open academic access in Nepal. We look forward to seeing your future contributions!

With gratitude and celebration,  
**The Editorial Board & Executive Committee**  
*Mathematics Initiatives in Nepal*`
  },
  {
    id: 'inquiry_received',
    name: 'General Contact & Inquiry Acknowledgment',
    category: 'Inquiries',
    description: 'Automatic friendly response confirming receipt of general contact inquiries from the website.',
    action: 'Triggered on contact form submission',
    from_name: 'Mathematics Initiatives in Nepal',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['applicant_name', 'contact_message'],
    sample_variables: {
      applicant_name: 'Anjali Shrestha',
      contact_message: 'We would love to collaborate on organizing a district-wide mathematics festival in Pokhara.'
    },
    subject: '📬 We received your message — Mathematics Initiatives in Nepal',
    body_markdown: `## Dear {{applicant_name}},

Thank you for reaching out to **Mathematics Initiatives in Nepal (MIN)**.

We have safely received your inquiry, and our communications team is reviewing your message:

> *"{{contact_message}}"*

We strive to respond to all community inquiries within **2 to 4 business days**. If your inquiry is time-sensitive or relates to an urgent upcoming competition, please feel free to follow up on this thread.

Thank you for your interest and support for mathematical education in Nepal!

Warm regards,  
**MIN Communications & Public Relations Wing**`
  },
  {
    id: 'inquiry_responded',
    name: 'Contact Inquiry Follow-Up & Discussion',
    category: 'Inquiries',
    description: 'Sent when staff marks an inquiry as addressed and initiates ongoing correspondence.',
    action: 'Triggered when staff responds to an inquiry',
    from_name: 'Mathematics Initiatives in Nepal',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['applicant_name', 'contact_message'],
    sample_variables: {
      applicant_name: 'Anjali Shrestha',
      contact_message: 'We would love to collaborate on organizing a district-wide mathematics festival in Pokhara.'
    },
    subject: 'Regarding your inquiry with MIN Nepal — {{applicant_name}}',
    body_markdown: `## Dear {{applicant_name}},

Thank you for your patience while our team reviewed your message regarding:

> *"{{contact_message}}"*

One of our designated coordinators is actively following up on this matter. If you have additional documents, proposals, or questions to share, simply reply directly to this email.

We look forward to connecting and collaborating with you.

With sincere regards,  
**Mathematics Initiatives in Nepal (MIN)**`
  },
  {
    id: 'ambassadorship_submission',
    name: 'Ambassador Application Received',
    category: 'Ambassadors',
    description: 'Sent when a student or educator applies for the MIN Regional Ambassador program.',
    action: 'Triggered on ambassador application submission',
    from_name: 'Mathematics Initiatives in Nepal',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['applicant_name'],
    sample_variables: {
      applicant_name: 'Rohan Karki'
    },
    subject: '🌟 Ambassador Application Received — MIN Nepal',
    body_markdown: `## Dear {{applicant_name}},

Thank you for stepping forward to apply for the **MIN Ambassador Program**!

Ambassadors are the heartbeat of our grassroots outreach across schools, colleges, and regional communities. Your desire to represent MIN, host math circles, and mentor peers in your locality is truly commendable.

Our regional selection team is currently reviewing all ambassador nominations and will reach out with the results and orientation roadmap soon.

Stay curious and keep inspiring!

Warmly,  
**MIN Ambassador Network Leadership**`
  },
  {
    id: 'ambassadorship_accepted',
    name: 'Ambassador Welcome & Toolkit Delivery',
    category: 'Ambassadors',
    description: 'Sent when an ambassador applicant is approved. Delivers the welcome toolkit and next steps.',
    action: 'Triggered when ambassador status is approved',
    from_name: 'Mathematics Initiatives in Nepal',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['applicant_name'],
    sample_variables: {
      applicant_name: 'Rohan Karki'
    },
    subject: '🎉 Welcome to the Network! You are officially a MIN Ambassador — {{applicant_name}}',
    body_markdown: `## Congratulations and welcome aboard, {{applicant_name}}! 🌟

We are absolutely thrilled to inform you that your application for the **MIN Ambassador Program** has been **officially approved**!

As an ambassador, you represent the spirit of mathematical exploration, intellectual curiosity, and community empowerment in your institution and region.

---

### Your Next Steps:
1. **Ambassador Toolkit:** You will receive the official digital starter pack containing event blueprints, competition guidelines, presentation decks, and branding assets.
2. **Ambassadors Circle:** You are being added to our dedicated network group where ambassadors from across Nepal share ideas and organize joint initiatives.
3. **Regional Lead Connect:** Your regional coordinator will reach out to help you plan your first local initiative.

We are so proud to have you represent MIN. Let's make mathematics unforgettable!

Proudly and warmly,  
**The MIN Ambassador Council & Executive Board**`
  },
  {
    id: 'ambassadorship_rejected',
    name: 'Ambassador Application Encouraging Update',
    category: 'Ambassadors',
    description: 'Empathetic update sent when an ambassador application cannot be accommodated in the current cycle.',
    action: 'Triggered when ambassador application is declined',
    from_name: 'Mathematics Initiatives in Nepal',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['applicant_name'],
    sample_variables: {
      applicant_name: 'Rohan Karki'
    },
    subject: 'Update regarding your MIN Ambassador Application — {{applicant_name}}',
    body_markdown: `## Dear {{applicant_name}},

Thank you so much for your passion and interest in representing **Mathematics Initiatives in Nepal (MIN)** as a regional ambassador.

Due to strict regional cohort allocations and quota limits for this recruitment window, we are unable to offer you an official ambassador appointment at this time.

Please know that this does not diminish our appreciation for your leadership and love for mathematics. You are warmly encouraged to join our open community events, participate in problem-solving circles, and apply again during our next cycle.

Thank you for your dedication, and keep championing mathematics in your community!

Best regards,  
**MIN Ambassador Selection Council**`
  },
  {
    id: 'org_submission',
    name: 'Organization Partnership Proposal Received',
    category: 'Partnerships',
    description: 'Sent when an educational institution, university club, or NGO submits a partnership proposal.',
    action: 'Triggered on organization application submission',
    from_name: 'Mathematics Initiatives in Nepal',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['applicant_name'],
    sample_variables: {
      applicant_name: 'Kathmandu University Mathematical Society'
    },
    subject: '🤝 Partnership Proposal Received: {{applicant_name}} — MIN Nepal',
    body_markdown: `## Dear Representative of {{applicant_name}},

Thank you for submitting a collaborative partnership proposal to **Mathematics Initiatives in Nepal (MIN)**.

Collaborations with schools, university clubs, non-profits, and educational institutions are fundamental to our mission of democratizing quality mathematics education across Nepal.

Our Executive Committee and Outreach Wing are reviewing your proposal and will reach out to schedule an exploratory discussion.

With sincere respect,  
**MIN Partnerships & Institutional Relations**`
  },
  {
    id: 'org_accepted',
    name: 'Organization Partnership Accepted & Next Steps',
    category: 'Partnerships',
    description: 'Sent when a formal organization collaboration is approved.',
    action: 'Triggered when organization application is accepted',
    from_name: 'Mathematics Initiatives in Nepal',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['applicant_name'],
    sample_variables: {
      applicant_name: 'Kathmandu University Mathematical Society'
    },
    subject: '🎉 Partnership Accepted: Welcoming {{applicant_name}} to collaborate with MIN Nepal',
    body_markdown: `## Dear Team at {{applicant_name}},

We are delighted to share that your partnership proposal with **Mathematics Initiatives in Nepal (MIN)** has been **officially accepted**!

We look forward to executing joint workshops, mathematics competitions, research seminars, and educational outreach initiatives together. A member of our executive committee will be in touch within 3 business days to coordinate the formal memorandum of understanding (MoU) and initial kickoff agenda.

Thank you for joining hands with us to elevate mathematical excellence in Nepal.

In partnership,  
**Executive Committee & Board of Directors**  
*Mathematics Initiatives in Nepal (MIN)*`
  },
  {
    id: 'org_rejected',
    name: 'Organization Partnership Respectful Follow-Up',
    category: 'Partnerships',
    description: 'Sent when a partnership proposal cannot be accommodated.',
    action: 'Triggered when organization application is declined',
    from_name: 'Mathematics Initiatives in Nepal',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['applicant_name'],
    sample_variables: {
      applicant_name: 'Kathmandu Science Club'
    },
    subject: 'Regarding your partnership proposal with MIN Nepal — {{applicant_name}}',
    body_markdown: `## Dear Representative of {{applicant_name}},

Thank you for taking the time to share your partnership proposal with **Mathematics Initiatives in Nepal (MIN)**.

After reviewing your proposal against our current academic commitments and active operational roadmap, we are unable to establish a formal institutional partnership for the current semester.

We deeply admire the vital work your organization is doing for students and hope to explore collaborative opportunities in future cycles.

Warm regards,  
**MIN Partnerships & Strategic Initiatives**`
  },
  {
    id: 'intake_reopened',
    name: 'Intake Reopened Waitlist Notification',
    category: 'Intake Waitlist',
    description: 'Sent to waitlisted applicants when a previously closed form is reopened.',
    action: 'Triggered when an inactive form is re-activated',
    from_name: 'Mathematics Initiatives in Nepal',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['applicant_name', 'form_name', 'slug'],
    sample_variables: {
      applicant_name: 'Mathematics Enthusiast',
      form_name: 'Volunteer Core Team 2026',
      slug: 'volunteer'
    },
    subject: '🚀 Applications are now OPEN for {{form_name}} — MIN Nepal',
    body_markdown: `## Great News, {{applicant_name}}!

You asked us to notify you when applications for **{{form_name}}** reopened. We are delighted to announce that the intake portal is officially live!

👉 **[Submit Your Application Here](https://www.mathsinitiatives.org.np/join/{{slug}})**

We encourage you to submit early as evaluation begins as applications arrive. We cannot wait to read your submission!

Warm regards,  
**MIN Admissions & Recruitment Wing**`
  },
  {
    id: 'reminder_confirmed',
    name: 'Intake Alert Registration Confirmation',
    category: 'Intake Waitlist',
    description: 'Sent when a visitor registers their email on a closed form to receive reopening alerts.',
    action: 'Triggered when user signs up for intake notification',
    from_name: 'Mathematics Initiatives in Nepal',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['form_name'],
    sample_variables: {
      form_name: 'Ambassador Program 2026'
    },
    subject: '✅ Alert Confirmed: We will notify you when {{form_name}} opens — MIN Nepal',
    body_markdown: `## Hello there!

We have successfully registered your alert request for **{{form_name}}**.

The moment the application window goes live, you will be among the very first to receive an email alert with direct application access.

Thank you for your enthusiasm for **Mathematics Initiatives in Nepal (MIN)**!

Warmly,  
**Mathematics Initiatives in Nepal**`
  },
  {
    id: 'admin_new_application',
    name: 'Staff Alert: New Join Application',
    category: 'Admin Alerts',
    description: 'Internal email dispatched to MIN administrators when a new application is submitted.',
    action: 'Triggered on new join application for staff awareness',
    from_name: 'MIN System Bot',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['form_title', 'applicant_name', 'applicant_email', 'category', 'form_data_summary', 'admin_url'],
    sample_variables: {
      form_title: 'Content & Research Fellow',
      applicant_name: 'Kripa Rana',
      applicant_email: 'kripa@example.com',
      category: 'VOLUNTEER',
      form_data_summary: '- **Role:** Content Fellow\n- **Experience:** 2 Years Math Tutoring\n- **Phone:** +977 9812345678',
      admin_url: 'https://www.mathsinitiatives.org.np/admin/applications'
    },
    subject: '📩 New Submission: {{form_title}} — {{applicant_name}}',
    body_markdown: `### 📩 New Application Received

**Applicant:** {{applicant_name}} ({{applicant_email}})  
**Category:** {{category}} · **Form:** {{form_title}}

#### Application Summary:
{{form_data_summary}}

---

👉 [Open Application Review Dashboard]({{admin_url}})`
  },
  {
    id: 'admin_new_submission',
    name: 'Staff Alert: New Content Submission',
    category: 'Admin Alerts',
    description: 'Internal email dispatched to MIN editorial staff when public content is submitted.',
    action: 'Triggered on new content submission for editorial review',
    from_name: 'MIN System Bot',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['content_title', 'submitter_name', 'submitter_email', 'content_type', 'admin_url'],
    sample_variables: {
      content_title: 'Solutions to IMO 2024 Geometry Problem 1',
      submitter_name: 'Sushil Bhattarai',
      submitter_email: 'sushil@example.com',
      content_type: 'ARTICLE',
      admin_url: 'https://www.mathsinitiatives.org.np/admin/submissions'
    },
    subject: '📝 Editorial Queue: "{{content_title}}" by {{submitter_name}}',
    body_markdown: `### 📝 New Content Submitted for Review

**Title:** {{content_title}}  
**Author:** {{submitter_name}} ({{submitter_email}})  
**Format:** {{content_type}}

---

👉 [Moderate & Review Content in Admin Panel]({{admin_url}})`
  },
  {
    id: 'admin_error_report',
    name: 'Staff Alert: Client Error Log',
    category: 'Admin Alerts',
    description: 'Dispatched to developers when a high-severity frontend error occurs in production.',
    action: 'Triggered by /api/report-error on uncaught client exceptions',
    from_name: 'MIN Error Reporter',
    from_email: 'website@mathsinitiatives.org.np',
    variables: ['error_name', 'url', 'error_message', 'error_stack'],
    sample_variables: {
      error_name: 'TypeError: Cannot read property of undefined',
      url: 'https://www.mathsinitiatives.org.np/dmopractice/set-1',
      error_message: 'Cannot read properties of null (reading "marks")',
      error_stack: 'TypeError: at QuestionBank.jsx:142\n    at dispatch (react-dom.js:201)'
    },
    subject: '🚨 Production Error Alert: {{error_name}}',
    body_markdown: `### 🚨 Uncaught Client Exception

**URL:** {{url}}  
**Exception:** \`{{error_name}}\`  
**Message:** {{error_message}}

**Stack Trace:**
\`\`\`
{{error_stack}}
\`\`\``
  }
]
