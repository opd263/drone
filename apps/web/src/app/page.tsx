// apps/web/src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  // SSR redirect from “/” → “/admin”
  redirect('/admin');
}
