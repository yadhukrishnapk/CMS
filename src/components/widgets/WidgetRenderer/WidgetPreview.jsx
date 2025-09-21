import React from 'react';

export const RichTextPreview = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="4" fill="#DBEAFE"/>
    <rect x="4" y="6" width="24" height="4" rx="1" fill="#2563EB"/>
    <rect x="4" y="12" width="20" height="4" rx="1" fill="#2563EB"/>
    <rect x="4" y="18" width="24" height="4" rx="1" fill="#2563EB"/>
    <rect x="4" y="24" width="16" height="4" rx="1" fill="#2563EB"/>
  </svg>
);

export const ImagePreview = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="4" fill="#DBEAFE"/>
    <rect x="4" y="4" width="24" height="24" rx="2" fill="#93C5FD"/>
    <circle cx="10" cy="10" r="3" fill="#2563EB"/>
    <path d="M4 28L12 20L20 26L28 18" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ButtonPreview = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="4" fill="#DBEAFE"/>
    <rect x="6" y="10" width="20" height="12" rx="4" fill="#2563EB"/>
    <rect x="10" y="14" width="12" height="4" rx="1" fill="#FFFFFF"/>
  </svg>
);

export const HeadingPreview = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="4" fill="#DBEAFE"/>
    <rect x="4" y="8" width="24" height="6" rx="2" fill="#2563EB"/>
    <rect x="4" y="18" width="20" height="4" rx="1" fill="#2563EB"/>
  </svg>
);

export const SpacerPreview = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="4" fill="#DBEAFE"/>
    <rect x="4" y="4" width="24" height="24" rx="2" fill="none" stroke="#2563EB" strokeWidth="2" strokeDasharray="4 4"/>
  </svg>
);

export const DividerPreview = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="4" fill="#DBEAFE"/>
    <rect x="4" y="15" width="24" height="2" rx="1" fill="#2563EB"/>
  </svg>
);

export const WebPageInterfacePreview = () => (
  <img src="/webPage1.png" alt="Web Page Interface Preview" style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }} />
);