import { Stack } from '@mui/system';
import { PropsWithChildren, useMemo, useState } from 'react';
import styles from './mainLayout.module.css';
import { ToolbarContext, ToolbarContextValue } from './toolbar';
import clsx from 'clsx';
import { InfoBar } from './infoBar';
import { LogoStack } from './logoStack';

export default function MainLayout(
  properties: PropsWithChildren<{
    canHideMenuBar?: boolean;
  }>,
) {
  const { children, canHideMenuBar } = properties;

  // State is used instead of ref on purpose. This way context refreshes appropriately.
  const [toolbarNode, setToolbarNode] = useState<HTMLDivElement | null>(null);
  const toolbarContext = useMemo((): ToolbarContextValue => ({ toolbarNode }), [toolbarNode]);

  const [isMenuBarVisible, setMenuBarVisible] = useState(!canHideMenuBar);

  return (
    <div className={styles.layout}>
      <div className={styles.infoBarContainer}>
        {!canHideMenuBar ? (
          <InfoBar rounded showGithubLink />
        ) : (
          <InfoBar
            rounded
            showGithubLink
            canToggleMenuBar
            onToggle={() => setMenuBarVisible((previous) => !previous)}
            isMenuBarVisible={isMenuBarVisible}
          />
        )}
      </div>
      <div className={clsx(styles.menuBar, !isMenuBarVisible && styles.hidden)}>
        <Stack direction="row" justifyContent="space-between">
          <LogoStack siteName="SureSheet" />
          <div style={{ flex: 1 }} ref={(ref) => setToolbarNode(ref)} />
        </Stack>
      </div>
      <div className={styles.content}>
        <ToolbarContext.Provider value={toolbarContext}>{children}</ToolbarContext.Provider>
      </div>
    </div>
  );
}
