# KodNest Premium Build System

m A premium, intentional, and confident design system for B2C SaaS applications.

![Design System Demo](https://via.placeholder.com/800x400?text=KodNest+Premium+Design+System)

## Design Philosophy

- **Calm**: No visual noise, no gradients, no neon colors.
- **Intentional**: Every pixel and interaction has a purpose.
- **Coherent**: Strict adherence to a limited 4-color palette and mathematical spacing scale.
- **Confident**: Bold serif typography paired with clean sans-serif body text.

## Features

- **Strict Token System**: CSS variables for colors, typography, and spacing (8px scale).
- **Core Components**:
    - **TopBar**: Persistent project identity and progress tracking.
    - **ProofFooter**: Interactive "Proof of Work" checklist (UI Built, Logic Working, Test Passed, Deployed).
    - **WorkspaceLayout**: Rigid 70/30 split for primary content and secondary tools.
    - **SecondaryPanel**: Calm utility panel with prompt actions.
- **Zero Dependencies**: (Aside from React/Vite/Lucide) - Pure CSS implementation.

## Tech Stack

- **Framework**: React + Vite
- **Styling**: Vanilla CSS (CSS Variables)
- **Icons**: Lucide React

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kodnest-premium-system.git
   ```

2. **Install dependencies**
   ```bash
   cd kodnest-premium-system
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/          # Core design system components
│   ├── Layout.jsx       # Main application shell
│   ├── TopBar.jsx       # Global header
│   ├── ProofFooter.jsx  # Verification footer
│   └── ...
├── index.css            # Design tokens & global styles
├── App.jsx              # Demo application
└── main.jsx             # Entry point
```

## License

MIT
