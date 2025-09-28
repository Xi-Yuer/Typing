'use client';

interface Props {
  children: React.ReactNode;
}
export default function Home({ children }: Props) {
  return <div>{children}</div>;
}
