import { useSession, signIn, signOut } from 'next-auth/react';

import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import styles from './styles.module.scss';

export function SingInButton() {
  const { data: session } = useSession();
  
  return session ? (
    <button
      type="button"
      className={styles.singInButton}
      onClick={() => signOut()}
    >
      <FaGithub color="#04D361" />
      {session.user.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.singInButton}
      onClick={() => signIn('github')}
    >
      <FaGithub color="#EBA417" />
      Sing In with GitHub
    </button>
  )
}