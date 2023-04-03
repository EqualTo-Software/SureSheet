import { postShareWorkbook } from '@/lib/client/postShare';
import {
  Button,
  CircularProgress,
  Divider,
  Popover,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { AlertOctagon, Copy, Download } from 'lucide-react';
import getConfig from 'next/config';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './editorView.module.css';
import { ShareButton } from './shareButton';
import { useToast } from './toastProvider';
import { ToolbarTool } from './toolbar';

const { publicRuntimeConfig } = getConfig();

export type EditorViewProperties = {
  /**
   * Workbook ID of workbook to load from EqualTo Sheets. It's not mutated, and this ID shouldn't
   * be changed without component reload (use key if needed to force remount).
   */
  workbookId: string;
  onNew?: () => void;
};

export default function EditorView(properties: EditorViewProperties) {
  const { workbookId, onNew } = properties;

  const [latestJson, setLatestJson] = useState<string | null>(null);

  const [isShareOpen, setShareOpen] = useState(false);
  const [shareError, setShareError] = useState(false);
  const [sharedWorkbookId, setSharedWorkbookId] = useState<string | null>(null);
  const shareButtonReference = useRef<HTMLButtonElement | null>(null);

  const onChange = useCallback((json: string) => {
    setSharedWorkbookId(null);
    setShareError(false);
    setLatestJson(json);
  }, []);

  const { pushToast } = useToast();

  const share = () => {
    setShareOpen(true);
    if (latestJson !== null && sharedWorkbookId === null) {
      setShareError(false);
      postShareWorkbook({ workbookJson: latestJson }).then(
        ({ id }) => {
          setSharedWorkbookId(id);
        },
        () => {
          pushToast({ type: 'error', message: 'Could not share the workbook.' });
          setShareError(true);
        },
      );
    }
  };

  return (
    <>
      <ToolbarTool>
        <Stack direction="row" justifyContent="space-between">
          <div>
            <div className={styles.toolbarDivider} />
            <NewButton onClick={onNew}>New</NewButton>
          </div>
          <ShareButton disabled={latestJson === null} onClick={share} ref={shareButtonReference} />
        </Stack>
        <Popover
          className={styles.popover}
          open={isShareOpen}
          onClose={() => setShareOpen(false)}
          anchorEl={shareButtonReference.current}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          marginThreshold={5}
        >
          <Stack direction="column" spacing={1}>
            <Typography>Anyone with the link can access the spreadsheet.</Typography>
            <TextField
              autoFocus
              name="share-link"
              value={
                !shareError
                  ? sharedWorkbookId
                    ? getWorkbookViewLink(sharedWorkbookId)
                    : ''
                  : 'Could not share the workbook.'
              }
              error={shareError}
              InputProps={{
                readOnly: true,
                startAdornment:
                  sharedWorkbookId === null ? (
                    !shareError ? (
                      <Stack direction="column" justifyContent="center">
                        <CircularProgress size={18} />
                      </Stack>
                    ) : (
                      <Stack direction="column" justifyContent="center" sx={{ mr: 1 }}>
                        <AlertOctagon size={18} color="red" />
                      </Stack>
                    )
                  ) : undefined,
                endAdornment:
                  sharedWorkbookId !== null ? (
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(getWorkbookViewLink(sharedWorkbookId));
                      }}
                    >
                      <Copy style={{ marginRight: '5px' }} />
                      Copy
                    </Button>
                  ) : undefined,
              }}
            />
            <Divider />
            <Button
              disabled={sharedWorkbookId === null}
              href={`${publicRuntimeConfig.basePath}/api/sheets-proxy/api/v1/workbooks/${sharedWorkbookId}/xlsx`}
              type="button"
              variant="contained"
              color="secondary"
              startIcon={<Download size={18} />}
            >
              Download .xlsx file
            </Button>
          </Stack>
        </Popover>
      </ToolbarTool>
      <Workbook workbookId={workbookId} onChange={onChange} />
    </>
  );
}

/**
 * Important note: Properties updates are ignored at the moment. Attach key to force remount.
 *
 * Workbook ID is not updated on EqualTo Sheets! Save requests are stopped.
 */
function Workbook(properties: { workbookId: string; onChange?: (json: string) => void }) {
  const workbookIdRef = useRef(properties.workbookId);
  const onChangeRef = useRef(properties.onChange);

  useEffect(() => {
    const workbookSlot = document.getElementById('workbook-slot');
    if (workbookSlot) {
      const { unmount } = EqualToSheets.load(workbookIdRef.current, workbookSlot, {
        syncChanges: false,
        onJSONChange: (_workbookId, workbookJson) => {
          onChangeRef.current?.(workbookJson);
        },
      });

      return () => {
        unmount();
      };
    }
  }, []);

  return <div id="workbook-slot" style={{ position: 'absolute', inset: 10 }} />;
}

function getWorkbookViewLink(workbookId: string) {
  return `${window.location.origin}${publicRuntimeConfig.basePath}/view/${encodeURIComponent(
    workbookId,
  )}`;
}

const NewButton = styled(Button)({
  color: '#21243A',
  padding: '5px',
  minWidth: 0,
  '&:hover': {
    background: '#F4F4F4',
  },
});
