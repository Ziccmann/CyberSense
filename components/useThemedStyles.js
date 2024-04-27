// useThemedStyles.js
import { useContext } from 'react';
import { ThemeContext } from '../extras/ThemeContext';
import { getThemeStyles } from '../extras/theme-styles';

const useThemedStyles = () => {
  const { theme } = useContext(ThemeContext);
  const styles = getThemeStyles(theme);
  return styles;
};

export default useThemedStyles;
