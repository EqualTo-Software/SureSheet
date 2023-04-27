import { Stack } from '@mui/system';
import Image from 'next/image';
import styles from './mainLayout.module.css';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export function LogoStack(properties: { siteName: string }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <a className={styles.logoLink} href="https://www.equalto.com/" target="_blank">
        <Image
          priority
          src={`${publicRuntimeConfig.basePath}/images/equalto.svg`}
          width={32}
          height={32}
          alt="EqualTo Logo"
        />
      </a>
      <Stack direction="row" alignItems="center" spacing={0}>
        <code className={styles.siteName}>{properties.siteName}</code>
        <span className={styles.betaTag}>Beta</span>
      </Stack>
    </Stack>
  );
}
