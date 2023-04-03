import { Stack } from '@mui/system';
import { ArrowUpRight } from 'lucide-react';
import getConfig from 'next/config';
import Image from 'next/image';
import { PropsWithChildren, useMemo, useState } from 'react';
import styles from './mainLayout.module.css';
import { ToolbarContext, ToolbarContextValue } from './toolbar';
import clsx from 'clsx';

const { publicRuntimeConfig } = getConfig();

export default function MainLayout(
  properties: PropsWithChildren<{
    canHideMenuBar?: boolean;
  }>,
) {
  const { children, canHideMenuBar } = properties;

  // State is used instead of ref on purpose. This way context refreshes appropriately.
  const [toolbarNode, setToolbarNode] = useState<HTMLDivElement | null>(null);
  const toolbarContext = useMemo((): ToolbarContextValue => ({ toolbarNode }), [toolbarNode]);

  const [isMenuBarVisible, setMenuBarVisible] = useState(!properties.canHideMenuBar);

  return (
    <div className={styles.layout}>
      <div className={styles.infoBarContainer}>
        {!properties.canHideMenuBar ? (
          <div className={clsx(styles.infoBar, styles.centered)}>
            {
              'EqualTo SureSheet is an open source tech demo, showing how you can easily build software '
            }
            {'using our product EqualTo Sheets - "Spreadsheets as a service" for developers. '}
            <a href="https://www.github.com/EqualTo-Software/SureSheet" target="_blank">
              See project on GitHub <ArrowUpRight size={9} />
            </a>
          </div>
        ) : (
          <div className={clsx(styles.infoBar)}>
            <Stack direction="row" justifyContent="space-between">
              <span>
                {'Powered by '}
                <a href="https://www.equalto.com/sheets" target="_blank">
                  EqualTo Sheets
                </a>
                : Spreadsheets as a Service for developers.
              </span>
              <div className={clsx(styles.actions)}>
                <span
                  className={clsx(styles.toggleUI)}
                  role="button"
                  onClick={() => setMenuBarVisible((current) => !current)}
                >
                  {isMenuBarVisible ? 'Hide UI' : 'Show UI'}
                </span>
                <a
                  className={clsx(styles.githubLink)}
                  href="https://www.github.com/EqualTo-Software/SureSheet"
                  target="_blank"
                >
                  GitHub repo <ArrowUpRight size={9} />
                </a>
              </div>
            </Stack>
          </div>
        )}
      </div>
      <div className={clsx(styles.menuBar, !isMenuBarVisible && styles.hidden)}>
        <Stack direction="row" justifyContent="space-between">
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
              <code className={styles.siteName}>SureSheet</code>
              <span className={styles.betaTag}>Beta</span>
            </Stack>
          </Stack>
          <div style={{ flex: 1 }} ref={(ref) => setToolbarNode(ref)} />
        </Stack>
      </div>
      <div className={styles.content}>
        <ToolbarContext.Provider value={toolbarContext}>{children}</ToolbarContext.Provider>
      </div>
    </div>
  );
}
