// src/app/page.tsx
"use client";
import React from 'react';
import LoginForm from './components/login';
import { UserProvider } from './components/UserContext';

export default function Home() {
  return (
    <UserProvider>
    <main>
      <LoginForm />
    </main>
    </UserProvider>
  );
}
