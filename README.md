# Nexara Customer Engagement Platform

A comprehensive customer engagement platform built with React, TypeScript, and modern web technologies.

## 🚀 Live Deployment

**Production URL**: https://nexara.netlify.app  
**Lovable Project**: https://lovable.dev/projects/402b3d7e-4c88-4c28-b1aa-ae33f228fa2c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/402b3d7e-4c88-4c28-b1aa-ae33f228fa2c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🏗️ Architecture & Features

### **Core Technologies**
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router 6 with deep linking support
- **State Management**: React Query + React hooks
- **Hosting**: Netlify with SPA fallback configuration

### **Key Features**
- ✅ **Campaign Management**: Full-featured campaign creation and management
- ✅ **Responsive Design**: Mobile-first approach with full viewport utilization
- ✅ **Deep Linking**: All routes directly accessible via URL
- ✅ **Premium Gates**: Upsell pages for unfinished features
- ✅ **Form Validation**: Comprehensive validation with legacy migration
- ✅ **Collapsible UI**: Enhanced UX with collapsible summary sections

### **Available Routes**
- `/` → Redirects to campaigns
- `/engage/campaigns` → Campaign management (active)
- `/audiences` → Premium gate
- `/analytics` → Premium gate  
- `/content` → Premium gate
- `/dashboards` → Premium gate
- `/engage/journey` → Premium gate
- `/engage/onsite` → Premium gate

## 🚀 Deployment

### **Automatic Deployment**
- **Netlify**: Auto-deploys from `main` branch
- **SPA Routing**: Configured with `_redirects` and `netlify.toml`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

### **Manual Deployment**
1. Push changes to `main` branch
2. Netlify automatically builds and deploys
3. Changes live within 1-2 minutes

## 🛠️ Development

### **Local Development**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Project Structure**
```
src/
├── components/          # Reusable UI components
│   ├── campaigns/      # Campaign-specific components
│   ├── layout/         # Layout components
│   └── ui/            # shadcn/ui components
├── pages/              # Route components
├── hooks/              # Custom React hooks
└── lib/               # Utilities and helpers
```

## 📞 Contact & Support

For premium feature access or support:
- **Email**: networker.udayan@gmail.com
- **Subject**: Premium Access Request - [Feature Name]

## 🔗 Links

- **Production**: https://nexara.netlify.app
- **Lovable Project**: https://lovable.dev/projects/402b3d7e-4c88-4c28-b1aa-ae33f228fa2c
- **Repository**: https://github.com/Product-Nexara/Nexara
