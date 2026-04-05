# Zorvyn Fintech Dashboard

A pristine, highly interactive, and responsive Frontend Finance Dashboard built with React, Vite, and beautiful Vanilla CSS architecture. This project showcases modern UI/UX design capabilities alongside robust component-level architecture aimed at solving advanced financial data visualization scenarios.

## 🚀 Features

- **Advanced Data Aggregation & Charting**: Understand expenditures at a glance with Area and Pie charts powered dynamically by `recharts`.
- **Beru Chat Bot**: An integrated, persistent floating chat assistant that expertly parses user inputs and provides conversational answers to standard platform queries, with an autonomous "escalate to team" handoff logic.
- **Privacy Mode 👁️**: Inspired by industry-leading banking apps, a one-click security toggle masks all sensitive dollar amounts on the screen, optimizing for safe usage in public spaces.
- **Asynchronous Skeleton Loading**: Implements artificial backend latency loading screens, showcasing sophisticated, async-ready component rendering boundaries without generic spinners.
- **Robust Transaction Management Engine**: Filtering by type (Income/Expense), temporal ranges (Last 7 Days vs. Last 30 Days), and sorting (Amount vs. Timestamp).
- **Physical CSV Data Export**: Harnesses Blob manipulation and the browser DOM to encode the current view of the user's transaction data into a cleanly formatted `.csv` payload for physical download.
- **Role-Based Access (RBAC) Simulation**: Seamlessly toggle between "Viewer" and "Admin" privileges. Only Admins can invoke the Form API models to securely Add or Edit mock transactions.
- **Dark & Light Mode Integration**: Complete cross-application color-theory integration utilizing native CSS tokens. (Includes a specialized Dark Teal aesthetic experiment for Light Mode).
- **Zero-Backend Data Persistence**: True state-survival out of the box natively tied into local browser `Storage` APIs. Your mock transactions, theme choices, and settings exist between refreshes.

## 🛠️ Technology Stack

- **Framework**: `React.js` (bootstrapped with `Vite` for lightning-fast HMR)
- **Styling**: `Vanilla CSS` with complex native variables (`:root`). Zero dependance on Tailwind or external UI bulky frameworks to prove deep CSS mastery.
- **Data Visualization**: `Recharts`
- **Iconography**: `lucide-react`
- **Deployment**: Configured out of the box for platform deployments (e.g., Vercel).

## 💻 Getting Started Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-github-repo-url>
   cd "Zorvyn Project"
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Run the local development server:**
   ```bash
   npm run dev
   ```

4. **View the Application:**
   Open your browser and navigate to `http://localhost:5173`.

## 🤝 Project Structure

```text
├── public/                 # Static assets (including the Logo png mapping)
├── src/
│   ├── components/         # Reusable React components (Layout, Transactions, Overview, etc.)
│   ├── context/            # React Context API logic housing the global simulated state
│   ├── index.css           # Global CSS Architecture, resets, variables, skeleton keyframes
│   ├── App.jsx             # Main router tree
│   └── main.jsx            # Entry point
└── package.json            # Configuration and dependencies
```

---
*Developed as an internship assignment prototype demonstrating production-level frontend capabilities and clean code practices.*
