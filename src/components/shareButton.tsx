import { Button } from '@mui/material';
import { Share2 } from 'lucide-react';
import { forwardRef } from 'react';

export const ShareButton = forwardRef<
  HTMLButtonElement,
  {
    disabled?: boolean;
    onClick: () => void;
  }
>((properties, ref) => {
  const { disabled, onClick } = properties;
  return (
    <Button
      type="button"
      variant="contained"
      color="secondary"
      disabled={disabled}
      onClick={() => onClick()}
      startIcon={<Share2 size={18} />}
      ref={ref}
    >
      Share
    </Button>
  );
});

ShareButton.displayName = 'ShareButton';
