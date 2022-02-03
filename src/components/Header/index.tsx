import Image from 'next/image';

import { SingInButton } from '../SingInButton';

import logo from '../../../public/images/logo.svg';

import styles from './styles.module.scss'; 

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent }>
        <Image
          src={logo}
          alt="ig.news"
        />

        <nav>
          <a className={styles.active}>Home</a>
          <a>Posts</a>
        </nav>

        <SingInButton />
      </div>
    </header>
  )
}