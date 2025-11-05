import React from 'react';

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

export const BotIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 015.69 3.117.75.75 0 01-.88.942 5.25 5.25 0 00-9.62 0 .75.75 0 01-.88-.942z" clipRule="evenodd" />
    <path d="M12.965 18.332A.75.75 0 0112 18.75a.75.75 0 01-.965-.418 8.25 8.25 0 00-1.396-2.52.75.75 0 01.44-.94 6.741 6.741 0 013.842 0 .75.75 0 01.44.94 8.25 8.25 0 00-1.396 2.52z" />
  </svg>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
      clipRule="evenodd"
    />
  </svg>
);

export const ResetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-4.5a.75.75 0 000 1.5h6a.75.75 0 00.75-.75v-6a.75.75 0 00-1.5 0v4.502a9 9 0 00-15.06 4.036.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75l-.013-.013A7.5 7.5 0 014.755 10.059zm14.49 3.89a7.5 7.5 0 01-12.548 3.364l-1.903-1.903h4.5a.75.75 0 000-1.5h-6a.75.75 0 00-.75.75v6a.75.75 0 001.5 0v-4.502a9 9 0 0015.06-4.036.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75l.013.013z"
      clipRule="evenodd"
    />
  </svg>
);

export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
    <path d="M6 10.5a.75.75 0 01.75.75v1.5a4.5 4.5 0 004.5 4.5h.75a4.5 4.5 0 004.5-4.5v-1.5a.75.75 0 011.5 0v1.5a6 6 0 11-12 0v-1.5a.75.75 0 01.75-.75z" />
  </svg>
);

export const StopCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 011.06 0L12 9.94l.66-1.72a.75.75 0 111.42.54l-1.12 2.92a.75.75 0 01-1.42 0L9.28 9.72a.75.75 0 010-1.06zM11.25 12.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z" clipRule="evenodd" />
        <path d="M10.273 15.25a.75.75 0 10-1.054 1.054 9.75 9.75 0 01-1.06-1.06.75.75 0 001.06-1.06 8.25 8.25 0 00-1.282-1.282.75.75 0 10-1.06 1.06 9.75 9.75 0 011.054-1.054.75.75 0 101.06 1.06 8.25 8.25 0 001.282 1.282zM15.25 13.727a.75.75 0 10-1.06-1.06 8.25 8.25 0 00-1.282-1.282.75.75 0 10-1.06 1.06 9.75 9.75 0 011.054-1.054.75.75 0 101.06 1.06 8.25 8.25 0 001.282 1.282z" />
    </svg>
);

export const SpeakerWaveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.348 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
    <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
  </svg>
);