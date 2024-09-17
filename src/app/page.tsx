// src/app/page.tsx
"use client";
import React from 'react';
import LoginForm from './components/login';
import './globals.css';
export default function Home() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}
