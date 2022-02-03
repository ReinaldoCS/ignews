import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.scss';

export function SingInButton() {
  const isUserLoggedIn = true;
  
  return isUserLoggedIn ? (
    <button
      type="button"
      className={styles.singInButton}
    >
      <FaGithub color="#04D361" />
      Reinaldo Correia
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.singInButton}
    >
      <FaGithub color="#EBA417" />
      Sing In with GitHub
    </button>
  )
}