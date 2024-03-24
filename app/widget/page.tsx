import React from 'react';

import type { GetStaticProps } from 'next'

export type Repo = {
  name: string
  stargazers_count: number
}

export const getStaticProps = (async (context) => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  return { props: { repo } }
}) satisfies GetStaticProps<{
  repo: Repo
}>

const CopyButton = ({ repo }) => {
  const copyToClipboard = async () => {
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(repo.name);
      alert('Script copied to clipboard!');
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = repo.name;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      alert('Script copied to clipboard!');
    }
  };

  return (
    <button onClick={copyToClipboard} style={{ cursor: 'pointer' }}>
      Copy to Clipboard
    </button>
  );
};

export default CopyButton