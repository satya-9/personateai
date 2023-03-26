import { createStyles, getStylesRef} from '@mantine/core';

export const useStyles = createStyles((theme) => ({
    child: {
      // assign ref to element
      ref: getStylesRef('child'),
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
      padding: theme.spacing.md,
      borderRadius: theme.radius.sm,
      boxShadow: theme.shadows.md,
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      width:"60%",
      height:"60%",
      position:"relative",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }));

export const mantinetheme={
    // Override any other properties from default theme
    fontFamily: 'Open Sans, sans serif',
    spacing: { xs: '1rem', sm: '1.2rem', md: '1.8rem', lg: '2.2rem', xl: '2.8rem' },
  }