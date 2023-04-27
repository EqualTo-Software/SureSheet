import { ArrowUpRight } from 'lucide-react';
import styles from './infoBar.module.css';
import clsx from 'clsx';

export function InfoBar(
  properties: {
    className?: string;
    rounded?: boolean;
    showGithubLink?: boolean;
  } & (
    | {
        canToggleMenuBar: true;
        isMenuBarVisible: boolean;
        onToggle: () => void;
      }
    | {
        canToggleMenuBar?: false;
      }
  ),
) {
  return (
    <div
      className={clsx(properties.className, styles.infoBar, properties.rounded && styles.rounded)}
    >
      <span>
        {'Powered by '}
        <a href="https://www.equalto.com/sheets" target="_blank">
          EqualTo Sheets
        </a>
        : Spreadsheets as a Service for developers.
      </span>
      <div className={clsx(styles.actions)}>
        {properties.canToggleMenuBar && (
          <span
            className={clsx(styles.toggleUI)}
            role="button"
            onClick={() => properties.onToggle()}
          >
            {properties.isMenuBarVisible ? 'Hide UI' : 'Show UI'}
          </span>
        )}
        {properties.showGithubLink && (
          <a
            className={clsx(styles.githubLink)}
            href="https://www.github.com/EqualTo-Software/SureSheet"
            target="_blank"
          >
            GitHub repo <ArrowUpRight size={9} />
          </a>
        )}
      </div>
    </div>
  );
}
